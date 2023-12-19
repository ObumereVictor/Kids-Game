import React, { useEffect, useState, useRef } from "react";
import { useGlobalContext } from "../utils/Context";
import Loading from "../utils/Loading";
import axios from "axios";
import Modal from "../utils/Modal";
import { useNavigate } from "react-router-dom";
import { ReactSortable, Sortable, MultiDrag, Swap } from "react-sortablejs";
// import { ReactSortable, Sortable, MultiDrag, Swap } from "sortablejs";

const url = "https://api-spelling-game.onrender.com/api/v1";
// const url = "http://localhost:3001/api/v1";

const PlayGamePage = () => {
  // Sortable.mount(new MultiDrag(), new Swap());
  const {
    gameDetails,
    isLoading,
    setIsLoading,
    isAuthenticated,
    loginToken,
    modal,
    showModal,
    setGameError,
    setGameDetails,
    getGame,
    gameLoading,
  } = useGlobalContext();

  const navigate = useNavigate();

  let [game, setGame] = React.useState(gameDetails.game);
  const [drag, setDrag] = React.useState();
  const [drop, setDrop] = React.useState();
  const [dragIndex, setDragIndex] = React.useState();

  // useEffect(() => {
  //   setGame(gameDetails.game);
  // });
  // React.useEffect(() => {}, [game]);
  // const btn = useRef(null);

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
  // const handleDrag = (event) => {
  //   event.preventDefault();

  //   let dragging = {
  //     game: event.target.innerText,
  //     gid: Number(event.target.dataset.gid),
  //   };
  //   console.log(dragging);
  //   const dragIndex = Number(event.target.dataset.gid);
  //   // console.log({ dragging, dragIndex });
  //   setDragIndex(dragIndex);
  //   setDrag(dragging);
  // };

  // HANDLE DRAG OVER
  // const handleDragOver = (event) => {
  //   event.preventDefault();
  // };

  // const handleDrop = (event) => {
  //   event.preventDefault();
  //   const gidIndex = Number(event.target.dataset.gid);
  //   setDrag((state) => {
  //     state.gid = gidIndex;
  //   });
  //   let dropping = { game: event.target.innerText, gid: gidIndex };

  //   setDrop(dropping);

  //   game = game.map(function (g) {
  //     return { gid: g.gid, game: g.game };
  //   });
  //   console.log(game);
  //   const findDragIndex = game.findIndex(function (g, index) {
  //     return index === dragIndex;
  //   });
  //   const findDropIndex = game.findIndex(function (g, index) {
  //     console.log(g);
  //     return index === gidIndex;
  //   });
  //   game.splice(findDropIndex, 1, drag);

  //   game.splice(findDragIndex, 1, dropping);
  //   console.log({ game, findDragIndex, findDropIndex });

  //   setGame((oldState) => {
  //     let newGame = [...oldState];

  //     return newGame;
  //   });
  // };

  // HANDLE GAME SUBMIT
  const handleGameSubmit = async (event) => {
    event.preventDefault();

    postGame(loginToken || isAuthenticated.cookie, gameDetails.gameId, game);
  };

  // POST GAME
  const postGame = async (token, gameId, game) => {
    setIsLoading(true);
    let gameArray = [];
    // console.log(game);
    // game = game.map((answer) => answer.game);
    game = game.map((g) => [...g.game]);
    game = gameArray.concat(...game);
    try {
      const response = await axios.post(
        url + `/playgame/${token}/${gameId}`,
        game,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      getGame();
      if (response.status === 200) {
        showModal(true, response.data.msg, response.data.status);

        // fetchNextGame(isAuthenticated.cookie, gameDetails.gameId);
      }
      setIsLoading(false);
    } catch (error) {
      console.log({ error });
      error = error.response.data;
      showModal(true, error.msg, error.status);
      setIsLoading(false);
    }
  };

  // QUIT GAME
  const quitGame = (event) => {
    event.preventDefault();

    showModal(false, "", "", "");
    navigate(`../dashboard/${isAuthenticated.cookie || loginToken}`);
    setGameError(false);
  };

  return gameLoading ? (
    <main className="fetch-loading">
      <Loading height={"100px"} width={"100px"} type={"spin"} color={"green"} />
    </main>
  ) : (
    <main className="playgame-page">
      <h2>Spellng Game</h2>
      <i>{gameDetails.username} is currently Playing</i>
      <h4>Arrange the words to the correct spelling</h4>
      <ReactSortable
        list={game}
        setList={setGame}
        swap
        swapClass={"sortable-swap-highlight"}
        // animation={150}
        // forceFallback={false}
        className="game-div"
      >
        {game.map((spelling, index) => {
          return (
            <button
              draggable="true"
              key={spelling.gid}
              // index={index}
              className="game"
            >
              {spelling.game}
            </button>
          );
        })}
      </ReactSortable>

      <section>
        {gameDetails.answer && (
          <div className="answer-div">
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
      <section className="game-btn">
        <button onClick={quitGame}>Quit game</button>
        <button onClick={handleGameSubmit} className="submit-game-btn">
          Submit
        </button>
      </section>
      {modal.show && <Modal quitGame={quitGame} {...modal} />}
    </main>
  );
};

export default PlayGamePage;
