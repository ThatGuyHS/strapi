import { Editor } from 'slate';

// This plugin specifically targets the "dragdrag" issue by cleaning clipboard data during copy operations
export function withClipboardCleaner(editor: Editor) {
  // Store the original editor object
  const originalEditor = { ...editor };

  // Override the editor object to add our custom behavior
  const newEditor = {
    ...originalEditor,
    
    // Add a method to clean clipboard data
    cleanClipboardData: (clipboardData: DataTransfer) => {
      try {
        // Get the HTML and text from the clipboard
        const html = clipboardData.getData('text/html');
        const text = clipboardData.getData('text/plain');
        
        // Log for debugging
        console.log('Cleaning clipboard data');
        console.log('Original HTML:', html);
        console.log('Original Text:', text);
        
        // Clean the data
        let cleanedHtml = html;
        let cleanedText = text;
        
        if (html) {
          // Remove dragdrag patterns
          cleanedHtml = html.replace(/dragdrag/gi, '');
          cleanedHtml = cleanedHtml.replace(/drag{2,}/gi, '');
          
          // Set the cleaned HTML back to the clipboard
          clipboardData.setData('text/html', cleanedHtml);
        }
        
        if (text) {
          // Remove dragdrag patterns
          cleanedText = text.replace(/dragdrag/gi, '');
          cleanedText = cleanedText.replace(/drag{2,}/gi, '');
          
          // Set the cleaned text back to the clipboard
          clipboardData.setData('text/plain', cleanedText);
        }
        
        // Log the cleaned data
        console.log('Cleaned HTML:', cleanedHtml);
        console.log('Cleaned Text:', cleanedText);
      } catch (error) {
        console.error('Error cleaning clipboard data:', error);
      }
    }
  };
  
  return newEditor as Editor & { cleanClipboardData: (clipboardData: DataTransfer) => void };
} 