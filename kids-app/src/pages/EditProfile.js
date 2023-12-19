import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../utils/Context";
import { Alert2, Alert1 } from "../utils/Alert";
import Loading from "../utils/Loading";
import { useNavigate } from "react-router-dom";
const url = "https://api-spelling-game.onrender.com/api/v1";
// const url = "http://localhost:3001/api/v1";

const EditProfile = () => {
  const {
    isAuthenticated,
    loginToken,
    setIsLoading,
    isLoading,
    alert2,
    showAlert2,
    alert,
    showAlert,
  } = useGlobalContext();
  const [updateCompleted, setUpdateCompleted] = useState(false);

  useEffect(() => {
    showAlert(false, "", "");
    showAlert2(false, "", "");
    setIsLoading(false);
    if (updateCompleted && isAuthenticated.user) {
      navigate(`/dashboard/${isAuthenticated.cookie}`);
    }
    if (updateCompleted && loginToken) {
      navigate(`/dashboard/${loginToken}`);
    }
  }, [updateCompleted]);
  const navigate = useNavigate();
  //    HANDLE EDITING PROFILE SUBMIT
  const handleEditProfileSubmit = async (event) => {
    event.preventDefault();
    let formData = new FormData();

    const difficulty = event.target.elements.difficulty.value;
    const image = event.target.elements.profilePic.files[0];
    // const username = event.target.elements.username.value;

    formData.append("profilepic", image);
    formData.append("difficulty", difficulty);
    // formData.append("username", username);
    // console.log({ image, difficulty, username });
    setIsLoading(true);
    if (isAuthenticated.user) {
      postEditProfile(isAuthenticated.cookie, formData);
    }
    if (loginToken) {
      postEditProfile(loginToken, formData);
    }
  };

  // POSTING DATA TO SERVER FOR EDITING PROFILE
  const postEditProfile = async (token, data) => {
    try {
      const response = await axios.post(
        url + `/dashboard/edit-profile/${token}`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type":
              "multipart/form-data boundary=-----some-random-characters",
          },
        }
      );
      //   setIsLoading(true);
      console.log(response);
      if (response.status === 200) {
        showAlert(true, response.data.status, response.data.msg);
        setInterval(() => {
          setUpdateCompleted(true);
        }, 3000);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      error = error.response.data;

      showAlert2(true, error.status, error.msg);
      setIsLoading(false);
    }
  };

  // HANDLE CANCELING EDIT PROFILE
  const handleCancelEdit = async (event) => {
    event.preventDefault();
    if (isAuthenticated.user) {
      navigate(`/dashboard/${isAuthenticated.cookie}`);
    }
    if (loginToken) {
      navigate(`/dashboard/${loginToken}`);
    }
  };

  return isLoading ? (
    <main className="fetch-loading">
      <Loading type={"spin"} height={"100px"} width={"100px"} color={"green"} />
    </main>
  ) : (
    <main className="edit-profile-page">
      <h2>Edit Profile</h2>
      <div className="alert2-con">
        {alert2 && (
          <Alert2 {...alert2} className="alert2" removeAlert={showAlert2} />
        )}
      </div>
      <form onSubmit={handleEditProfileSubmit}>
        {/* <div className="editprofile-input-div">
          <label htmlFor="username">Username: </label>
          <input type="text" id="username" name="username" />
        </div> */}
        <div className="editprofile-input-div">
          <label htmlFor="difficulty">Difficulty:</label>
          <select name="difficulty" id="difficulty">
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div className="editprofile-input-div">
          <label htmlFor="profilePic">Profile Picture:</label>
          <input
            type="file"
            id="profilePic"
            accept="image/*"
            name="profilepic"
          />
        </div>
        <div className="edit-btn">
          <button onClick={handleCancelEdit}>Cancel</button>
          <input type="submit" value="Update Profile" />
        </div>
      </form>
      {alert.show && (
        <div className="alert-container">
          <Alert1 {...alert} className="alert" removeAlert={showAlert} />
        </div>
      )}
    </main>
  );
};

export default EditProfile;
