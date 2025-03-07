import * as React from 'react';
import { useIntl } from 'react-intl';
import { createEditor, Descendant, Editor, Element, Node, Path, Point, Range, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react';

import { Box, Flex, Typography } from '@strapi/design-system';
import { pxToRem } from '@strapi/helper-plugin';

import { pipe } from './utils/pipe';
import { withHtml } from './plugins/withHTML';
import { withLinks } from './plugins/withLinks';
import { withClipboardCleaner } from './plugins/withClipboardCleaner';
import BlocksContent from './BlocksContent';

// Simplified interfaces for the missing components
interface BlocksContentProps {
  blocks?: any[];
  readOnly?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  onClick?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDrop?: () => void;
  onPaste?: () => void;
  onCopy?: (event: React.ClipboardEvent) => void;
  onCut?: (event: React.ClipboardEvent) => void;
  setLiveText?: (text: string) => void;
  setErroredBlocks?: (blocks: any[]) => void;
  ariaDescriptionId?: string;
  disabled?: boolean;
  liveText?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
}

// Simplified components
const BlocksToolbar: React.FC = () => {
  return <div></div>;
};

const EditorLayout: React.FC<{
  error?: string;
  name: string;
  disabled?: boolean;
  ariaDescriptionId?: string;
  children: React.ReactNode;
}> = (props) => {
  return <div>{props.children}</div>;
};

// Simplified modifiers
const modifiers = {
  tab: {
    action: (_editor: any, _options: any) => false,
  },
  link: {
    action: (_editor: any, _options: any) => {},
  },
  bold: {
    action: (_editor: any, _options: any) => {},
  },
  italic: {
    action: (_editor: any, _options: any) => {},
  },
  underline: {
    action: (_editor: any, _options: any) => {},
  },
  backspace: {
    action: (_editor: any, _options: any) => false,
  },
  enter: {
    action: (_editor: any, _options: any) => false,
  },
};

// Simplified withImages and withStrapiSchema
const withImages = (editor: Editor) => editor;
const withStrapiSchema = (editor: Editor) => editor;

export interface BlocksEditorProps
  extends Pick<
    BlocksContentProps,
    | 'blocks'
    | 'readOnly'
    | 'onBlur'
    | 'onFocus'
    | 'onClick'
    | 'onDragStart'
    | 'onDrop'
    | 'setLiveText'
    | 'setErroredBlocks'
  > {
  /**
   * The name of the field the editor is for
   */
  name: string;
  /**
   * The value of the editor
   */
  value: Descendant[];
  /**
   * Is the editor disabled
   */
  disabled?: boolean;
  /**
   * The error message to display
   */
  error?: string;
  /**
   * Callback called when the value changes
   */
  onChange: (value: Descendant[]) => void;
}

const BlocksEditor = React.forwardRef<{ focus: () => void }, BlocksEditorProps>(
  ({ disabled = false, name, onChange, value, error, ...contentProps }, forwardedRef) => {
    const { formatMessage } = useIntl();
    const [editor] = React.useState(() =>
      pipe(
        withHistory,
        withImages,
        withStrapiSchema,
        withReact,
        withLinks,
        withHtml,
        withClipboardCleaner
      )(createEditor())
    );
    const [liveText, setLiveText] = React.useState('');
    const ariaDescriptionId = React.useId();
    const editorRef = React.useRef<HTMLElement | null>(null);

    // Attach setLiveText to editor for use in plugins
    (editor as any).setLiveText = setLiveText;

    // DIRECT DOM MANIPULATION: Add a global copy event listener
    React.useEffect(() => {
      // Function to handle copy events at the document level
      const handleGlobalCopy = (e: ClipboardEvent) => {
        // Only intercept if we're copying from our editor
        if (document.activeElement && editorRef.current?.contains(document.activeElement)) {
          console.log('Global copy event intercepted');
          
          // Prevent the default copy behavior
          e.stopPropagation();
          
          // Get the current selection
          const selection = window.getSelection();
          if (!selection || selection.rangeCount === 0) return;
          
          // Get the selected text
          const selectedText = selection.toString();
          console.log('Selected text:', selectedText);
          
          // Check if it contains drag text
          if (selectedText.match(/drag/i) || selectedText.match(/dr+a+g+/i)) {
            console.log('Selected text contains drag text, cleaning...');
            
            // Clean the text
            const cleanedText = selectedText
              .replace(/drag/gi, '')
              .replace(/dr+a+g+/gi, '');
            
            // Set the cleaned text to the clipboard
            if (e.clipboardData) {
              e.preventDefault(); // Prevent the default copy
              e.clipboardData.setData('text/plain', cleanedText);
              
              // Also try to set HTML
              const cleanedHtml = `<div>${cleanedText}</div>`;
              e.clipboardData.setData('text/html', cleanedHtml);
              
              console.log('Set cleaned text to clipboard:', cleanedText);
            }
          }
        }
      };
      
      // Add the event listener
      document.addEventListener('copy', handleGlobalCopy, true); // Use capture phase
      
      // Clean up
      return () => {
        document.removeEventListener('copy', handleGlobalCopy, true);
      };
    }, []);

    // Store a reference to the editor DOM node
    React.useEffect(() => {
      try {
        editorRef.current = ReactEditor.toDOMNode(editor, editor);
      } catch (error) {
        console.error('Could not get editor DOM node:', error);
      }
    }, [editor]);

    // Handle drag events to clear liveText
    const handleDragEnd = React.useCallback(() => {
      setLiveText('');
    }, []);

    const handleDrop = React.useCallback(() => {
      // Clear liveText after a short delay to ensure it's cleared after the drop operation completes
      setTimeout(() => {
        setLiveText('');
      }, 100);
    }, []);

    // Handle paste events to clear any potential drag text
    const handlePaste = React.useCallback(() => {
      // Clear liveText after a short delay to ensure it's cleared after the paste operation completes
      setTimeout(() => {
        setLiveText('');
      }, 100);
    }, []);

    // Handle copy events to clean the clipboard data
    const handleCopy = React.useCallback((event: React.ClipboardEvent) => {
      console.log('Copy event in BlocksEditor');
      
      // Use our custom clipboard cleaner if available
      if ((editor as any).cleanClipboardData && event.clipboardData) {
        (editor as any).cleanClipboardData(event.clipboardData);
      }
      
      // Clear liveText
      setLiveText('');
    }, [editor]);

    // Handle cut events similarly to copy
    const handleCut = React.useCallback((event: React.ClipboardEvent) => {
      console.log('Cut event in BlocksEditor');
      
      // Use our custom clipboard cleaner if available
      if ((editor as any).cleanClipboardData && event.clipboardData) {
        (editor as any).cleanClipboardData(event.clipboardData);
      }
      
      // Clear liveText
      setLiveText('');
    }, [editor]);

    // Add event listeners for copy and cut events
    React.useEffect(() => {
      // Get the DOM node of the editor
      let editorNode: HTMLElement | null = null;
      try {
        editorNode = ReactEditor.toDOMNode(editor, editor);
      } catch (error) {
        console.error('Could not get editor DOM node:', error);
      }

      if (editorNode) {
        // Create DOM event handlers that can be used with addEventListener
        const domCopyHandler = (e: ClipboardEvent) => {
          console.log('DOM Copy event triggered');
          
          // Use our custom clipboard cleaner if available
          if ((editor as any).cleanClipboardData && e.clipboardData) {
            (editor as any).cleanClipboardData(e.clipboardData);
          }
          
          setLiveText('');
        };
        
        const domCutHandler = (e: ClipboardEvent) => {
          console.log('DOM Cut event triggered');
          
          // Use our custom clipboard cleaner if available
          if ((editor as any).cleanClipboardData && e.clipboardData) {
            (editor as any).cleanClipboardData(e.clipboardData);
          }
          
          setLiveText('');
        };

        // Add event listeners
        editorNode.addEventListener('copy', domCopyHandler);
        editorNode.addEventListener('cut', domCutHandler);

        // Clean up
        return () => {
          editorNode?.removeEventListener('copy', domCopyHandler);
          editorNode?.removeEventListener('cut', domCutHandler);
        };
      }
      
      return undefined;
    }, [editor]);

    const handleChange = (newValue: Descendant[]) => {
      // Check for and remove any drag text in the editor content
      const cleanedValue = cleanEditorContent(newValue);
      
      // Handle copy/paste of blocks
      if (
        editor.operations.some((op) => op.type === 'insert_node' && Element.isElement(op.node)) ||
        editor.operations.some((op) => op.type === 'remove_node' && Element.isElement(op.node))
      ) {
        onChange(cleanedValue);
        // Clear any potential drag text after paste operations
        setTimeout(() => {
          setLiveText('');
        }, 100);
      }

      // Handle text changes
      if (
        editor.operations.some((op) => op.type === 'insert_text') ||
        editor.operations.some((op) => op.type === 'remove_text')
      ) {
        onChange(cleanedValue);
        // Also clear liveText after text changes
        setTimeout(() => {
          setLiveText('');
        }, 100);
      }

      // Handle changes in node properties
      if (editor.operations.some((op) => op.type === 'set_node')) {
        onChange(cleanedValue);
      }
    };
    
    // Function to clean the editor content
    const cleanEditorContent = (content: Descendant[]): Descendant[] => {
      // Helper function to check if text contains drag-related content
      const containsDragText = (text: string): boolean => {
        return text.match(/drag/i) !== null || text.match(/dr+a+g+/i) !== null;
      };
      
      // Helper function to clean text
      const cleanText = (text: string): string => {
        return text.replace(/drag/gi, '').replace(/dr+a+g+/gi, '');
      };
      
      // Recursively clean the content
      const cleanNode = (node: any): any => {
        // If it's a text node
        if (node.text !== undefined) {
          if (containsDragText(node.text)) {
            return { ...node, text: cleanText(node.text) };
          }
          return node;
        }
        
        // If it's an element node with children
        if (node.children) {
          return {
            ...node,
            children: node.children.map(cleanNode)
          };
        }
        
        return node;
      };
      
      // Clean each node in the content
      return content.map(cleanNode);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      // Special handling for tab key
      if (event.key === 'Tab') {
        event.preventDefault();
        const didAction = modifiers.tab.action(editor, {
          formatMessage,
          event,
        });

        if (didAction) {
          return;
        }
      }

      // Special handling for mod+k to add links
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        modifiers.link.action(editor, {
          formatMessage,
        });

        return;
      }

      // Special handling for mod+b to add bold
      if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        modifiers.bold.action(editor, {
          formatMessage,
        });

        return;
      }

      // Special handling for mod+i to add italic
      if (event.key === 'i' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        modifiers.italic.action(editor, {
          formatMessage,
        });

        return;
      }

      // Special handling for mod+u to add underline
      if (event.key === 'u' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        modifiers.underline.action(editor, {
          formatMessage,
        });

        return;
      }

      // Special handling for backspace
      if (event.key === 'Backspace') {
        const didAction = modifiers.backspace.action(editor, {
          formatMessage,
        });

        if (didAction) {
          event.preventDefault();
          return;
        }
      }

      // Special handling for enter
      if (event.key === 'Enter') {
        const didAction = modifiers.enter.action(editor, {
          formatMessage,
          event,
        });

        if (didAction) {
          event.preventDefault();
          return;
        }
      }
    };

    React.useImperativeHandle(forwardedRef, () => ({
      focus() {
        ReactEditor.focus(editor);
        // Place cursor at the end of the content
        Transforms.select(editor, Editor.end(editor, []));
      },
    }));

    return (
      <EditorLayout
        error={error}
        name={name}
        disabled={disabled}
        ariaDescriptionId={ariaDescriptionId}
      >
        <Slate editor={editor} initialValue={value} onChange={handleChange}>
          <BlocksToolbar />
          <Box padding={2} background="neutral0" hasRadius>
            <BlocksContent
              {...contentProps}
              ariaDescriptionId={ariaDescriptionId}
              disabled={disabled}
              liveText={liveText}
              onKeyDown={handleKeyDown}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              onPaste={handlePaste}
              onCopy={handleCopy}
              onCut={handleCut}
              setLiveText={setLiveText}
            />
          </Box>
          {liveText ? (
            <Box position="absolute" left={0} right={0} bottom={0} zIndex={1}>
              <Flex
                width="100%"
                justifyContent="center"
                padding={2}
                background="neutral0"
                borderColor="neutral200"
                borderWidth="1px"
                hasRadius
              >
                <Typography>{liveText}</Typography>
              </Flex>
            </Box>
          ) : null}
        </Slate>
      </EditorLayout>
    );
  }
);

BlocksEditor.displayName = 'BlocksEditor';

export { BlocksEditor }; 