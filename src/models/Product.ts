export type Product = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrls: string[];
    isTrending: boolean;
    materials: string[];
    colors: string[];
    category: string;
    description: string;
    descriptionFull: string;
    dimensions?: string;
};
