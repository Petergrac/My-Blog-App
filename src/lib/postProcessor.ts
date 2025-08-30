// lib/postProcessor.ts

import * as cheerio from 'cheerio';
import slug from 'slug';

export interface TableOfContentsItem {
  level: number;
  text: string;
  id: string;
}

interface ProcessedContent {
  html: string;
  toc: TableOfContentsItem[];
}

export function processContent(htmlString: string): ProcessedContent {
  const $ = cheerio.load(htmlString);
  const toc: TableOfContentsItem[] = [];

  // 1. Process Images
  $('img').each((i, el) => {
    const src = $(el).attr('src');
    if (src && src.includes('ik.imagekit.io')) {
       const optimizedUrl = `${src}?tr=w-${400},q-${80}`;
      $(el).attr('src', optimizedUrl);
          $(el).attr('style', 'margin-left: auto; margin-right: auto; display: block;'); 
      $(el).attr('loading', 'lazy');
    }
  });

  // 2. Generate Table of Contents
  $('h2, h3, h4').each((i, el) => {
    const tagName = el.tagName;
    const headingText = $(el).text();
    const headingId = $(el).attr('id') || slug(headingText);

    // Ensure the heading has an ID
    $(el).attr('id', headingId);

    toc.push({
      level: parseInt(tagName.replace('h', ''), 10),
      text: headingText,
      id: headingId,
    });
  });

  // 3. Return both the modified HTML and the TOC
  return {
    html: $.html(),
    toc,
  };
}