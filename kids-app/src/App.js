// import Root from "./pages/Root";
import { AppProvider } from "./utils/Context";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  SignInPage,
  SignUpPage,
  VerifyPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  CompleteProfilePage,
} from "./pages/Auth";
import {
  HomePage,
  NotFoundPage,
  DashboardPage,
  EditProfile,
  DashboardRoot,
  CreateGame,
  PlayGame,
  Root,
} from "./pages";
import {
  SignUpVerifyProtectedRoute,
  SignInVerifyProtectedRoute,
  SignInCompleteProfileProtectedRoute,
  SignInProtectedRoute,
  CreateGameProtectedRoute,
  EditProfileProtectRoute,
  GameProtectedRoute,
} from "./pages/Routes/ProtectedRoute";
import { useGlobalContext } from "./utils/Context";

const App = () => {
  const {
    verifyPage,
    userDetails,
    loginNav,
    gameDetails,
    loginToken,
    isAuthenticated,
  } = useGlobalContext();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<HomePage />} />
          <Route path="sign-in" element={<SignInPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route
            path="register/verify/:id"
            element={
              <SignUpVerifyProtectedRoute verifyPage={verifyPage}>
                <VerifyPage />
              </SignUpVerifyProtectedRoute>
            }
          />
          <Route
            path="verify/:id"
            loginNav={loginNav.gotoverifypage}
            element={
              <SignInVerifyProtectedRoute>
                <VerifyPage />
              </SignInVerifyProtectedRoute>
            }
          />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        </Route>
        <Route
          path="dashboard/complete-profile/:userId/:token"
          element={
            <SignInCompleteProfileProtectedRoute
              loginNav={loginNav.gotocompleteprofile}
            >
              <CompleteProfilePage />
            </SignInCompleteProfileProtectedRoute>
          }
        />

        <Route
          path="/dashboard/:token"
          element={
            <SignInProtectedRoute loginNav={loginNav.gotodashboard}>
              <DashboardRoot />
            </SignInProtectedRoute>
          }
        >
          <Route path="/dashboard/:token" index element={<DashboardPage />} />
        </Route>
        <Route
          path="/dashboard/create-game/:token"
          element={
            <CreateGameProtectedRoute role={gameDetails.role}>
              <CreateGame />
            </CreateGameProtectedRoute>
          }
        />
        <Route
          path="/playgame/:token/:gameId"
          element={
            <GameProtectedRoute
              token={loginToken}
              cookie={isAuthenticated.cookie}
              gameId={gameDetails.gameId}
            >
              <PlayGame />
            </GameProtectedRoute>
          }
        />
        <Route
          path="/dashboard/edit-profile/:token"
          element={
            <EditProfileProtectRoute
              token={loginToken}
              cookie={isAuthenticated.cookie}
            >
              <EditProfile />
            </EditProfileProtectRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
