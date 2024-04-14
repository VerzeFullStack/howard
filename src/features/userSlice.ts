import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'
import { AccountInfo } from '@azure/msal-browser'

// Define a type for the slice state
export interface userState {
  activeAccount: AccountInfo | null
}

// Define the initial state using that type
const initialState: userState = {
  activeAccount: null
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setActiveAccount(state, action: PayloadAction<AccountInfo | null>) {
        state.activeAccount = action.payload;
    }
    // Use the PayloadAction type to declare the contents of `action.payload`
  }
})

export const { setActiveAccount } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.activeAccount;

export default userSlice.reducer