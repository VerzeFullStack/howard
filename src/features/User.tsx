import { useEffect } from 'react'

import { useAppSelector, useAppDispatch } from '../app/hooks'

import { selectUser, setActiveAccount } from './userSlice'
import { IPublicClientApplication, InteractionStatus } from '@azure/msal-browser';
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { b2cPolicies, loginRequest } from '../authConfig';


type UserProps = {msalInstance: IPublicClientApplication};

const LoginComponent = () => {
    const { instance, inProgress } = useMsal();
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    // const activeAccount = instance.getActiveAccount();

    useEffect(() => {
        const activeAccount = instance.getActiveAccount();
        if (activeAccount) {
            dispatch(setActiveAccount(activeAccount));
        }
    }, [dispatch, instance]);

    const handleLoginPopup = () => {
        instance
            .loginPopup({
                ...loginRequest,
                redirectUri: '/',
            })
            .then(result => {
                dispatch(setActiveAccount(result.account));
            })
            .catch((error) => console.log(error));
    };

    const handleLoginRedirect = () => {
        instance.loginRedirect(loginRequest).catch((error) => console.log(error));
    };

    const handleLogoutRedirect = () => {
        instance.logoutPopup({
            mainWindowRedirectUri: '/', // redirects the top level app after logout
        }).catch(error => {console.log(error)});
    };

    const handleProfileEdit = () => {
        if(inProgress === InteractionStatus.None){
           instance.acquireTokenRedirect(b2cPolicies.authorities.editProfile);
        }
    };

    const handleResetPassword = () => {
        if(inProgress === InteractionStatus.None){
            instance.acquireTokenRedirect(b2cPolicies.authorities.forgotPassword);
         }
    };
    
    return (
        <>
             <AuthenticatedTemplate>
             <br />
            <h5>
                <center>Welcome to the Microsoft Authentication Library For React Tutorial</center>
            </h5>
            
                <div>User logged in: {user?.idTokenClaims?.name}</div>
                    <button onClick={handleProfileEdit}>
                            Edit Profile
                    </button>
                    <button onClick={handleLogoutRedirect}>
                            Sign Out
                    </button>                   
                 
                <footer>
                    <center>
                        How did we do?
                        <a
                            href="https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR73pcsbpbxNJuZCMKN0lURpUMlRHSkc5U1NLUkxFNEtVN0dEOTFNQkdTWiQlQCN0PWcu"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {' '}
                            Share your experience!
                        </a>
                    </center>
                </footer>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <div >
                    <button onClick={handleLoginPopup}>
                                Sign in using Popup
                    </button>
                    <button onClick={handleLoginRedirect}>
                                Sign in using Redirect
                    </button>
                    <button onClick={handleResetPassword}>
                                Reset Password Redirect
                    </button>
                </div>
            </UnauthenticatedTemplate>
            
        </>
    );
};


export function User(props: UserProps) {
  // The `state` arg is correctly typed as `RootState` already
  return (
    <MsalProvider instance={props.msalInstance}>
              <LoginComponent />
              </MsalProvider>)
  // omit rendering logic
}

export default User