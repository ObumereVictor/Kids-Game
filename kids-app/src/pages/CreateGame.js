import { useGlobalContext } from "../utils/Context";
import { useNavigate } from "react-router-dom";
import Loading from "../utils/Loading";
import { Alert2 } from "../utils/Alert";
const CreateGame = () => {
  const {
    handleCreateGameSubmit,
    isAuthenticated,
    loginToken,
    isLoading,
    alert2,
    showAlert2,
    createGameRef,
  } = useGlobalContext();
  const navigate = useNavigate();

  // HANDLE GO BACK TO DASHBOARD
  const handleGoBack = async (event) => {
    event.preventDefault();

    if (isAuthenticated.user) {
      navigate(`/dashboard/${isAuthenticated.cookie}`);
    }
    if (loginToken) {
      navigate(`/dashboard/${loginToken}`);
    }
  };
  return (
    <main className="create-game-page">
      <h2>Create Game</h2>

      <form onSubmit={handleCreateGameSubmit} ref={createGameRef}>
        <div className="alert2-con">
          {alert2 && <Alert2 {...alert2} removeAlert={showAlert2} />}
        </div>

        <div className="create-game-ele">
          <label htmlFor="addgame">Add Game:</label>
          <input type="text" name="addgame" id="addgame" />
        </div>
        <select name="difficulty">
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <div className="cg-btn">
          <button onClick={handleGoBack}>Go Back</button>
          {isLoading ? (
            <Loading
              type={"balls"}
              height={"100px"}
              width={"100px"}
              color={"green"}
            />
          ) : (
            <input type="submit" value="Create Game" />
          )}
        </div>
      </form>
    </main>
  );
};

export default CreateGame;
