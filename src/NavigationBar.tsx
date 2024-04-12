import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { InteractionStatus } from "@azure/msal-browser"; 
import { loginRequest, b2cPolicies } from './authConfig';


export const NavigationBar = () => {
    const { instance, inProgress } = useMsal();
    const activeAccount = instance.getActiveAccount();

    const handleLoginPopup = () => {
        instance
            .loginPopup({
                ...loginRequest,
                redirectUri: '/',
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
            
                <div>User logged in: {activeAccount?.idTokenClaims?.name}</div>
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
