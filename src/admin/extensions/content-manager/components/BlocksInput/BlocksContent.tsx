import * as React from 'react';
import { useSlate } from 'slate-react';

// Helper function to clean drag-related content from text
function cleanDragText(text: string): string {
  // Remove any instances of "drag" repeated multiple times
  let cleanedText = text.replace(/drag{2,}/gi, '');
  
  // Remove any standalone "drag" words
  cleanedText = cleanedText.replace(/\bdrag\b/gi, '');
  
  return cleanedText;
}

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

export const BlocksContent: React.FC<BlocksContentProps> = ({
  onBlur,
  onFocus,
  onClick,
  onDragStart,
  onDragEnd,
  onDrop,
  onPaste,
  onCopy,
  onCut,
  onKeyDown,
  setLiveText,
  disabled,
  ariaDescriptionId,
  children,
}) => {
  const editor = useSlate();

  // Handle drag events to clear liveText
  const handleDragEnd = React.useCallback((e: React.DragEvent) => {
    if (onDragEnd) {
      onDragEnd();
    }
    // Also clear liveText directly
    if (setLiveText) {
      setLiveText('');
    }
  }, [onDragEnd, setLiveText]);

  const handleDrop = React.useCallback((e: React.DragEvent) => {
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

  const handlePaste = React.useCallback((e: React.ClipboardEvent) => {
    // Log clipboard data for debugging
    console.log('Paste event in BlocksContent');
    
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

  // Handle copy event to clean clipboard data
  const handleCopy = React.useCallback((e: React.ClipboardEvent) => {
    // Log for debugging
    console.log('Copy event in BlocksContent');
    
    if (onCopy) {
      onCopy(e);
    }
    
    // Clear liveText
    if (setLiveText) {
      setLiveText('');
    }
    
    // We can't modify the clipboard data directly in React's synthetic events
    // But we can clear liveText to prevent it from being included
  }, [onCopy, setLiveText]);

  // Handle cut event similarly to copy
  const handleCut = React.useCallback((e: React.ClipboardEvent) => {
    // Log for debugging
    console.log('Cut event in BlocksContent');
    
    if (onCut) {
      onCut(e);
    }
    
    // Clear liveText
    if (setLiveText) {
      setLiveText('');
    }
  }, [onCut, setLiveText]);

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
      onCopy={handleCopy}
      onCut={handleCut}
      onKeyDown={onKeyDown}
      aria-describedby={ariaDescriptionId}
      style={{ minHeight: '100px' }}
    >
      {children}
    </div>
  );
};

export default BlocksContent; 