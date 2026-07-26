export interface NavItem {
  label: string;
  href: string;
}

export interface Segment {
  text: string;
  className?: string;
}

export interface FeatureCardData {
  id: string;
  type: 'video' | 'feature';
  number?: string;
  title: string;
  icon?: string;
  videoUrl?: string;
  checklist?: string[];
}

export interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  cover_image: string;
  pdf_url: string;
  created_at?: string;
  pages?: number;
}

