import axios from "axios";

import {
  EnhancedStore,
  StoreEnhancer,
  ThunkDispatch,
  Tuple,
  UnknownAction,
} from "@reduxjs/toolkit";

import { userState } from "../features/UserLoginState/UserSlice";
import { ListingState } from "../features/ListingProduct/ListingProductSlice";

let store: EnhancedStore<
  {
    user: userState;
    listingProduct: ListingState;
  },
  UnknownAction,
  Tuple<
    [
      StoreEnhancer<{
        dispatch: ThunkDispatch<
          {
            user: userState;
            listingProduct: ListingState;
          },
          undefined,
          UnknownAction
        >;
      }>,
      StoreEnhancer
    ]
  >
>;

export const injectStore = (
  _store: EnhancedStore<
    { user: userState; listingProduct: ListingState },
    UnknownAction,
    Tuple<
      [
        StoreEnhancer<{
          dispatch: ThunkDispatch<
            { user: userState; listingProduct: ListingState },
            undefined,
            UnknownAction
          >;
        }>,
        StoreEnhancer
      ]
    >
  >
) => {
  store = _store;
};

export interface ApiResponse {
  data: never;
  status: number;
}

const serverAddress = "http://localhost:5075";

const client = axios.create({
  baseURL: serverAddress,
});

client.interceptors.request.use((config) => {
  config.headers.authorization = "Bearer " + store.getState().user.accessToken;
  return config;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function get(path: string): Promise<ApiResponse> {
  return client.get(path);
}

const ApiClient = {
  get: get,
};

export default ApiClient;
