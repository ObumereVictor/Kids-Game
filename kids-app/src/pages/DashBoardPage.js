import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../utils/Context";
import { useNavigate } from "react-router-dom";
import Modal from "../utils/Modal";
import { Cookies } from "react-cookie";

const DashboardPage = () => {
  const {
    gameDetails,
    isAuthenticated,
    loginToken,
    getGame,
    showModal,
    modal,
    setGameError,
    gameError,
    quitGame,
  } = useGlobalContext();
  const navigate = useNavigate();

  // CREATE GAME NAV
  const handleCreateGameNav = async (event) => {
    event.preventDefault();
    navigate(`/dashboard/create-game/${isAuthenticated.cookie || loginToken}`);
  };

  // PLAY GAME NAV
  const handlePlayGame = async (event) => {
    event.preventDefault();

    // if (isAuthenticated.cookie) {

    if (!gameDetails.gameId) {
      setGameError(true);
      showModal(
        true,
        "You don't have any game available, change the difficulty level on your profile or try again later",
        "Failed",
        "nogameerror"
      );
    }
    if (gameDetails.gameId) {
      navigate(
        `/playgame/${isAuthenticated.cookie || loginToken}/${
          gameDetails.gameId
        }`
      );
      showModal(false, "", "");
    }

    getGame();
  };

  const proceedEvent = (event) => {
    event.preventDefault();

    getGame();

    if (!gameDetails.gameId || gameError) {
      navigate(
        `/dashboard/edit-profile/${loginToken || isAuthenticated.cookie}`
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
  return (
    <main className="dashboard-page">
      <p>
        Be aware the games you get is based on the difficulty level set on your
        profile and it can be changed in the edit profile section <br /> Happy
        Playing!!!
      </p>

      {gameDetails.role === "admin" ? (
        <main className="admin">
          <button onClick={handlePlayGame}>Play Game</button>
          <button onClick={handleCreateGameNav}>Create Game</button>
        </main>
      ) : (
        <main className="user">
          <button onClick={handlePlayGame}>Play Game</button>
        </main>
      )}
      {modal.show && (
        <Modal quitGame={quitGame} proceedEvent={proceedEvent} {...modal} />
      )}
    </main>
  );
};

export default DashboardPage;
