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

  let [game, setGame] = React.useState(gameDetails.game);
  const [drag, setDrag] = React.useState();
  const [drop, setDrop] = React.useState();
  const [dragIndex, setDragIndex] = React.useState();
  const [dragGame, setDragGame] = React.useState([
    { id: 0, game: "W" },
    { id: 1, game: "R" },
    { id: 2, game: "A" },
    { id: 3, game: "P" },
    { id: 4, game: "S" },
  ]);

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

  // Sortable.create(
  //   document.querySelector(".sort", {
  //     swap: true,
  //     // swapClass: "highlight",
  //     animation: 150,
  //   })
  // );
  const handleDrag = (event) => {
    event.preventDefault();

    let dragging = {
      game: event.target.innerText,
      gid: Number(event.target.dataset.gid),
    };
    console.log(dragging);
    const dragIndex = Number(event.target.dataset.gid);
    // console.log({ dragging, dragIndex });
    setDragIndex(dragIndex);
    setDrag(dragging);
  };

  // HANDLE DRAG OVER
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const gidIndex = Number(event.target.dataset.gid);
    setDrag((state) => {
      state.gid = gidIndex;
    });
    let dropping = { game: event.target.innerText, gid: gidIndex };

    setDrop(dropping);
    // console.log(game);

    game = game.map(function (g) {
      return { gid: g.gid, game: g.game };
    });
    console.log(game);
    const findDragIndex = game.findIndex(function (g, index) {
      // console.log(g);
      return index === dragIndex;
    });
    const findDropIndex = game.findIndex(function (g, index) {
      console.log(g);
      return index === gidIndex;
    });
    game.splice(findDropIndex, 1, drag);

    game.splice(findDragIndex, 1, dropping);
    console.log({ game, findDragIndex, findDropIndex });
    // console.log(game);
    // console.log({ g: game });

    setGame((oldState) => {
      let newGame = [...oldState];
      // newGame = newGame.map((g) => [...g.game]);
      // console.log(oldState[0].game);
      return newGame;
    });
    // console.log({ game, dropping, drag, gidIndex, dragIndex });
  };

  // HANDLE GAME SUBMIT
  const handleGameSubmit = async (event) => {
    event.preventDefault();
    // if (isAuthenticated.user) {
    //   postGame(isAuthenticated.cookie, gameDetails.gameId, game);
    // }

    // if (loginToken) {
    // postGame(loginToken || isAuthenticated.cookie, gameDetails.gameId, game);
    // }
    game = game.map((g) => [...g.game]);
    console.log(game);
  };

  // POST GAME
  const postGame = async (token, gameId, game) => {
    setIsLoading(true);
    console.log(game);
    game = game.map((answer) => answer.game);
    console.log(game);
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
      <ReactSortable
        list={game}
        setList={setGame}
        swap
        swapClass={"sortable-swap-highlight"}
        // animation={150}
        // forceFallback={false}
        className="spelling-div"
        // onDragOver={handleDragOver}
        // onTouchMove={touchMove}
        style={{
          display: "flex",
          // backgroundColor: "red",
          height: "70px",
          // width: "150px",
          zIndex: "2",
        }}
      >
        {game.map((spelling, index) => {
          // console.log(spelling.gid, index);
          // let { gid, game } = spelling;
          return (
            <button
              // data-gid={index}
              // onDrag={handleDrag}
              // onDrop={handleDrop}
              // onTouchStart={touchStart}
              // onTouchEnd={touchEnd}
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

      <ReactSortable
        list={dragGame}
        setList={setDragGame}
        swap
        swapClass={"sortable-swap-highlight"}
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
              {spelling.game}
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
