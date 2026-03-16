// Auto-generated types for Supabase tables

export interface PortfolioItem {
  id: number;
  created_at: string;
  title: string;
  description: string;
  categories: string[]; // Array of categories this project belongs to
  type: 'MUSIC VIDEO' | 'COMMERCIAL' | 'NARRATIVE';
  featured: boolean;
  slug: string;
  image_url?: string;
  video_url?: string;
  roles?: string;
  about?: string;
  bts_images?: string[]; // Array of BTS image URLs
  bts_videos?: string[]; // Array of BTS video URLs
  category_orders: {
    'Directing': number | null;
    'Editorial': number | null;
    'VFX': number | null;
    'Production': number | null;
  };
}

export interface ContactPageContent {
  id: number;
  profile_image_url?: string;
  about_text?: string;
  skills?: string[];
  contact_email?: string;
  social_links?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      portfolio_items: {
        Row: PortfolioItem;
        Insert: Omit<PortfolioItem, 'id' | 'created_at'>;
        Update: Partial<Omit<PortfolioItem, 'id' | 'created_at'>>;
      };
      contact_page: {
        Row: ContactPageContent;
        Insert: Omit<ContactPageContent, 'id' | 'updated_at'>;
        Update: Partial<Omit<ContactPageContent, 'id' | 'updated_at'>>;
      };
    };
  };
}
