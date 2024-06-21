import User from "../features/UserLoginState/User";
import UserProp from "../typeProps/MsalUserPropsType";
import viteLogo from "/vite.svg";
import { Link, Outlet } from "react-router-dom";

function NavigatorBar(props: UserProp) {
  return (
    <>
      <div className="header">
        <img src={viteLogo} className="logo" alt="Vite logo" />
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
          <User msalInstance={props.msalInstance} />
        </nav>
      </div>
      <Outlet />
    </>
  );
}

export default NavigatorBar;
