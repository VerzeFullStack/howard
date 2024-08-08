import { ProductType } from "./ProductType";
import { User } from "./User";

export type ListingProductType = ProductType & {
  seller: User;
  description: string;
  price: number;
  quantity: number;
};
