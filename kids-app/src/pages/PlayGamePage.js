import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../utils/Context";
import Loading from "../utils/Loading";
import axios from "axios";
import Modal from "../utils/Modal";
import { useNavigate } from "react-router-dom";
const url = "https://api-kids-spelling-game.onrender.com/api/v1";

const PlayGamePage = () => {
  const {
    gameDetails,
    isLoading,
    setIsLoading,
    isAuthenticated,
    loginToken,
    modal,
    showModal,
  } = useGlobalContext();

  const navigate = useNavigate();

  const [game, setGame] = React.useState();
  const [drag, setDrag] = React.useState();
  const [drop, setDrop] = React.useState();
  const [dragIndex, setDragIndex] = React.useState();

  useEffect(() => {
    setGame(gameDetails.game);
  });
  React.useEffect(() => {}, [game]);
  //   useEffect(() => {
  //     // showModal(false, "", "");
  //   }, [modal]);

  if (game === undefined || isLoading) {
    return (
      <main className="fetch-loading">
        <Loading
          className={"loading"}
          type={"spin"}
          height={"100px"}
          width={"100px"}
          color={"green"}
        />
      </main>
    );
  }
  const handleDrag = (event) => {
    event.preventDefault();
    event.preventDefault();
    const dragging = event.target.innerText;
    const dragIndex = Number(event.target.dataset.gid);
    setDragIndex(dragIndex);
    setDrag(dragging);
  };

  // HANDLE DRAG OVER
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.preventDefault();
    const gidIndex = Number(event.target.dataset.gid);
    const dropping = event.target.innerText;
    setDrop(dropping);

    const findDragIndex = game.findIndex((g, index) => index === dragIndex);
    const findDropIndex = game.findIndex((g, index) => index === gidIndex);
    game.splice(findDropIndex, 1, drag);

    game.splice(findDragIndex, 1, dropping);

    setGame((oldState) => {
      const newGame = [...oldState];
      return newGame;
    });
  };

  // HANDLE GAME SUBMIT
  const handleGameSubmit = async (event) => {
    event.preventDefault();
    if (isAuthenticated.user) {
      postGame(isAuthenticated.cookie, gameDetails.gameId, game);
    }

    if (loginToken) {
      postGame(loginToken, gameDetails.gameId, game);
    }
  };

  // POST GAME
  const postGame = async (token, gameId, game) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        url + `/playgame/${token}/${gameId}`,
        game,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.status === 200) {
        showModal(true, response.data.msg, response.data.status);
        // fetchNextGame(isAuthenticated.cookie, gameDetails.gameId);
      }

      setIsLoading(false);
      if (isAuthenticated.user) {
        // fetchNextGame(isAuthenticated.cookie, gameDetails.gameId);
      }

      if (loginToken) {
        // fetchNextGame(loginToken, gameDetails.gameId);
      }
    } catch (error) {
      console.log({ error });
      console.log("Hello");
      error = error.response.data;
      showModal(true, error.msg, error.status);
      setIsLoading(false);
    }
  };

  // QUIT GAME
  const quitGame = (event) => {
    event.preventDefault();
    navigate(`../dashboard/${isAuthenticated.cookie}`);
  };

  const fetchNextGame = async (token, gameId) => {
    try {
      const response = await axios.patch(url + `/playgame/${token}/${gameId}`, {
        withCredentials: true,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <main className="playgame-page">
      <h2>Game</h2>
      <i>{gameDetails.username} is currently Playing</i>
      <h4>Arrange the words to the correct spelling</h4>
      <section>
        <div
          className="spelling-div"
          onDragOver={handleDragOver}
          style={{
            display: "flex",
            // backgroundColor: "red",
            height: "70px",
            // width: "150px",
            zIndex: "2",
          }}
        >
          {game.map((spelling, index) => {
            return (
              <button
                data-gid={index}
                onDrag={handleDrag}
                onDrop={handleDrop}
                draggable="true"
                key={index}
                index={index}
                className="game"
              >
                {spelling}
              </button>
            );
          })}
        </div>
      </section>
      <section>
        {gameDetails.answer && (
          <div>
            {gameDetails.answer.map((answer, index) => {
              return (
                <button className="answer" key={index}>
                  {answer}
                </button>
              );
            })}
          </div>
        )}
      </section>
      <button onClick={quitGame}>Quit game</button>
      <button onClick={handleGameSubmit} className="submit-game-btn">
        Submit
      </button>
      {modal.show && <Modal {...modal} />}
    </main>
  );
};

export default PlayGamePage;
