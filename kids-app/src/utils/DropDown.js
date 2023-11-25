import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "./Context";
import Cookies from "js-cookie";

const DropDown = () => {
  const { signOut } = useGlobalContext();
  const navigate = useNavigate();
  const cookie = Cookies.get("login_token");
  return (
    <main className="dropdown">
      <ul>
        <li
          onClick={(event) => {
            event.preventDefault();
            navigate(`../dashboard/edit-profile/${cookie}`);
          }}
        >
          Edit Profile
        </li>
        <li onClick={signOut}>Sign Out</li>
      </ul>
    </main>
  );
};

export default DropDown;
