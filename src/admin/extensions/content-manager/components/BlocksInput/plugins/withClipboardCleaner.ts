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
        
        // AGGRESSIVE APPROACH: Instead of trying to clean the data,
        // we'll create a completely new representation without any drag text
        
        // 1. Extract the actual content from the clipboard data
        let cleanedHtml = '';
        let cleanedText = '';
        
        if (html) {
          // Parse the HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          // Remove any elements with drag-related content
          const allElements = doc.querySelectorAll('*');
          allElements.forEach(el => {
            // Check for drag-related attributes
            if (el.getAttribute('draggable') === 'true' || 
                el.hasAttribute('data-drag') || 
                el.className.includes('drag') ||
                el.id?.includes('drag')) {
              el.remove();
              return;
            }
            
            // Check for drag text in content
            if (el.textContent && 
                (el.textContent.includes('drag') || 
                 el.textContent.match(/dr+a+g+/i))) {
              // Replace the text instead of removing the element
              el.textContent = el.textContent.replace(/dr+a+g+/gi, '');
            }
          });
          
          // Get the cleaned HTML
          cleanedHtml = doc.body.innerHTML;
          
          // Final regex cleanup
          cleanedHtml = cleanedHtml.replace(/drag/gi, '');
          cleanedHtml = cleanedHtml.replace(/dr+a+g+/gi, '');
        }
        
        if (text) {
          // Clean the text
          cleanedText = text.replace(/drag/gi, '');
          cleanedText = cleanedText.replace(/dr+a+g+/gi, '');
        }
        
        // 2. Set the cleaned data back to the clipboard
        // Clear the clipboard first
        clipboardData.clearData();
        
        // Set the cleaned data
        if (cleanedHtml) {
          clipboardData.setData('text/html', cleanedHtml);
        }
        
        if (cleanedText) {
          clipboardData.setData('text/plain', cleanedText);
        }
        
        // Log the cleaned data
        console.log('Cleaned HTML:', cleanedHtml);
        console.log('Cleaned Text:', cleanedText);
      } catch (error) {
        console.error('Error cleaning clipboard data:', error);
        // If cleaning fails, try to at least remove drag text
        try {
          const text = clipboardData.getData('text/plain');
          if (text) {
            const cleanedText = text.replace(/drag/gi, '');
            clipboardData.setData('text/plain', cleanedText);
          }
        } catch (e) {
          console.error('Fallback cleaning failed:', e);
        }
      }
    }
  };
  
  return newEditor as Editor & { cleanClipboardData: (clipboardData: DataTransfer) => void };
} 