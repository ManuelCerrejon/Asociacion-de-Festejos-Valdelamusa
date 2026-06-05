export type EventItem = {
  date: string;
  description: string;
  id?: string;
  image?: string;
  location: string;
  title: string;
};

export type PostItem = {
  category: string;
  date: string;
  excerpt: string;
  id?: string;
  image?: string;
  title: string;
};

export type GalleryItem = {
  description: string;
  id?: string;
  image: string;
  title: string;
};

export type EventRow = {
  created_at: string;
  description: string;
  event_date: string;
  id: string;
  image_url: string | null;
  is_published: boolean;
  location: string;
  title: string;
  updated_at: string;
};

export type PostRow = {
  category: string;
  content: string;
  created_at: string;
  excerpt: string;
  id: string;
  image_url: string | null;
  is_published: boolean;
  published_at: string;
  title: string;
  updated_at: string;
};

export type GalleryRow = {
  created_at: string;
  description: string;
  id: string;
  image_url: string;
  is_published: boolean;
  title: string;
  updated_at: string;
};
