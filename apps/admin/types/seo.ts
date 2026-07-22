export interface SeoFaqItem {
  q: string;
  a: string;
}

export interface SeoPageData {
  title: string;
  description: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_title: string;
  twitter_description: string;
  keywords: string[];
  faq: SeoFaqItem[];
}

export interface SeoGlobalData {
  site_name: string;
  site_description: string;
  default_og_image: string;
  twitter_handle: string;
  facebook_app_id: string;
}

export interface SeoResponse {
  global: SeoGlobalData;
  pages: Record<string, SeoPageData | null>;
}
