import { BiError } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <main className="error-page">
      <div>
        <BiError className="error-icon" />
        <p>Page Not found</p>

        <button onClick={() => navigate("/")}> Back to Home</button>
      </div>
    </main>
  );
};

export default NotFoundPage;
