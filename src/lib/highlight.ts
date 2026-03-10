import hljs from 'highlight.js';
import * as cheerio from 'cheerio';

export async function highlightCodeBlocks(htmlString: string) {
  const $ = cheerio.load(htmlString);

  $('pre code').each((_, el) => {
    const text = $(el).text();
    if (!text) return;

    try {
      const result = hljs.highlightAuto(text);
      $(el).html(result.value);
    } catch (error) {
      console.error('Highlighting failed for a code block:', error);
    }
  });

  return $('body').html() ?? $.root().html() ?? htmlString;
}
