import React from "react";
const Alert1 = ({ status, msg, removeAlert, icon }) => {
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      removeAlert();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [removeAlert]);
  return (
    <div className={`alert ${status}`}>
      <h3>{status}</h3>
      <div>{icon}</div>
      <h5>{msg}</h5>
    </div>
  );
};

const Alert2 = ({ status, msg, removeAlert, style }) => {
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      removeAlert();
    }, 4000);
    return () => clearTimeout(timeout);
  }, [removeAlert]);
  return (
    <span style={style} className={`alert2 ${status}`}>
      {msg}
    </span>
  );
};

export { Alert1, Alert2 };
