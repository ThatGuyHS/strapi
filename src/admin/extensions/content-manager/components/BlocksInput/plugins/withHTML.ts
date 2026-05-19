import { Descendant, Transforms, Node, Text, Element, Editor } from 'slate';
import { jsx } from 'slate-hyperscript';

type TElementTag =
  | 'A'
  | 'BLOCKQUOTE'
  | 'H1'
  | 'H2'
  | 'H3'
  | 'H4'
  | 'H5'
  | 'H6'
  | 'IMG'
  | 'LI'
  | 'OL'
  | 'P'
  | 'PRE'
  | 'UL';
type TTextTag = 'CODE' | 'DEL' | 'EM' | 'I' | 'S' | 'STRONG' | 'U';

const ELEMENT_TAGS = {
  A: (el: HTMLElement) => ({ type: 'link', url: el.getAttribute('href') }),
  BLOCKQUOTE: () => ({ type: 'quote' }),
  H1: () => ({ type: 'heading', level: 1 }),
  H2: () => ({ type: 'heading', level: 2 }),
  H3: () => ({ type: 'heading', level: 3 }),
  H4: () => ({ type: 'heading', level: 4 }),
  H5: () => ({ type: 'heading', level: 5 }),
  H6: () => ({ type: 'heading', level: 6 }),
  IMG: (el: HTMLElement) => {
    // Completely skip image creation from pasted HTML
    // Images should only be added through Strapi's image upload mechanism
    // This prevents errors from invalid image structures
    return null;
  },
  LI: () => ({ type: 'list-item' }),
  UL: () => ({ type: 'list', format: 'unordered' }),
  OL: () => ({ type: 'list', format: 'ordered' }),
  P: () => ({ type: 'paragraph' }),
  PRE: () => ({ type: 'code' }),
};

