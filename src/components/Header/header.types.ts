export interface MenuItem {
  id: string;
  title: string;
  url: string;
  items: MenuItem[];
}
export interface HeaderProps {
  logoUrl?: string;
}
export interface ShopifyCollection {
  title: string;
  handle: string;
}

export interface SearchResult {
  id: string;
  handle: string;
  title: string;
  price: string;
  image: string;
  category?: string;
}