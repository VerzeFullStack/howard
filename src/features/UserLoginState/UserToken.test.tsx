import UserToken from "./UserToken";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import configureStore from "redux-mock-store";

describe("User Token", () => {
  const mockStore = configureStore();
  const store = mockStore({
    user: {
      idTokenClaims: {
        id: "1",
      },
      accessToken: "accessToken",
    },
  });

  test("it render user access token", async () => {
    render(
      <Provider store={store}>
        <UserToken />
      </Provider>
    );
    screen.debug();

    console.info(store.getState());
    const testValue = await screen.findByText("accessToken");
    expect(testValue).toBe("User Access Token");
  });
});
