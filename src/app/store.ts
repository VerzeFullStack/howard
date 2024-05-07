import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/UserLoginState/UserSlice";
import listingProductReducer from "../features/ListingProduct/ListingProductSlice";
// ...

export const store = configureStore({
  reducer: {
    user: userReducer,
    listingProduct: listingProductReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
