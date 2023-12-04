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
  } = useGlobalContext();
  const navigate = useNavigate();

  // console.log(gameDetails);
  // useEffect(() => {
  //   getGame();
  //   // gettingUser();
  // }, [gameDetails]);

  // CREATE GAME NAV
  const handleCreateGameNav = async (event) => {
    event.preventDefault();
    // if (isAuthenticated.user) {
    navigate(`/dashboard/create-game/${isAuthenticated.cookie || loginToken}`);
    // }
    // if (loginToken) {
    //   navigate(`/dashboard/create-game/${loginToken}`);
    // }
  };

  // PLAY GAME NAV
  const handlePlayGame = async (event) => {
    event.preventDefault();

    console.log({ isAuthenticated, loginToken });

    // if (isAuthenticated.cookie) {

    if (!gameDetails.gameId) {
      setGameError(true);
      showModal(true, "No game", "error.status", "error.erroyType");
      return;
    }
    if (gameDetails.gameId) {
      navigate(
        `/playgame/${isAuthenticated.cookie || loginToken}/${
          gameDetails.gameId
        }`
      );
    }
    // }
    // if (loginToken) {
    //   navigate(`/playgame/${loginToken}/${gameDetails.gameId}`);
    // }
    showModal(false, "", "");
    getGame();
  };
  return (
    <main className="dashboard-page">
      <p>
        Be aware the games you get is based on the difficulty level set on your
        profile and it can be changed in the edit profile section <br /> Happy
        Playing!!!
      </p>

      {gameDetails.role === "admin" ? (
        <main>
          <button onClick={handlePlayGame}>Play Game</button>
          <button onClick={handleCreateGameNav}>Create Game</button>
        </main>
      ) : (
        <main>
          <button onClick={handlePlayGame}>Play Game</button>
        </main>
      )}
      {modal.show && <Modal {...modal} />}
    </main>
  );
};

export default DashboardPage;
