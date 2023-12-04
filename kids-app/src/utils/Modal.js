import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "./Context";

const Modal = ({ message, status, errorType, quitGame }) => {
  const { gameDetails, isAuthenticated, showModal, getGame } =
    useGlobalContext();
  const navigate = useNavigate();
  const proceedEvent = (event) => {
    event.preventDefault();
    getGame();
    if (loginToken) {
      if (status === "Failed") {
        console.log(status);
        navigate(`/playgame/${loginToken}/${gameDetails.gameId}`);
        showModal(false, "", "");
      }
      // getGame();
      navigate(`/playgame/${loginToken}/${gameDetails.gameId}`);
      console.log(gameDetails);
      showModal(false, "", "");
    }
    if (isAuthenticated.user) {
      if (status === "Failed") {
        console.log(status);
        navigate(`/playgame/${isAuthenticated.cookie}/${gameDetails.gameId}`);
        showModal(false, "", "");
      }
      // getGame();
      navigate(`/playgame/${isAuthenticated.cookie}/${gameDetails.gameId}`);
      console.log(gameDetails);
      showModal(false, "", "");
    }
  };

  return (
    <main className="modal-page">
      <h2>
        {gameDetails.username}, {message}
      </h2>

      <section className="modal-btns">
        <button onClick={quitGame}>Quit game</button>
        {status === "Failed" ? (
          <button onClick={proceedEvent}>
            {errorType === "nogameerror"
              ? "Proceed to Edit Profile"
              : "Try again"}
          </button>
        ) : (
          <button onClick={proceedEvent}>Proceed to the next game</button>
        )}
      </section>
    </main>
  );
};

export default Modal;
