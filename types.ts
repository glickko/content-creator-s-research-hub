export interface WebsiteResult {
  recipeName: string; // The Gemini schema requires a name, we'll map it to 'title'
  url: string;
  summary: string;
}

// Fix: Add missing ImageResult type definition.
export interface ImageResult {
  id: string;
  base64: string;
}

export type Tab = 'websites' | 'content';
