import { Editor, Element, Transforms } from 'slate';

interface InsertLinkOptions {
  url: string;
  text?: string;
}

export const insertLink = (editor: Editor, options: InsertLinkOptions) => {
  const { url, text } = options;

  const link = {
    type: 'link',
    url,
    children: [{ text: text || url }],
  };

  Transforms.insertNodes(editor, link);
}; 