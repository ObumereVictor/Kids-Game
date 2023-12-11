import React, { useEffect, useState, useRef } from "react";
import { useGlobalContext } from "../utils/Context";
import Loading from "../utils/Loading";
import axios from "axios";
import Modal from "../utils/Modal";
import { useNavigate } from "react-router-dom";
import { ReactSortable, Sortable, MultiDrag, Swap } from "react-sortablejs";
// import { ReactSortable, Sortable, MultiDrag, Swap } from "sortablejs";

const url = "https://api-kids-spelling-game.onrender.com/api/v1";

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
  } = useGlobalContext();

  const navigate = useNavigate();

  const [game, setGame] = React.useState();
  const [drag, setDrag] = React.useState();
  const [drop, setDrop] = React.useState();
  const [dragIndex, setDragIndex] = React.useState();
  const [dragGame, setDragGame] = React.useState([
    { id: 1, word: "W" },
    { id: 2, word: "R" },
    { id: 3, word: "A" },
    { id: 4, word: "P" },
    { id: 5, word: "S" },
  ]);

  useEffect(() => {
    setGame(gameDetails.game);
  });
  React.useEffect(() => {}, [game]);
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
      getGame();
      setIsLoading(false);
      // setGameDetails((details) => {
      //   console.log(details);
      //   details.gameId = "";
      //   console.log(details);
      //   return details;
      // });
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

  const touchStart = (event) => {
    event.preventDefault();
    console.log(event);
    // alert(event.target.innerHTML);
  };

  const touchEnd = (event) => {
    event.preventDefault();
    // console.log(event)
    // alert(event.target.innerHTML);
  };
  const touchMove = (event) => {
    event.preventDefault();
    event.target.draggable = true;
    alert(event.target);
    // btn.current.draggable = true;
  };

  return (
    <main className="playgame-page">
      <h2>Game</h2>
      <i>{gameDetails.username} is currently Playing</i>
      <h4>Arrange the words to the correct spelling</h4>
      <section>
        <div
          // swap
          className="spelling-div"
          onDragOver={handleDragOver}
          onTouchMove={touchMove}
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
                onTouchStart={touchStart}
                onTouchEnd={touchEnd}
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

      <ReactSortable
        list={dragGame}
        setList={setDragGame}
        swap
        swapClass="highlight"
        animation={150}
        forceFallback={false}
      >
        {dragGame.map((spelling, index) => {
          return (
            <button
              // data-gid={index}
              // onDrag={handleDrag}
              // onDrop={handleDrop}
              // onTouchStart={touchStart}
              // onTouchEnd={touchEnd}
              draggable="true"
              key={spelling.id}
              // index={index}
              className="game"
            >
              {spelling.word}
            </button>
          );
        })}
      </ReactSortable>

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
      {modal.show && <Modal quitGame={quitGame} {...modal} />}
    </main>
  );
};

export default PlayGamePage;
