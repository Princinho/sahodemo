export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  categoryIds: string[];
  imageUrls: string[];
  materials: string[];
  colors: string[];
  description: string;
  descriptionFull: string;
  dimensions?: string;
  weight?: string;
  isTrending: boolean;
  isDisabled: boolean;
};
