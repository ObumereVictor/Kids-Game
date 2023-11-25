import React, { useEffect } from "react";
import { useGlobalContext } from "../../utils/Context";
import { Alert2, Alert1 } from "../../utils/Alert";
import { Navigate, useNavigate } from "react-router-dom";
const VerifyPage = () => {
  const {
    userDetails,
    resendVerficationEmail,
    alert2,
    showAlert2,
    getUser,
    setVerifyPage,
    verifyPage,
    setUserInputs,
    loginToken,
    setLoginNav,
  } = useGlobalContext();

  // USEEFFECT TO GET USER
  useEffect(() => {
    getUser();
  });

  // USEEFFECT TO NAVIGATE TO COMPLETE USER PROFILE
  useEffect(() => {
    if (loginToken && userDetails.verified) {
      setLoginNav((navs) => {
        navs.gotocompleteprofile = true;
        return navs;
      });
      navigate(
        `../dashboard/complete-profile/${userDetails.userId}/${loginToken}`
      );
    }
  });

  const navigate = useNavigate();

  return (
    <main className="verifyPage">
      <h2>Confirm your email address</h2>
      <p>Check {userDetails.email} for the verification link sent to you </p>
      <p>If you don't find the email in inbox, Check your spam folder.</p>

      <span>
        Didn't get the link?{"  "}
        <span className="resendLink" onClick={resendVerficationEmail}>
          Resend Verification Link
        </span>
      </span>

      {userDetails.verified && (
        <Navigate to="../../../sign-in" replace="true" />
      )}
      {verifyPage && (
        <button
          className="edit-details"
          onClick={() => {
            navigate("../../../sign-up");
            setVerifyPage(false);
            setUserInputs((values) => {
              values.readterms = false;
              return values;
            });
          }}
        >
          Edit Details
        </button>
      )}

      {alert2.show && (
        <Alert2
          {...alert2}
          style={{
            color: "#fff",
            backgroundColor: "grey",
            position: "fixed",
            bottom: "20px",
            padding: "7px 15px",
          }}
          removeAlert={showAlert2}
        />
      )}
    </main>
  );
};

export default VerifyPage;
