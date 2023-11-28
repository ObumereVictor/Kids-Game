import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../utils/Context";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const DashboardPage = () => {
  const { gameDetails, isAuthenticated, loginToken, getGame } =
    useGlobalContext();
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies();
  console.log({ token: cookies });

  useEffect(() => {
    getGame();
    // gettingUser();
  }, []);

  // CREATE GAME NAV
  const handleCreateGameNav = async (event) => {
    event.preventDefault();
    if (isAuthenticated.user) {
      navigate(`/dashboard/create-game/${isAuthenticated.cookie}`);
    }
    if (loginToken) {
      navigate(`/dashboard/create-game/${loginToken}`);
    }
  };

  // PLAY GAME NAV
  const handlePlayGame = async (event) => {
    event.preventDefault();

    getGame();
    if (isAuthenticated.cookie) {
      navigate(`/playgame/${isAuthenticated.cookie}/${gameDetails.gameId}`);
    }
    if (loginToken) {
      navigate(`/playgame/${loginToken}/${gameDetails.gameId}`);
    }
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
    </main>
  );
};

export default DashboardPage;
