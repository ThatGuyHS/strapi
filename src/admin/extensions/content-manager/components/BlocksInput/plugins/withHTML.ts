import { Descendant, Transforms, Node } from 'slate';
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

// Check if an element has drag-related attributes or content
function hasDragContent(el: HTMLElement): boolean {
  // Check for drag-related attributes
  if (el.getAttribute('draggable') === 'true' || 
      el.hasAttribute('data-drag') || 
      el.hasAttribute('data-draggable')) {
    return true;
  }
  
  // Check for drag-related classes
  if (el.className && 
      (el.className.includes('drag') || 
       el.className.includes('draggable'))) {
    return true;
  }
  
  // Check for drag-related IDs
  if (el.id && 
      (el.id.includes('drag') || 
       el.id.includes('draggable'))) {
    return true;
  }
  
  return false;
}

const deserialize = (
  el: ChildNode,
  parentNodeName?: string
): string | null | Descendant | (string | null | { text: string } | Descendant | Node)[] => {
  if (el.nodeType === 3) {
    // Text node - check if it contains only "drag" text
    const text = el.textContent || '';
    if (text.trim().toLowerCase() === 'drag' || 
        text.trim().toLowerCase() === 'dragdrag' || 
        text.trim().toLowerCase() === 'dragdragdrag' || 
        text.trim().toLowerCase() === 'dragdragdragdrag') {
      return { text: '' }; // Replace drag text with empty text
    }
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === 'BR') {
    if (parentNodeName) return el.textContent;
    return jsx('element', { type: 'paragraph' }, [{ text: '' }]);
  }
  
  // Check for drag-related elements and skip them
  if (hasDragContent(el as HTMLElement)) {
    return { text: '' }; // Replace drag elements with empty text
  }
  
  const isGoogleDoc = checkIfGoogleDoc(el as HTMLElement);
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
    const attrs = getSpan(el as HTMLElement);

    if (attrs && Object.keys(attrs).length > 0) {
      return children.map((child) => jsx('text', attrs, child));
    }
  }

  if (ELEMENT_TAGS[nodeName as TElementTag]) {
    const attrs = ELEMENT_TAGS[nodeName as TElementTag](el as HTMLElement);
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
    const html = data.getData('text/html');
    if (html) {
      // Clean up any drag-related content from the HTML
      const cleanHtml = html.replace(/drag{2,}/gi, '');
      
      const parsed = new DOMParser().parseFromString(cleanHtml, 'text/html');
      const fragment = deserialize(parsed.body);
      Transforms.insertFragment(editor, fragment as Node[]);
      
      // Clear any liveText that might have been set during drag operations
      // Access the editor's context to reset liveText if possible
      if ((editor as any).setLiveText) {
        (editor as any).setLiveText('');
      }
      
      return;
    }

    insertData(data);
  };

  return editor;
} 