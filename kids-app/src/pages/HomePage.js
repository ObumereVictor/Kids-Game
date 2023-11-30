import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../utils/Context";
const HomePage = () => {
  const navigate = useNavigate();
  const { setVerifyPage } = useGlobalContext();

  useEffect(() => {
    setVerifyPage(false);
  }, []);

  return (
    <main className="homepage">
      <p>
        Welcome to ALTCODE Spelling Game, an incredible app designed to make the
        journey of learning English spelling an enjoyable experience. With a
        vast collection of over 1000 commonly used words, this app caters to
        learners of all levels. From 3-letter to 11-letter words, you'll find a
        diverse range of vocabulary to explore and learn. <br />
        Kids learn how to spell in the first and second grades. Most early
        spelling words need to be memorized and it would help them: <br />
      </p>
      <ul>
        <li>Get creative.</li>
        <li>Write words out by hand.</li>
        <li> Encourage reading.</li>
        <li>Spell the word out loud.</li>
        <li>Keep words on display.</li>
        <li>Play games to practice</li>
      </ul>

      <button onClick={() => navigate("sign-up")}>Get Started</button>

      <footer>&copy; ALTCODE {new Date().getFullYear()}</footer>
    </main>
  );
};

export default HomePage;
