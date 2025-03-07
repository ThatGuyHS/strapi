import * as React from 'react';
import { useSlate } from 'slate-react';

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
  setLiveText?: (text: string) => void;
  setErroredBlocks?: (blocks: any[]) => void;
  ariaDescriptionId?: string;
  disabled?: boolean;
  liveText?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
}

export const BlocksContent: React.FC<BlocksContentProps> = ({
  onBlur,
  onFocus,
  onClick,
  onDragStart,
  onDragEnd,
  onDrop,
  onPaste,
  onKeyDown,
  setLiveText,
  disabled,
  ariaDescriptionId,
  children,
}) => {
  const editor = useSlate();

  // Handle drag events to clear liveText
  const handleDragEnd = React.useCallback(() => {
    if (onDragEnd) {
      onDragEnd();
    }
    // Also clear liveText directly
    if (setLiveText) {
      setLiveText('');
    }
  }, [onDragEnd, setLiveText]);

  const handleDrop = React.useCallback(() => {
    if (onDrop) {
      onDrop();
    }
    // Also clear liveText directly
    if (setLiveText) {
      setTimeout(() => {
        setLiveText('');
      }, 100);
    }
  }, [onDrop, setLiveText]);

  const handlePaste = React.useCallback(() => {
    if (onPaste) {
      onPaste();
    }
    // Also clear liveText directly
    if (setLiveText) {
      setTimeout(() => {
        setLiveText('');
      }, 100);
    }
  }, [onPaste, setLiveText]);

  return (
    <div
      contentEditable={!disabled}
      onBlur={onBlur}
      onFocus={onFocus}
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
      onPaste={handlePaste}
      onKeyDown={onKeyDown}
      aria-describedby={ariaDescriptionId}
      style={{ minHeight: '100px' }}
    >
      {children}
    </div>
  );
};

export default BlocksContent; 