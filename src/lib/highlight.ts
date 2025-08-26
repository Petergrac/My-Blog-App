// lib/highlightServer.js
import hljs from 'highlight.js';
import { JSDOM } from 'jsdom'

export async function highlightCodeBlocks(htmlString: string) {
  // Create a virtual DOM environment
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  // Find all pre > code blocks
  const codeBlocks = document.querySelectorAll('pre code');
  
  // Iterate through each block and apply highlighting
  codeBlocks.forEach(block => {
    // Check if the block has text content to highlight
    if (block.textContent) {
      try {
        const result = hljs.highlightAuto(block.textContent);
        block.innerHTML = result.value;
      } catch (e) {
        console.error("Highlighting failed for a code block:", e);
      }
    }
  });

  // Return the modified HTML string
  return dom.serialize();
}