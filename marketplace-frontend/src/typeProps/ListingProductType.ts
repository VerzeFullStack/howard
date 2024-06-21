import { ProductType } from "./ProductType";

export type ListingProductType = ProductType & {
  seller: string;
  description: string;
  price: string;
  quantity: number;
};