const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  B: () => ({ bold: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
};

interface TextAttribute {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

function getSpan(el: HTMLElement) {
  const attrs: TextAttribute[] = [];
  if (el.style.fontWeight === '700') {
    attrs.push({ bold: true });
  }
  if (el.style.fontStyle === 'italic') {
    attrs.push({ italic: true });
  }
  if (el.style.textDecoration === 'underline') {
    attrs.push({ underline: true });
  }
  return attrs.reduce<TextAttribute>((acc, attr) => ({ ...acc, ...attr }), {});
}

function checkIfGoogleDoc(el: HTMLElement) {
  return el.nodeName === 'B' && el.id?.startsWith('docs-internal-guid-');
}

// AGGRESSIVE CLEANING FUNCTIONS

// Check if text contains any drag-related content
function containsDragText(text: string | null): boolean {
  if (!text) return false;
  
  const lowerText = text.toLowerCase();
  return lowerText.includes('drag') || 
         lowerText.includes('drg') || 
         lowerText.match(/dr+a+g+/i) !== null;
}

// Aggressively clean HTML string
function aggressiveCleanHtml(html: string): string {
  if (!html) return html;
  
  // First, try to identify and remove any hidden elements that might contain drag text
  let cleanedHtml = html.replace(/<[^>]*style="[^"]*display:\s*none[^"]*"[^>]*>.*?<\/[^>]*>/gi, '');
  
  // Remove any elements with drag-related attributes or classes
  cleanedHtml = cleanedHtml.replace(/<[^>]*(?:draggable|data-drag|class="[^"]*drag[^"]*")[^>]*>.*?<\/[^>]*>/gi, '');
  
  // Remove any instances of "drag" text (with variations)
  cleanedHtml = cleanedHtml.replace(/drag+/gi, '');
  cleanedHtml = cleanedHtml.replace(/dr+a+g+/gi, '');
  
  return cleanedHtml;
}

// Recursively clean a fragment to remove any drag text
function cleanFragment(fragment: any): any {
  if (!fragment) return fragment;
  
  // If it's an array, clean each item
  if (Array.isArray(fragment)) {
    return fragment.map(cleanFragment);
  }
  
  // If it's a text node
  if (Text.isText(fragment)) {
    if (fragment.text && containsDragText(fragment.text)) {
      return { ...fragment, text: fragment.text.replace(/dr+a+g+/gi, '') };
    }
    return fragment;
  }
  
  // If it's an element node
  if (Element.isElement(fragment)) {
    return {
      ...fragment,
      children: Array.isArray(fragment.children) 
        ? fragment.children.map(cleanFragment) 
        : fragment.children
    };
  }
  
  return fragment;
}

const deserialize = (
  el: ChildNode,
  parentNodeName?: string
): string | null | Descendant | (string | null | { text: string } | Descendant | Node)[] => {
  // Handle text nodes
  if (el.nodeType === 3) {
    const text = el.textContent;
    
    // Aggressively filter out any drag-related text
    if (containsDragText(text)) {
      return { text: text ? text.replace(/dr+a+g+/gi, '') : '' };
    }
    
    return text;
  } 
  // Handle non-element nodes
  else if (el.nodeType !== 1) {
    return null;
  } 
  // Handle BR elements
  else if (el.nodeName === 'BR') {
    if (parentNodeName) return el.textContent;
    return jsx('element', { type: 'paragraph' }, [{ text: '' }]);
  }
  
  // Skip elements with drag-related content
  const htmlEl = el as HTMLElement;
  if (
    htmlEl.getAttribute('draggable') === 'true' || 
    htmlEl.hasAttribute('data-drag') || 
    (htmlEl.className && htmlEl.className.includes('drag')) ||
    (htmlEl.id && htmlEl.id.includes('drag')) ||
    (htmlEl.textContent && containsDragText(htmlEl.textContent))
  ) {
    // Instead of skipping entirely, replace with cleaned content
    const cleanedText = htmlEl.textContent ? htmlEl.textContent.replace(/dr+a+g+/gi, '') : '';
    if (cleanedText.trim() === '') {
      return { text: '' };
    }
    return { text: cleanedText };
  }
  
  const isGoogleDoc = checkIfGoogleDoc(htmlEl);
  const { nodeName } = el;
  let parent = el;

  if (nodeName === 'PRE' && el.childNodes[0] && el.childNodes[0].nodeName === 'CODE') {
    parent = el.childNodes[0];
  }
  
  let children = Array.from(parent.childNodes)
    .map((childNode) =>
      deserialize(childNode, !isGoogleDoc ? (el.nodeName as TElementTag) : undefined)
    )
    .flat()
    .filter((child): child is Descendant => child !== null);

  if (children.length === 0) {
    children = [{ text: '' }];
  }

  if (nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  // Google Docs wraps the content in a <b> tag with an id starting with 'docs-internal-guid-'
  if (isGoogleDoc) {
    return jsx('fragment', {}, children);
  }

  // Google Docs adds a <p> tag in a <li> tag, that must be omitted
  if (nodeName === 'P' && parentNodeName && ELEMENT_TAGS[parentNodeName as TElementTag]) {
    return jsx('fragment', {}, children);
  }

  // Google Docs expresses bold/italic/underlined text with a <span> tag
  if (nodeName === 'SPAN') {
    const attrs = getSpan(htmlEl);

    if (attrs && Object.keys(attrs).length > 0) {
      return children.map((child) => jsx('text', attrs, child));
    }
  }

  if (ELEMENT_TAGS[nodeName as TElementTag]) {
    const attrs = ELEMENT_TAGS[nodeName as TElementTag](htmlEl);
    // Skip elements that return null (e.g., IMG without valid src)
    if (attrs === null) {
      return null;
    }
    // Image elements are void and should not have children
    if (attrs.type === 'image') {
      return jsx('element', attrs, []);
    }
    if (children) {
      return jsx('element', attrs, children);
    }
  }

  if (TEXT_TAGS[nodeName as TTextTag]) {
    const attrs = TEXT_TAGS[nodeName as TTextTag]();
    return children.map((child) => jsx('text', attrs, child));
  }

  return children;
};

interface CustomEditor extends Editor {
  insertData: (data: DataTransfer) => void;
  isVoid: (element: any) => boolean;
}

export function withHtml(editor: Editor) {
  const { insertData, isVoid, apply } = editor as CustomEditor;

  // Intercept all operations to remove invalid images before they're applied
  (editor as CustomEditor).apply = (operation: any) => {
    // If inserting a node, validate it's not an invalid image
    if (operation.type === 'insert_node' && operation.node) {
      const node = operation.node;
      // If it's an image without a valid url, skip the operation
      if (Element.isElement(node) && node.type === 'image') {
        if (!node.url || typeof node.url !== 'string' || node.url.trim() === '') {
          console.warn('Skipping invalid image node:', node);
          return; // Don't apply the operation
        }
      }
    }
    
    // If setting node properties on an image, validate
    if (operation.type === 'set_node' && operation.properties) {
      const path = operation.path;
      try {
        const [node] = Editor.node(editor, path);
        if (Element.isElement(node) && node.type === 'image') {
          // If trying to set properties that would make image invalid, skip
          if (operation.properties.url === null || operation.properties.url === undefined || 
              (typeof operation.properties.url === 'string' && operation.properties.url.trim() === '')) {
            console.warn('Preventing invalid image property update:', operation.properties);
            return; // Don't apply the operation
          }
        }
      } catch (e) {
        // If we can't get the node, continue with the operation
      }
    }
    
    // Apply the operation normally
    apply(operation);
  };

  (editor as CustomEditor).isVoid = (element) => {
    // Safely check if element is an image
    if (element && element.type === 'image') {
      // If image doesn't have a valid url, don't treat it as void (will be removed by normalization)
      if (!element.url || typeof element.url !== 'string' || element.url.trim() === '') {
        return false;
      }
      return true;
    }
    return isVoid(element);
  };

  (editor as CustomEditor).insertData = (data) => {
    try {
      // Get HTML and text from clipboard
      const html = data.getData('text/html');
      const text = data.getData('text/plain');
      
      // Log for debugging
      console.log('Clipboard HTML:', html);
      console.log('Clipboard Text:', text);
      
      // Check for drag text
      const hasDragText = (html && containsDragText(html)) || (text && containsDragText(text));
      if (hasDragText) {
        console.log('Found drag-related content in clipboard');
      }
      
      // Process HTML if available
      if (html) {
        // Aggressively clean the HTML - remove ALL image tags before parsing
        let cleanHtml = aggressiveCleanHtml(html);
        // Remove all <img> tags completely (including emoji images)
        cleanHtml = cleanHtml.replace(/<img[^>]*>/gi, '');
        // Remove image elements with emoji-related classes or data attributes
        cleanHtml = cleanHtml.replace(/<img[^>]*(?:class|data-emoji|data-emoji-)[^>]*>/gi, '');
        // Remove any image-related data attributes
        cleanHtml = cleanHtml.replace(/\s*data-image[^=]*="[^"]*"/gi, '');
        cleanHtml = cleanHtml.replace(/\s*data-img[^=]*="[^"]*"/gi, '');
        cleanHtml = cleanHtml.replace(/\s*data-emoji[^=]*="[^"]*"/gi, '');
        // Remove span elements that might contain emoji images
        cleanHtml = cleanHtml.replace(/<span[^>]*style="[^"]*background-image[^"]*"[^>]*>.*?<\/span>/gi, '');
        
        try {
          // Parse the cleaned HTML
          const parsed = new DOMParser().parseFromString(cleanHtml, 'text/html');
          
          // Remove ALL img elements from the DOM before processing (including emoji images)
          const allImages = parsed.querySelectorAll('img');
          allImages.forEach(img => img.remove());
          
          // Remove span elements with background-image styles (common for emoji rendering)
          const allSpans = parsed.querySelectorAll('span[style*="background-image"], span[style*="backgroundImage"]');
          allSpans.forEach(span => {
            // Extract text content if any, then remove
            const text = span.textContent || '';
            if (text.trim()) {
              const textNode = parsed.createTextNode(text);
              span.parentNode?.replaceChild(textNode, span);
            } else {
              span.remove();
            }
          });
          
          // Remove any elements with emoji-related classes
          const emojiElements = parsed.querySelectorAll('[class*="emoji"], [data-emoji]');
          emojiElements.forEach(el => {
            // Try to preserve text content
            const text = el.textContent || '';
            if (text.trim()) {
              const textNode = parsed.createTextNode(text);
              el.parentNode?.replaceChild(textNode, el);
            } else {
              el.remove();
            }
          });
          
          // Additional cleaning of the parsed DOM
          const allElements = parsed.querySelectorAll('*');
          allElements.forEach(node => {
            if (node.textContent && containsDragText(node.textContent)) {
              node.textContent = node.textContent.replace(/dr+a+g+/gi, '');
            }
            // Remove any image-related attributes
            if (node.hasAttribute('data-image') || node.hasAttribute('data-img')) {
              node.removeAttribute('data-image');
              node.removeAttribute('data-img');
            }
          });
          
          // Deserialize to Slate fragment
          let fragment = deserialize(parsed.body);
          
          // Ensure fragment is an array and filter out null values (e.g., invalid images)
          if (!fragment) {
            fragment = [];
          } else if (!Array.isArray(fragment)) {
            fragment = [fragment];
          }
          
          // Filter out null values and any image elements
          fragment = (fragment as any[]).filter((node): node is Node => {
            if (node === null) return false;
            // Remove any image elements that somehow got through
            if (Element.isElement(node) && node.type === 'image') {
              console.warn('Removing image element from fragment:', node);
              return false;
            }
            return true;
          });
          
          // Recursively remove any image elements from children
          const removeImages = (nodes: any[]): any[] => {
            return nodes.map(node => {
              if (Element.isElement(node) && node.type === 'image') {
                console.warn('Removing image element from children:', node);
                return null;
              }
              if (node.children && Array.isArray(node.children)) {
                return {
                  ...node,
                  children: removeImages(node.children).filter(n => n !== null)
                };
              }
              return node;
            }).filter(n => n !== null);
          };
          fragment = removeImages(fragment);
          
          // If fragment is empty after filtering, use plain text as fallback
          if (fragment.length === 0 && text) {
            const cleanedText = text.replace(/dr+a+g+/gi, '');
            Transforms.insertText(editor, cleanedText);
            return;
          }
          
          // Final cleaning of the fragment
          fragment = cleanFragment(fragment);
          
          // Check if fragment still contains drag text
          const fragmentStr = JSON.stringify(fragment);
          if (fragmentStr.includes('drag')) {
            console.warn('Warning: Fragment still contains drag text after cleaning');
            // Additional aggressive cleaning
            fragment = JSON.parse(fragmentStr.replace(/dr+a+g+/gi, ''));
          }
          
          // Final check: ensure no image elements exist
          const hasImages = JSON.stringify(fragment).includes('"type":"image"');
          if (hasImages) {
            console.error('ERROR: Fragment still contains image elements after cleaning!');
            // Use plain text as fallback
            if (text) {
              const cleanedText = text.replace(/dr+a+g+/gi, '');
              Transforms.insertText(editor, cleanedText);
              return;
            }
          }
          
          // Insert the cleaned fragment
          Transforms.insertFragment(editor, fragment);
        } catch (error) {
          console.error('Error processing HTML:', error);
          
          // Fallback to plain text
          if (text) {
            const cleanedText = text.replace(/dr+a+g+/gi, '');
            Transforms.insertText(editor, cleanedText);
          }
        }
      } 
      // If no HTML, use plain text
      else if (text) {
        const cleanedText = text.replace(/dr+a+g+/gi, '');
        Transforms.insertText(editor, cleanedText);
      }
      // Default fallback
      else {
        insertData(data);
      }
      
      // Always clear liveText
      if ((editor as any).setLiveText) {
        (editor as any).setLiveText('');
      }
    } catch (error) {
      console.error('Error in insertData:', error);
      // Ensure we don't break the editor - use plain text as fallback
      const text = data.getData('text/plain');
      if (text) {
        const cleanedText = text.replace(/dr+a+g+/gi, '');
        Transforms.insertText(editor, cleanedText);
      } else {
        insertData(data);
      }
    } finally {
      // Always clear liveText
      if ((editor as any).setLiveText) {
        (editor as any).setLiveText('');
      }
    }
  };

  return editor;
} 