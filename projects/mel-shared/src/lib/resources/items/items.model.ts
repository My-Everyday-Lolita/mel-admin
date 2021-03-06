import { Brand } from '../brands/brands.model';
import { ExtendedCategory } from '../categories/categories.model';
import { Color } from '../colors/colors.model';
import { Feature } from '../features/features.model';

export interface ItemVariant {
  colors: Color[];
  photos: string[];
}

export interface Item {
  brand: Brand;
  collectionn?: string;
  category: ExtendedCategory;
  features: Feature[];
  variants: ItemVariant[];
  year?: number;
  japanese?: string;
  measurments?: string;
  estimatedPrice?: number;
  keywords?: string[];
  substyles?: string[];
  owner: string;
  created: Date;
  modified: Date;
  _id?: string;

  /**
   * Specific closet/wishlist
   */
  wantToSell?: boolean;
  _variantId?: string;
}

export interface Criterium {
  type: 'brand' | 'color' | 'feature' | 'category' | 'keyword' | 'own' | 'id';
  value: string;
  displayValue?: string;
  parents?: string[];
  _lvlClass?: string;
}

export interface ItemStats {
  brands: Stats[];
  categories: Stats[];
  colors: Stats[];
  count_items: { total: number }[];
}

export interface Stats {
  count: number;
  _id: {
    name: string;
    _id: string;
    [key: string]: any;
  };
}
