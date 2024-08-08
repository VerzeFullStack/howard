import { faker } from "@faker-js/faker";
import { ProductType } from "../typeProps/ProductType";

const newProduct = (): ProductType => {
  return {
    id: faker.number.int(),
    productName: faker.commerce.productName(),
    category: faker.commerce.department(),
  };
};

export function FetchProduct(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userTokenId: string | undefined
): Promise<Array<ProductType>> {
  return new Promise<ProductType[]>((resolve) => {
    const arr: ProductType[] = [];
    for (let i = 0; i < 100; i++) {
      arr.push(newProduct());
    }

    setTimeout(() => {
      resolve(arr);
    }, 500);
  });
}

export function AddProductToUserListingTable(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _productId: string | undefined
): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}
