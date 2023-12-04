import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "./Context";

const Modal = ({ message, status, errorType, quitGame }) => {
  const {
    gameDetails,
    isAuthenticated,
    showModal,
    getGame,
    loginToken,
    gameError,
  } = useGlobalContext();
  const navigate = useNavigate();

  //  GAME PROCEED EVENTS
  const proceedEvent = (event) => {
    event.preventDefault();
    getGame();
    if (status === "Failed") {
      console.log(status);
      console.log(status);
      navigate(
        `/playgame/${loginToken || isAuthenticated.cookie}/${
          gameDetails.gameId
        }`
      );
      showModal(false, "", "");
    }
    // getGame();

    if (!gameDetails.gameId) {
      console.log({ gameError, status, errorType });
      navigate(
        `../dashboard/edit-profile/${loginToken || isAuthenticated.cookie}`
      );
    }
    navigate(
      `/playgame/${loginToken || isAuthenticated.cookie}/${gameDetails.gameId}`
    );
    showModal(false, "", "");
  };

  // REMOVE MODAL
  function remove(event) {
    event.preventDefault();
    showModal(false, "", "");
  }

  return (
    <main className="modal-page">
      <h2>
        {gameDetails.username}, {message}
      </h2>

      <section className="modal-btns">
        <button onClick={quitGame || remove}>Quit game</button>
        {status === "Failed" ? (
          <button onClick={proceedEvent}>
            {errorType === "nogameerror"
              ? "Proceed to Edit Profile"
              : "Try again"}
          </button>
        ) : (
          <button onClick={proceedEvent}>
            {!gameDetails.gameId
              ? "Proceed to change difficulty Profile"
              : "Proceed to the next game"}
          </button>
        )}
      </section>
    </main>
  );
};

export default Modal;
