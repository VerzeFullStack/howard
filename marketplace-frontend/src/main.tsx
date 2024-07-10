import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/main.css";

import {
  PublicClientApplication,
  EventType,
  EventMessage,
  AuthenticationResult,
} from "@azure/msal-browser";
import { msalConfig } from "./authConfig.ts";

import { store } from "./app/store.ts";
import { Provider } from "react-redux";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductTable from "./tableComponents/ProductTable.tsx";
import UserToken from "./features/UserLoginState/UserToken.tsx";
import NavigatorBar from "./tableComponents/NavigatorBar.tsx";
import NotFoundPage from "./tableComponents/NotFoundPage.tsx";
import UserListingTable from "./features/ListingProduct/UserListingTable.tsx";
import { injectStore } from "./api/ApiClient.ts";
import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { reactPlugin } from "./ApplicationInsightsService.tsx";

/**
 * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
export const msalInstance = new PublicClientApplication(msalConfig);

injectStore(store);

const queryClient = new QueryClient();
// Default to using the first account if no account is active on page load
if (
  !msalInstance.getActiveAccount() &&
  msalInstance.getAllAccounts().length > 0
) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event: EventMessage) => {
  if (
    (event.eventType === EventType.LOGIN_SUCCESS ||
      event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
      event.eventType === EventType.SSO_SILENT_SUCCESS) &&
    event.payload
  ) {
    const payload = event.payload as AuthenticationResult;
    const account = payload.account;
    msalInstance.setActiveAccount(account);
  }
});

const root = ReactDOM.createRoot(document.getElementById("root")!);
if (!root) throw new Error("Failed to find the root element");

root.render(
  <React.StrictMode>
    <AppInsightsContext.Provider value={reactPlugin}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<NavigatorBar msalInstance={msalInstance} />}
            >
              <Route index element={<ProductTable />} />
              <Route path="UserToken" element={<UserToken />} />
              <Route path="UserListingTable" element={<UserListingTable />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <QueryClientProvider client={queryClient} />
      </Provider>
    </AppInsightsContext.Provider>
  </React.StrictMode>
);
