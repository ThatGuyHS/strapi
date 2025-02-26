import { type BaseEditor, Path, Transforms, Range, Point, Editor, Element } from 'slate';

import { insertLink } from '../utils/links';

interface LinkEditor extends BaseEditor {
  lastInsertedLinkPath: Path | null;
  shouldSaveLinkPath: boolean;
  isInline: (element: any) => boolean;
  apply: (operation: any) => void;
  insertText: (text: string) => void;
}

interface CustomElement {
  type: string;
  [key: string]: any;
}

const withLinks = (editor: Editor) => {
  const { isInline, apply, insertText } = editor as any;

  // Links are inline elements, so we need to override the isInline method for slate
  (editor as any).isInline = (element: any) => {
    return element.type === 'link' ? true : isInline(element);
  };

  // Save the path of the last inserted link
  (editor as any).apply = (operation: any) => {
    apply(operation);

    if (operation.type === 'insert_node' && operation.node.type === 'link') {
      if ((editor as LinkEditor).shouldSaveLinkPath !== false) {
        (editor as LinkEditor).lastInsertedLinkPath = operation.path;
      }
    } else if (operation.type === 'split_node' && operation.properties.type === 'link') {
      if ((editor as LinkEditor).shouldSaveLinkPath !== false) {
        (editor as LinkEditor).lastInsertedLinkPath = operation.path;
      }
    } else if (
      operation.type === 'remove_node' &&
      (editor as LinkEditor).lastInsertedLinkPath &&
      Path.equals(operation.path, (editor as LinkEditor).lastInsertedLinkPath as Path)
    ) {
      (editor as LinkEditor).lastInsertedLinkPath = null;
    } else if (
      operation.type === 'merge_node' &&
      (editor as LinkEditor).lastInsertedLinkPath &&
      Path.equals(operation.path, (editor as LinkEditor).lastInsertedLinkPath as Path)
    ) {
      (editor as LinkEditor).lastInsertedLinkPath = null;
    }
  };

  // Prevent inserting text in void nodes
  (editor as any).insertText = (text: string) => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const [currentNode] = Editor.node(editor, editor.selection) as [any, Path];

      if (currentNode.type === 'image') {
        return;
      }
    }

    insertText(text);
  };

  return editor;
};

export { withLinks }; 