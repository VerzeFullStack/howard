import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ProductType } from "../../typeProps/ProductType";
import {
  FetchProduct,
  AddProductToUserListingTable,
} from "../../api/GetProductAPI";

export enum LoadingStatus {
  Idle = 0,
  Loading = 1,
  Succeeed = 2,
  Failed = 3,
}

export interface ListingState {
  products: Array<ProductType>;
  loading: LoadingStatus;
  error: string | null | undefined;
}

const initialState: ListingState = {
  products: [],
  loading: LoadingStatus.Idle,
  error: null,
};

export const fetchProduct = createAsyncThunk<ProductType[], string | undefined>(
  "UserListingTable/FetchProduct",
  async (_userTokenId: string | undefined) => {
    const response = await FetchProduct(_userTokenId);
    return response;
  }
);

export const addProductToUserListingTable = createAsyncThunk(
  "UserListingTable/AddProductToUserListingTable",
  async (product: ProductType) => {
    const response = await AddProductToUserListingTable(product.productName);
    if (response) {
      return product;
    }
    return null;
  }
);

export const ListingProductSlice = createSlice({
  name: "listingProduct",
  initialState,
  reducers: {
    listProduct(state, action: PayloadAction<number>) {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    refreshData(state) {
      state.loading = LoadingStatus.Idle;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = LoadingStatus.Loading;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = LoadingStatus.Failed;
        state.error = action.error.message;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = LoadingStatus.Succeeed;
        state.products = action.payload;
      })
      .addCase(addProductToUserListingTable.fulfilled, (state, action) => {
        if (action.payload != null) {
          state.products.push(action.payload);
        }
      });
  },
});

export const { listProduct, refreshData } = ListingProductSlice.actions;

export const selectListingProduct = (state: RootState) =>
  state.listingProduct.products;

export default ListingProductSlice.reducer;
