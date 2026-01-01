export type ProductCategory = "lipstick" | "blush" | "eyeshadow";

export type RecommendedProduct = {
  id: string;
  category: ProductCategory;
  name: string;
  image: string; // public URL, e.g. "/images/pd1.jpg"
  price: number; // USD
  description: string;
  suitableFor: string;
  shadeOrShades: string;
};

export type CartItem = {
  name: string;
  image: string;
  price: number;
  description: string;
};
