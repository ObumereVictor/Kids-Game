import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "./Context";

const Modal = ({ message, status, errorType }) => {
  const { gameDetails, isAuthenticated, showModal, getGame } =
    useGlobalContext();
  const navigate = useNavigate();
  const proceedEvent = (event) => {
    event.preventDefault();
    if (status === "Failed") {
      console.log(status);
      navigate(`/playgame/${isAuthenticated.cookie}/${gameDetails.gameId}`);
      showModal(false, "", "");
    }
    getGame();
    navigate(`/playgame/${isAuthenticated.cookie}/${gameDetails.gameId}`);
    console.log(gameDetails);
    showModal(false, "", "");
  };

  const quitGame = (event) => {
    event.preventDefault();
    navigate(`../dashboard/${isAuthenticated.cookie}`);
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
