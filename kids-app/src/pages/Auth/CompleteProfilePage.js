import React, { useEffect, useState, lazy } from "react";
import { useGlobalContext } from "../../utils/Context";
import Loading from "../../utils/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert2 } from "../../utils/Alert";

const url = "https://api-spelling-game.onrender.com/api/v1";
// const url = "http://localhost:3001/api/v1";

const CompleteProfilePage = () => {
  const {
    handleDifficulty,
    userDetails,
    loginToken,
    image,
    setIsLoading,
    isLoading,
    setImage,
    setLoginNav,
    isAuthenticated,
    alert2,
    showAlert2,
  } = useGlobalContext();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");
  const [difficulty, setDifficulty] = useState();

  // USE EFFECT TO GET USER
  useEffect(() => {
    getUser(
      isAuthenticated.userId || userDetails.userId,
      isAuthenticated.cookie || loginToken
    );
  }, []);

  // GET USER METHOD
  const getUser = async (userId, token) => {
    try {
      const response = await axios(
        url + `/dashboard/complete-profile/${userId}/${token}`,
        {
          withCredentials: true,
        }
      );

      setImageUrl(response.data.profilePic);
      setDifficulty(response.data.difficulty);
    } catch (error) {
      console.log(error);
    }
  };

  // COMPLETE PROFILE SUBMIT
  const handleCompleteProfileSubmit = async (event) => {
    event.preventDefault();

    completeProfile(
      userDetails.userId || isAuthenticated.userId,
      loginToken || isAuthenticated.cookie,
      event
    );
  };

  // COMPLETE PROFILE METHOD
  const completeProfile = async (userId, token, event) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        url + `/dashboard/complete-profile/${userId}/${token}`,
        { difficulty: event.target.elements.difficulty.value, imageUrl }
      );
      setIsLoading(false);

      setLoginNav((navs) => {
        navs.gotodashboard = true;
        return navs;
      });
      navigate(`/dashboard/${token}`);
      console.log(response);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // HANDLE SKIPPING PROFILE
  const handleSkip = async (event) => {
    event.preventDefault();

    skipProfileComplete(
      userDetails.userId || isAuthenticated.userId,
      loginToken || isAuthenticated.cookie
    );
  };

  // SKIP PROFILE PROFILE
  const skipProfileComplete = async (userId, token) => {
    setLoginNav((navs) => {
      navs.gotodashboard = true;
      return navs;
    });
    navigate(`../dashboard/${userId}`);
    await axios.patch(url + `/dashboard/complete-profile/${userId}/${token}`);
  };

  // UPLOAD IMAGE
  const uploadImage = async (userId, token, data) => {
    try {
      const response = await axios.post(
        url + `/dashboard/complete-profile/${userId}/${token}`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data boundary=------qttp0cNbWTsYJreJevWnSg43qdkpp1ZI",
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        const getImage = await axios(response.data.image);
        setImageUrl(response.data.image);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      error = error.response.data;
      // HANDLING  ERROR
      showAlert2(true, error.status, error.msg);

      setIsLoading(false);
    }
  };

  // HANDLE IMAGE
  const handleImage = (event) => {
    event.preventDefault();
    setImage(async (image) => {
      image = event.target.files[0];
      let formData = new FormData();
      formData.append("profilepic", image);

      setIsLoading(true);
      uploadImage(
        userDetails.userId || isAuthenticated.userId,
        loginToken || isAuthenticated.cookie,
        formData
      );
    });
  };

  return (
    <main className="complete-profile">
      <div className="complete-profile-header">
        <h2>Complete Your Profile </h2>
      </div>
      <div className="alert2-con">
        {alert2 && <Alert2 {...alert2} removeAlert={showAlert2} />}
      </div>
      <p>
        Please Complete your Profile and if this is skipped, it is set to
        default. It can be changed later if you want to
      </p>
      <div className="show-img">
        {isLoading ? (
          <Loading
            type={"spin"}
            height={"50px"}
            width={"50px"}
            color={"green"}
          />
        ) : (
          <img src={imageUrl} alt={"Profile-pic"} />
        )}
      </div>

      <form className="upload-img-form" onSubmit={handleCompleteProfileSubmit}>
        <div className="upload-img">
          <label htmlFor="uploading-img">Upload Profile Picture: </label>
          <input
            onChange={handleImage}
            type="file"
            name="profilepic"
            id="uploading-img"
            accept="image/*"
          />
        </div>

        <div className="select-difficulty">
          <label htmlFor="difficulty">Difficulty: </label>
          <select name="difficulty" id="difficulty" onChange={handleDifficulty}>
            <option defaultValue={true}>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div className="button-div">
          <button onClick={handleSkip}>Skip</button>

          {isLoading ? (
            <Loading
              type={"spin"}
              color={"grey"}
              height={"50px"}
              width={"50px"}
            />
          ) : (
            <input
              // onChange={(event) => {
              //   console.log(event);
              // }}
              type="submit"
              value="Complete Profile"
            />
          )}
        </div>
      </form>
    </main>
  );
};

export default CompleteProfilePage;
