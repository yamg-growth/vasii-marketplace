export interface Product {
  id: string;
  code: string;
  category: string;
  subcategory: string;
  size: string;
  fabric: string;
  price: number;
  imageUrl: string;
  box: string;
  stock: number;
  collection: Collection;
  isPlus?: boolean;
}

export type Collection = 
  | 'glamour-fiesta' 
  | 'work-casual' 
  | 'curvy-edition' 
  | 'winter' 
  | 'el-bazar';

export interface CollectionConfig {
  id: Collection;
  name: string;
  description: string;
  whatsappLink: string;
  icon: string;
  color: string;
}

export interface FilterOptions {
  categories: string[];
  subcategories: string[];
  sizes: string[];
  priceRange: [number, number];
  collections: Collection[];
}
