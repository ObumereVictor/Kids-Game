import React, { useEffect } from "react";
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

  // useEffect(() => {
  //   getGame();
  // }, []);

  //  GAME PROCEED EVENTS
  const proceedEvent = (event) => {
    event.preventDefault();
    // if (status === "Failed") {
    //   console.log(status);
    //   navigate(
    //     `/playgame/${loginToken || isAuthenticated.cookie}/${
    //       gameDetails.gameId
    //     }`
    //   );
    //   showModal(false, "", "");
    // }
    // getGame();
    getGame();

    if (!gameDetails.gameId || gameError) {
      console.log({ gameError, status, errorType });
      navigate(
        `../dashboard/edit-profile/${loginToken || isAuthenticated.cookie}`
      );
    }
    if (gameDetails.gameId) {
      console.log(gameDetails.gameId);
      navigate(
        `/playgame/${loginToken || isAuthenticated.cookie}/${
          gameDetails.gameId
        }`
      );
    }
    showModal(false, "", "");
  };

  // REMOVE MODAL
  function remove(event) {
    event.preventDefault();
    showModal(false, "", "");
  }

  return (
    <main className="modal-page">
      <h4>
        {gameDetails.username}, {message}
      </h4>

      <section className="modal-btns">
        <button onClick={quitGame || remove}>Quit game</button>
        {status === "Failed" ? (
          <button onClick={proceedEvent}>
            {/* {errorType === "nogameerror"
              ? "Proceed to Edit Profile"
              : "Try again"} */}
            {gameError ? "Proceed to edit Profile" : "Try Again"}
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
