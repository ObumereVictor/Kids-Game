import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../utils/Context";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Alert2, Alert1 } from "../../utils/Alert";
import Loading from "../../utils/Loading";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    setResetPasswordToken,
    handleResetPasswordSubmit,
    handleResetPasswordOnChange,
    updatePasswordDetails,
    handleNewPasswordToggle,
    handleConfirmPasswordToggle,
    isResetPasswordShown,
    alert2,
    showAlert2,
    isLoading,
    alert,
    showAlert,
    isForgotPasswordNav,
    isResetPasswordNav,
  } = useGlobalContext();

  // USEEFFECT TO SET RESET PASSWORD TOKEN
  useEffect(() => {
    setResetPasswordToken(token);
  }, []);

  // USEEFFECT FO EXPIRED LINK NAVIGATION
  useEffect(() => {
    if (isForgotPasswordNav) {
      setInterval(() => {
        navigate("../../forgot-password");
      }, 3000);
    }
  }, [isForgotPasswordNav]);

  // USEEFFECT TO LOGIN AFTER PASSWORD RESET
  useEffect(() => {
    if (isResetPasswordNav) {
      setInterval(() => {
        navigate("../../sign-in");
      }, 3000);
    }
  }, [isResetPasswordNav]);

  return (
    <section className="reset-password">
      <h2>Reset Password</h2>
      {alert2 && <Alert2 {...alert2} removeAlert={showAlert2} />}

      <form
        className="reset-password-form"
        onSubmit={handleResetPasswordSubmit}
      >
        <div className="reset-password-input">
          <label htmlFor="newpassword">New Password: </label>

          <span className="reset-password-ele">
            <input
              type={`${isResetPasswordShown.newpassword ? "text" : "password"}`}
              autoComplete="off"
              id="newpassword"
              name="newPassword"
              onChange={handleResetPasswordOnChange}
              value={updatePasswordDetails.newPassword}
            />
            <span className="toggle-pass-btn" onClick={handleNewPasswordToggle}>
              {isResetPasswordShown.newpassword ? (
                <FaEyeSlash className="hide" />
              ) : (
                <FaEye className="show" />
              )}
            </span>
          </span>
        </div>
        <div className="reset-password-input">
          <label htmlFor="confirmpassword">Confirm Password: </label>
          <span className="reset-password-ele">
            <input
              type={`${
                isResetPasswordShown.confirmpassword ? "text" : "password"
              }`}
              autoComplete="off"
              id="confirmpassword"
              name="confirmPassword"
              onChange={handleResetPasswordOnChange}
              value={updatePasswordDetails.confirmPassword}
            />
            <span
              className="toggle-pass-btn "
              onClick={handleConfirmPasswordToggle}
            >
              {isResetPasswordShown.confirmpassword ? (
                <FaEyeSlash className="hide" />
              ) : (
                <FaEye className="show" />
              )}
            </span>
          </span>
        </div>

        {isLoading ? (
          <Loading
            type={"spin"}
            color={"red"}
            width={"50px"}
            height={"50px"}
            className={"loading"}
          />
        ) : (
          <input type="submit" value="Reset Password" />
        )}
      </form>
      {alert.show && (
        <div className="alert-container">
          <Alert1 {...alert} className="alert" removeAlert={showAlert} />
        </div>
      )}
    </section>
  );
};

export default ResetPasswordPage;
