import { Descendant, Transforms, Node, Text, Element } from 'slate';
import { type Editor } from 'slate';
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
  IMG: (el: HTMLElement) => ({ type: 'image', url: el.getAttribute('src') }),
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
    .flat();

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
  const { insertData, isVoid } = editor as CustomEditor;

  (editor as CustomEditor).isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element);
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
        // Aggressively clean the HTML
        const cleanHtml = aggressiveCleanHtml(html);
        
        try {
          // Parse the cleaned HTML
          const parsed = new DOMParser().parseFromString(cleanHtml, 'text/html');
          
          // Additional cleaning of the parsed DOM
          const allElements = parsed.querySelectorAll('*');
          allElements.forEach(node => {
            if (node.textContent && containsDragText(node.textContent)) {
              node.textContent = node.textContent.replace(/dr+a+g+/gi, '');
            }
          });
          
          // Deserialize to Slate fragment
          let fragment = deserialize(parsed.body) as Node[];
          
          // Final cleaning of the fragment
          fragment = cleanFragment(fragment);
          
          // Check if fragment still contains drag text
          const fragmentStr = JSON.stringify(fragment);
          if (fragmentStr.includes('drag')) {
            console.warn('Warning: Fragment still contains drag text after cleaning');
            // Additional aggressive cleaning
            fragment = JSON.parse(fragmentStr.replace(/dr+a+g+/gi, ''));
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
      // Ensure we don't break the editor
      insertData(data);
    } finally {
      // Always clear liveText
      if ((editor as any).setLiveText) {
        (editor as any).setLiveText('');
      }
    }
  };

  return editor;
} 