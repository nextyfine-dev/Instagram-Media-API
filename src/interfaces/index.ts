export interface Err extends Error {
  code?: string | number;
  message: string;
  statusCode: number;
  status: string;
  isOperational?: boolean;
  path?: string;
  value?: unknown;
  errors?: any;
  body?: any;
  query?: any;
  params?: any;
}

export interface Author {
  "@type"?: string;
  image: string;
  name?: string;
  alternateName?: string;
  url?: string;
}

export interface Image {
  "@type"?: string;
  caption?: string;
  representativeOfPage?: string | null;
  height?: string;
  width?: string;
  url: string;
}

export interface Video {
  "@type"?: string;
  uploadDate?: string;
  description?: string;
  name?: string;
  caption?: string;
  height?: string;
  width?: string;
  contentUrl: string;
  thumbnailUrl: string;
  genre?: string[] | [];
  keywords?: string[] | [];
  interactionStatistic?: string | null;
}

export interface Result {
  author: Author;
  headline?: string;
  hasVideo: boolean;
  hasImage: boolean;
  videos: Video[] | [];
  images: Image[] | [];
}
