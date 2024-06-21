import { faker } from "@faker-js/faker";
import { ListingProductType } from "../typeProps/ListingProductType";

const newProduct = (): ListingProductType => {
  return {
    id: faker.string.uuid(),
    productName: faker.commerce.productName(),
    category: faker.commerce.department(),
    price: faker.commerce.price(),
    quantity: faker.number.int(20),
    description: faker.commerce.productDescription(),
    seller: faker.person.fullName(),
  };
};

export function getProduct(len: number): ListingProductType[] {
  const arr: ListingProductType[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(newProduct());
  }
  return arr;
}
