import { useAppSelector } from "../../app/hooks";
import { selectAccessToken, selectClaims } from "./UserSlice";

function UserToken() {
  const claims = useAppSelector(selectClaims);
  const accessToken = useAppSelector(selectAccessToken);

  return (
    <>
      <p>Id Token Claims: {JSON.stringify(claims)}</p>
      <p>User Access Token: {accessToken}</p>
    </>
  );
}

export default UserToken;
