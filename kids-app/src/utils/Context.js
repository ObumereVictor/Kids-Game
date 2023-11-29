import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { TiTick } from "react-icons/ti";
import { BiSolidErrorAlt } from "react-icons/bi";
import Cookies from "js-cookie";
import { useCookies } from "react-cookie";

const AppContext = React.createContext();
const url = "https://api-kids-spelling-game.onrender.com/api/v1";
// const url = "http://localhost:3001/api/v1";

const cookie = Cookies.get("login_token");

const useGlobalContext = () => {
  return React.useContext(AppContext);
};
const AppProvider = ({ children }) => {
  //********************/      HOOKS *****************************//

  const [toggle, setToggle] = React.useState(false);
  const [isPasswordShown, setIsShownPassword] = useState({
    password: false,
    repassword: false,
  });
  const [location, setLocation] = useState();
  const [userInputs, setUserInputs] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    password: "",
    repassword: "",
    username: "",
    readterms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    status: "",
    msg: "",
    icon: "",
  });
  const [alert2, setAlert2] = useState({
    show: false,
    msg: "",
  });
  const [verifyPage, setVerifyPage] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    verified: false,
    userId: "",
  });

  const [signInDetails, setSignInDetails] = useState({
    email: "",
    password: "",
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const [isSignInPassword, setSignInPassword] = useState(false);

  const [resetPasswordToken, setResetPasswordToken] = useState("");

  const [updatePasswordDetails, setUpdatePasswordDetails] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [isResetPasswordShown, setIsResetPasswordShown] = useState({
    newpassword: false,
    confirmpassword: false,
  });

  const [isForgotPasswordNav, setForgotPasswordNav] = useState(false);
  const [isResetPasswordNav, setIsResetPasswordNav] = useState(false);
  const [loginNav, setLoginNav] = useState({
    gotodashboard: false,
    gotoverifypage: false,
    gotocompleteprofile: false,
  });

  const [isDashboardActive, setDashboardActive] = useState(true);
  const [loginToken, setLoginToken] = useState(null);
  const [image, setImage] = useState();
  const [difficulty, setDifficulty] = useState();
  const [isAuthenticated, setAuthenticated] = useState({
    user: false,
    cookie: "",
    userId: null,
  });

  const [gameDetails, setGameDetails] = useState({});
  const [modal, setModal] = useState({
    show: false,
    message: null,

    status: "",
    errorType: "",
  });

  const [isTermsActive, setIsTermActive] = useState(false);

  const [cookies, setCookies] = useCookies([]);

  // console.log({ cookies, cookiess });

  //*****************************USE EFFECTS ************************** */
  useEffect(() => {
    isCookie();
  }, [userDetails]);

  // USEEFFECT TO FETCH LOCATION
  useEffect(() => {
    fetctUserLocation();
    // termsAndConRef.current.style.display = "none";
  }, []);

  //******************************** *USE REFS  ***************************//
  const ageRef = useRef(null);
  const repasswordRef = useRef(null);
  const forgotPasswordEmailRef = useRef(null);
  const termsAndConRef = useRef(null);
  const checkboxRef = useRef(null);
  const createGameRef = useRef(null);

  ////////////                 METHODS             /////////////////

  // CHECKING IF USER IS LOGGED IN
  const isCookie = async () => {
    if (cookie) {
      console.log(cookie);
      try {
        const response = await axios(url + `/dashboard/${cookie}`, {
          withCredentials: true,
        });
        console.log(response);

        if (response.status === 200) {
          setAuthenticated({
            user: true,
            cookie: cookie,
            userId: null,
          });
        }

        setGameDetails({ ...response.data });
      } catch (error) {
        throw new Error("Sign in");
        setAuthenticated({
          user: true,
          cookie: cookie,
          userId: error.response.data.userId,
        });
        console.log(error);
      }
    }
  };

  // FETCH LOCATION

  const fetctUserLocation = async () => {
    const response = await axios("https://jsonip.com/");
    const { ip, country } = response.data;
    setLocation({ ip, country });
    return { ip, country };
  };

  //************************** SHOW ALERT  **********************//

  const showAlert = (show = false, status, msg, icon) => {
    setAlert({ show, status, msg, icon });
  };
  const showAlert2 = (show = false, status, msg) => {
    setAlert2({ show, status, msg });
  };

  // ******************** SHOW MODAL *******************//
  const showModal = (
    show = true,
    message,

    status,
    errorType
  ) => {
    setModal({ show, message, status, errorType });
  };

  //*********************  SIGN UP  USER ********************************//
  const registerUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(url + "/register", {
        ...userInputs,
        location,
      });
      console.log(response);
      // const {email, userId, verified} = response.data
      setUserDetails((oldDetails) => {
        const newDetails = { ...oldDetails, ...response.data };
        return newDetails;
      });
      // SUCCESSFUL REGISTRATION
      if (response.status === 201) {
        showAlert(true, response.data.status, "Done..", <TiTick />);
        setVerifyPage(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      error = error.response.data;
      setIsLoading(false);

      // NO FIELDS ERROR
      if (error.errorType === "nofields") {
        showAlert2(true, error.status, "Please Input the required fields");
      }

      // AGE ERROR
      if (error.errorType === "invalidage") {
        ageRef.current?.classList.add("input-error");
        showAlert2(true, error.status, error.msg);
      }
      // NOT MATCH ERROR
      if (error.errorType === "notmatch") {
        repasswordRef.current.classList.add("input-error");
      }
      // EMAIL AVALIABLE ERROR
      if (error.errorType === "emailexist") {
        showAlert2(true, error.status, "Email Already Exist!");
      }
      if (error.errorType === "usernameexist") {
        showAlert2(true, error.status, "Username Exits!");
      }

      // FIRST NAME ERROR
      if (error.errorType === "firstnameError") {
        showAlert2(true, error.status, error.msg);
      }
      // LAST NAME ERROR
      if (error.errorType === "lastnameError") {
        showAlert2(true, error.status, error.msg);
      }
      // USERNAME ERROR
      if (error.errorType === "usernameError") {
        showAlert2(true, error.status, error.msg);
      }
      // PASSWORD ERROR
      if (error.errorType === "passwordError") {
        showAlert2(true, error.status, error.msg);
      }

      //  TERMS ERROR
      if (error.errorType === "termserror") {
        showAlert2(true, error.status, error.msg);
      }

      // SERVER ERROR
      if (error.errorType === "serverError") {
        showAlert(true, error.status, error.msg, <BiSolidErrorAlt />);
      }
    }
  };

  // HANDLE SIGN UP CHANGE
  const handleSignUpChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setUserInputs((values) => ({ ...values, [name]: value }));
  };

  // HANDLE SIGN UP SUBMIT
  const handleSignUpSubmit = (event) => {
    event.preventDefault();
    registerUser();
    ageRef.current?.classList.remove("input-error");

    repasswordRef.current?.classList.remove("input-error");
    showAlert2(false, "", "");

    // setUserInputs({});
  };
  // ********************* SIDE BAR ***************************//
  // SHOW SIDE BAR
  const showSideBar = () => {
    setToggle(true);
  };

  //HIDE SIDE BAR
  const hideSideBar = () => {
    setToggle(false);
    // setLoginNav({
    //   gotodashboard: false,
    //   gotoverifypage: false,
    //   gotocompleteprofile: false,
    // });
  };

  // HANDLE SHOW PASSWORD
  const handlePassword = (event) => {
    if (event.target.classList.contains("show")) {
      setIsShownPassword((values) => {
        values.password = true;
        return { ...values };
      });
    }
    if (event.target.classList.contains("hide")) {
      setIsShownPassword((values) => {
        values.password = false;
        return { ...values };
      });
    }
  };

  // HANDLE RETYPE PASSWORD
  const handleRePassword = (event) => {
    if (event.target.classList.contains("show")) {
      setIsShownPassword((values) => {
        values.repassword = true;
        return { ...values };
      });
    }
    if (event.target.classList.contains("hide")) {
      setIsShownPassword((values) => {
        values.repassword = false;
        return { ...values };
      });
    }
  };

  // *********************** SEND VERIFICATION MAIL *********************//
  // RESEND VERIFICATION EMAIL
  const resendVerficationEmail = async () => {
    const response = await axios.post(
      url + `/register/${userDetails.userId}`,

      {
        withCredentials: true,
      }
    );
    if (!loginNav.gotoverifypage) {
      showAlert2(true, response.data.status, response.data.msg);
    }
    console.log(response);
  };

  // GET USER
  const getUser = async () => {
    try {
      const response = await axios(url + `/register/${userDetails.userId}`);

      setUserDetails((oldDetails) => {
        const newDetails = { ...oldDetails, verified: response.data.verified };
        return newDetails;
      });
    } catch (error) {
      console.log(error);
    }
  };

  //  RESET FORM
  const resetForm = () => {
    setUserInputs({
      firstname: "",
      lastname: "",
      email: "",
      age: "",
      password: "",
      repassword: "",
      username: "",
    });
  };

  // *************************** SIGN IN *************************//

  // HANDLE SIGN IN CHANGE

  const handleSignInChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setSignInDetails((values) => ({ ...values, [name]: value }));
  };

  // HANDLE SIGN IN SUBMIT
  const handleSignInSubmit = (event) => {
    event.preventDefault();
    signIn();
    setIsLoading(true);
  };
  // SIGN IN
  const signIn = async () => {
    try {
      const response = await axios.post(
        url + "/sign-in",
        {
          ...signInDetails,
        },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin":
              "https://kids-spelling-game.onrender.com/",
          },
        }
      );
      console.log(response);
      showAlert2(false, "", "");

      let loginToken = response.data.token;
      setCookies("login_token", loginToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 1000,
      });
      console.log(cookies);

      setLoginToken(loginToken);
      setIsLoading(false);
      if (response.data.responseType === "verifyAccount") {
        const { email, verified, userId } = response.data;
        setUserDetails((values) => {
          const newValues = { ...values, email, verified, userId };
          return newValues;
        });
        console.log(userDetails);
        setLoginNav((navs) => {
          navs.gotoverifypage = true;
          return navs;
        });
      }
      if (response.data.responseType === "completeProfile") {
        setLoginNav((navs) => {
          navs.gotocompleteprofile = true;
          return navs;
        });
        const { email, verified, userId } = response.data;

        setUserDetails((values) => {
          const newValues = { ...values, email, verified, userId };
          return newValues;
        });
      }
      if (response.data.responseType === "loggedIn") {
        setIsLoading(true);
        setLoginNav((navs) => {
          navs.gotodashboard = true;
          return navs;
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      error = error.response.data;
      /// HANDLING ERRORS ///

      // NO INPUTS

      if (error.errorType === "noFields") {
        showAlert2(true, error.status, error.msg);
      }
      // INVALID EMAIL
      if (error.errorType === "invalidEmail") {
        showAlert2(true, error.status, error.msg);
      }

      // PASSWORD ERROR
      if (error.errorType === "invalidPassword") {
        showAlert2(true, error.status, error.msg);
      }
    }
  };

  // const gettingUser = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axios(url + `/dashboard/${loginToken}`, {
  //       withCredentials: true,
  //     });
  //     console.log(response);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // **************************** FORGOT PASSWORD **************************//

  // HANDLE FORGOT PASSWORD SUBMIT
  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    // SENDING RESET PASSORD TO BACKEND
    try {
      const response = await axios.post(url + "/forgot-password", {
        email: forgotPasswordEmail,
      });
      if (response.status === 200) {
        showAlert(true, response.data.status, response.data.msg, <TiTick />);
        setIsLoading(false);
        forgotPasswordEmailRef.current.reset();
      }
    } catch (error) {
      console.log(error);
      error = error.response.data;

      // NO INPUT ERROR
      if (error.errorType === "noInputError") {
        showAlert2(true, error.status, error.msg);
      }
      setIsLoading(false);
    }
  };

  // HANDLE FORGOT PASSWORD ONCHANGE
  const handleForgotPasswordOnChange = (event) => {
    const email = event.target.value;
    setForgotPasswordEmail(email);
  };

  // HANDLE FORGOT PASSWORD ON CHANGE
  const handleResetPasswordOnChange = (event) => {
    const { name, value } = event.target;
    setUpdatePasswordDetails((oldValues) => {
      const newValues = { ...oldValues, [name]: value };
      return newValues;
    });
  };

  // ************************ RESET PASSWORD ************************//

  // RESET USER PASSWORD

  const resetPassword = async () => {
    try {
      const response = await axios.post(
        url + `/reset-password/${resetPasswordToken}`,
        updatePasswordDetails
      );
      console.log(response);
      if (response.status === 201) {
        showAlert(true, response.data.status, response.data.msg, <TiTick />);
        setIsLoading(false);
        setIsResetPasswordNav(true);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error.response.data);
      error = error.response.data;

      // NO FIELDS ERROR
      if (error.errorType === "nofields") {
        showAlert2(true, error.status, error.msg);
      }

      // PASSWORD DOESNT MATCH
      if (error.errorType === "notmatch") {
        showAlert2(true, error.status, error.msg);
      }

      // LINK EXPIRED
      if (error.errorType === "linkexpired") {
        showAlert(true, error.status, error.msg, <TiTick />);
        setForgotPasswordNav(true);
      }
    }
  };

  // HANDLE RESET PASSWORD SUBMIT
  const handleResetPasswordSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    resetPassword();
  };

  // HANDLE RESET NEW PASSWORD TOGGLE
  const handleNewPasswordToggle = (event) => {
    if (event.target.classList.contains("show")) {
      setIsResetPasswordShown((oldvalues) => {
        oldvalues.newpassword = true;
        return { ...oldvalues };
      });
    }
    if (event.target.classList.contains("hide")) {
      setIsResetPasswordShown((oldvalues) => {
        oldvalues.newpassword = false;
        return { ...oldvalues };
      });
    }
  };

  // HANDLE RESET CONFIRM PASSWORD TOGGLE
  const handleConfirmPasswordToggle = (event) => {
    if (event.target.classList.contains("show")) {
      setIsResetPasswordShown((oldvalues) => {
        oldvalues.confirmpassword = true;
        return { ...oldvalues };
      });
    }
    if (event.target.classList.contains("hide")) {
      setIsResetPasswordShown((oldvalues) => {
        oldvalues.confirmpassword = false;
        return { ...oldvalues };
      });
    }
  };

  // ********************* TERMS AND CONDITION *************************//

  // HANDLE TERMS AND CONDITION SHOW
  const handleTermsAndConditionShow = (event) => {
    event.preventDefault();
    termsAndConRef.current.style.display = "block";
    // setIsTermActive(true);
  };

  // HANDLE TERMS AND CONDITION HIDE
  const handleTermsAndConditionHide = (event) => {
    event.preventDefault();
    // setIsTermActive(false);
    termsAndConRef.current.style.display = "none";
    if (!userInputs.readterms) {
      checkboxRef.current.checked = true;
      setUserInputs((values) => {
        values.readterms = true;
        return values;
      });
    }
  };

  // HANDLE TERMS AND CONDITION ON CHANGE
  const handleCheckboxOnChange = (event) => {
    setUserInputs((values) => {
      values.readterms = event.target.checked;
      return values;
    });
  };

  // ************************* SIGN OUT ************************** //

  //  SIGN OUT
  const signOut = () => {
    Cookies.remove("login_token");
    setLoginNav({
      gotocompleteprofile: false,
      gotoverifypage: false,
      gotodashboard: false,
    });
    setAuthenticated({
      user: false,
      cookie: cookie,
    });
    setLoginToken(null);
  };

  //********************** COMPLETE PROFILE *************************/

  const handleDifficulty = (event) => {
    event.preventDefault();

    // setDifficulty(event.target.elements.difficulty.selectedOptions[0].value);
  };

  //********************** GAME METHODS *************************/

  // HANDLE CREATE GAME SUBMIT
  const handleCreateGameSubmit = async (event) => {
    event.preventDefault();
    const game = event.target.elements.addgame.value;
    const difficulty = event.target.elements.difficulty.value;
    setIsLoading(true);
    if (isAuthenticated.user) {
      createGame(isAuthenticated.cookie, { game, difficulty });
    }
    if (loginToken) {
      createGame(loginToken, { game, difficulty });
    }
  };

  // CREATING GAME
  const createGame = async (token, data) => {
    try {
      const response = await axios.post(
        url + `/dashboard/create-game/${token}`,
        data,
        { withCredentials: true }
      );
      console.log(response);
      showAlert2(true, response.data.status, response.data.msg);
      setIsLoading(false);
      createGameRef.current.reset();
    } catch (error) {
      console.log(error);
      error = error.response.data;
      showAlert2(true, error.status, error.msg);
      setIsLoading(false);
    }
  };

  // GET GAME
  const getGame = async () => {
    setIsLoading(true);
    try {
      const response = await axios(
        url + `/playgame/${isAuthenticated.cookie}/${gameDetails.gameId}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setGameDetails((details) => {
        details = {
          ...details,
          game: response.data.game,
          answer: response.data.answer,
          gameId: response.data.gameId,
        };
        console.log(details);
        return details;
      });
      setIsLoading(false);
      // console.log(gameDetails);
    } catch (error) {
      console.log(error);
      error = error.response.data;
      showModal(true, error.msg, error.status, error.erroyType);
      setIsLoading(false);
    }
  };
  return (
    <AppContext.Provider
      value={{
        toggle,
        setToggle,
        showSideBar,
        hideSideBar,
        isPasswordShown,
        handlePassword,
        handleRePassword,
        userInputs,
        handleSignUpChange,
        handleSignUpSubmit,
        isLoading,
        setIsLoading,
        alert,
        alert2,
        showAlert,
        ageRef,
        repasswordRef,
        showAlert2,
        verifyPage,
        setVerifyPage,
        userDetails,
        resendVerficationEmail,
        getUser,
        // gettingUser,
        setUserDetails,
        resetForm,
        handleSignInChange,
        signInDetails,
        handleSignInSubmit,
        handleForgotPasswordSubmit,
        handleForgotPasswordOnChange,
        setSignInPassword,
        isSignInPassword,
        resetPassword,
        handleResetPasswordSubmit,
        handleResetPasswordOnChange,
        setResetPasswordToken,
        isResetPasswordShown,
        handleNewPasswordToggle,
        handleConfirmPasswordToggle,
        updatePasswordDetails,
        isForgotPasswordNav,
        forgotPasswordEmailRef,
        isResetPasswordNav,
        handleTermsAndConditionShow,
        handleTermsAndConditionHide,
        termsAndConRef,
        handleCheckboxOnChange,
        setUserInputs,
        loginNav,
        setLoginNav,
        isDashboardActive,
        setDashboardActive,
        signOut,
        loginToken,
        handleDifficulty,
        image,
        setImage,
        difficulty,
        isAuthenticated,
        gameDetails,
        handleCreateGameSubmit,
        getGame,
        showModal,
        modal,
        checkboxRef,
        createGameRef,
        isTermsActive,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, useGlobalContext };
