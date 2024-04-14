import { useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/App.css';
import { useAppSelector } from './app/hooks';
import { selectUser } from './features/userSlice';


/**
 * msal-react is built on the React context API and all parts of your app that require authentication must be
 * wrapped in the MsalProvider component. You will first need to initialize an instance of PublicClientApplication
 * then pass this to MsalProvider as a prop. All components underneath MsalProvider will have access to the
 * PublicClientApplication instance via context as well as all hooks and components provided by msal-react. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
function App () {

    const user = useAppSelector(selectUser);

    const [count, setCount] = useState(0);

    const [myBool, setmyBool] = useState(true);
  
    const handleClick = () => {
      setmyBool((myBool) => !myBool)
      console.log(myBool);
    };

  return (
    <>
        <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button type="button" onClick={handleClick}>Click Me</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
        {myBool ? <p>Total Count: {count}</p> : <p>False!</p>}
      </div>
      <p>Id Token: {user?.idToken}</p>
        </>
  );
}

export default App
