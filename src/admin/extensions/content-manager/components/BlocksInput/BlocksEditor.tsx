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

// Simplified interfaces for the missing components
interface BlocksContentProps {
  blocks?: any[];
  readOnly?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  onClick?: () => void;
  onDragStart?: () => void;
  onDrop?: () => void;
  setLiveText?: (text: string) => void;
  setErroredBlocks?: (blocks: any[]) => void;
  ariaDescriptionId?: string;
  disabled?: boolean;
  liveText?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
}

// Simplified components
const BlocksContent: React.FC<BlocksContentProps> = (props) => {
  return <div>{props.children}</div>;
};

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
        withHtml
      )(createEditor())
    );
    const [liveText, setLiveText] = React.useState('');
    const ariaDescriptionId = React.useId();

    const handleChange = (newValue: Descendant[]) => {
      // Handle copy/paste of blocks
      if (
        editor.operations.some((op) => op.type === 'insert_node' && Element.isElement(op.node)) ||
        editor.operations.some((op) => op.type === 'remove_node' && Element.isElement(op.node))
      ) {
        onChange(newValue);
      }

      // Handle text changes
      if (
        editor.operations.some((op) => op.type === 'insert_text') ||
        editor.operations.some((op) => op.type === 'remove_text')
      ) {
        onChange(newValue);
      }

      // Handle changes in node properties
      if (editor.operations.some((op) => op.type === 'set_node')) {
        onChange(newValue);
      }
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