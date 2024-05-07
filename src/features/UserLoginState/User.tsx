import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import "../../styles/User.css";
import {
  setActiveAccount,
  setAccessToken,
  setClaims,
  selectUser,
} from "./UserSlice";
import { InteractionStatus, SilentRequest } from "@azure/msal-browser";
import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { b2cPolicies, loginRequest } from "../../authConfig";
import UserProps from "../../typeProps/MsalUserPropsType";
import { Link } from "react-router-dom";

const LoginComponent = () => {
  const { instance, inProgress } = useMsal();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  // const activeAccount = instance.getActiveAccount();

  useEffect(() => {
    const activeAccount = instance.getActiveAccount();
    if (activeAccount) {
      dispatch(setActiveAccount(activeAccount));
      dispatch(setClaims(activeAccount?.idTokenClaims));
    }

    const accessTokenRequest: SilentRequest = {
      scopes: loginRequest.scopes,
      account: activeAccount || undefined,
    };

    instance.initialize().then(() => {
      instance.acquireTokenSilent(accessTokenRequest).then((result) => {
        // Acquire token silent success
        dispatch(setAccessToken(result.accessToken));
      });
    });
  }, [dispatch, instance]);

  const handleLoginPopup = () => {
    instance
      .loginPopup({
        ...loginRequest,
        redirectUri: "/",
      })
      .then((result) => {
        dispatch(setAccessToken(result.accessToken));
        dispatch(setActiveAccount(result.account));
        dispatch(setClaims(result.idTokenClaims));
      })
      .catch((error) => console.log(error));
  };

  const handleLogoutRedirect = () => {
    instance
      .logoutPopup({
        mainWindowRedirectUri: "/", // redirects the top level app after logout
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleProfileEdit = () => {
    if (inProgress === InteractionStatus.None) {
      // @ts-expect-error need to pass authority for acquireTokenRedirect to support B2C profile edit
      instance.acquireTokenRedirect(b2cPolicies.authorities.editProfile);
    }
  };

  return (
    <>
      <AuthenticatedTemplate>
        <div className="dropdown">
          <button className="dropbtn">
            User logged in: {user?.idTokenClaims?.name}
          </button>
          <div className="dropdown-content">
            <Link to={"/UserListingTable"}>User Listing Table</Link>
            <Link to={"/UserToken"}>User ID</Link>
            <a href="" onClick={handleProfileEdit}>
              Edit Profile
            </a>
            <a href="" onClick={handleLogoutRedirect}>
              Sign Out
            </a>
          </div>
        </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <li>
          <button onClick={handleLoginPopup}>Popup Sign in</button>
        </li>
      </UnauthenticatedTemplate>
    </>
  );
};

export function User(props: UserProps) {
  // The `state` arg is correctly typed as `RootState` already
  return (
    <MsalProvider instance={props.msalInstance}>
      <LoginComponent />
    </MsalProvider>
  );
  // omit rendering logic
}

export default User;
