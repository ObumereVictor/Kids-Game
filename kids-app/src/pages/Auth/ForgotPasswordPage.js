import { useGlobalContext } from "../../utils/Context";
import Loading from "../../utils/Loading";
import { Alert1, Alert2 } from "../../utils/Alert";

const ForgotPasswordPage = () => {
  const {
    handleForgotPasswordSubmit,
    handleForgotPasswordOnChange,
    isLoading,
    alert2,
    showAlert2,
    alert,
    showAlert,
    forgotPasswordEmailRef,
  } = useGlobalContext();
  return (
    <main className="forgot-password">
      <h2>Forgot Password</h2>
      <p>
        Enter the email address registered with your account to receive a link
        to reset your password
      </p>
      <form onSubmit={handleForgotPasswordSubmit} ref={forgotPasswordEmailRef}>
        {alert2 && <Alert2 {...alert2} removeAlert={showAlert2} />}
        <div>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            onChange={handleForgotPasswordOnChange}
          />
        </div>

        {isLoading ? (
          <Loading
            type={"spin"}
            height={"50px"}
            width={"50px"}
            color={"green"}
            className={"loading"}
          />
        ) : (
          <input type="submit" value="Reset Password" />
        )}
      </form>
      {alert.show && (
        <div className="alert-container">
          <Alert1 className="alert" {...alert} removeAlert={showAlert} />
        </div>
      )}
    </main>
  );
};

export default ForgotPasswordPage;
