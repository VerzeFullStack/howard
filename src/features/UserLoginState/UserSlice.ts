import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { AccountInfo, IdTokenClaims } from "@azure/msal-browser";

// Define a type for the slice state
export interface userState {
  activeAccount: AccountInfo | null;
  accessToken: string | null;
  idTokenClaims: IdTokenClaims | undefined;
}

// Define the initial state using that type
const initialState: userState = {
  activeAccount: null,
  accessToken: null,
  idTokenClaims: undefined,
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setActiveAccount(state, action: PayloadAction<AccountInfo | null>) {
      state.activeAccount = action.payload;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    setClaims(state, action: PayloadAction<IdTokenClaims | undefined>) {
      state.idTokenClaims = action.payload;
    },
  },
});

export const { setActiveAccount, setAccessToken, setClaims } =
  userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.activeAccount;
export const selectClaims = (state: RootState) => state.user.idTokenClaims;
export const selectAccessToken = (state: RootState) => state.user.accessToken;

export default userSlice.reducer;
