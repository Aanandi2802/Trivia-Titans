import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import path from "./constants/paths";
import Navigation from "./components/navigation/navigation.component";
import AdminNavbar from "./pages/admin/navbar";
import "./App.scss";
import { ModalProvider } from "styled-react-modal";
import { useSelector, useDispatch } from "react-redux";
import { submitted } from "./redux/isLogin.reducers";
import {
  HomePage,
  LoginPage,
  RegistrationPage,
  SetAnswersPage,
  VerifyAnswerPage,
  RegistrationVerificationPage,
  ForgotPage,
  VerifyResetPasswordPage,
  MyProfile,
  CompareScores,
  ProfileEdit,
  TeamAffiliations,
  UserStatistics,
  LeaderboardPage,
  NotificationsAlerts,
} from "./pages";

// import { Achievements } from "./pages/user-profile/Achievements";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NewGameForm from "./pages/admin/NewGameForm";
import LogoutPage from "./pages/admin/logout";
import UserManagementTable from "./pages/admin/UserManagementTable";
import TriviaQuiz from "./pages/inGame/TriviaQuiz";
import Chat from "./pages/inGame/chat";
import TeamHome from "./pages/teamhome-page/teamhome";
import CreateTeam from "./pages/createteam-page/createTeam";

function App() {
  const loginStatus = useSelector((state) => state.loginStatus.status);
  const adminStatus = useSelector((state) => state.loginStatus.admin);

  const dispatch = useDispatch();

  useEffect(() => {
    const loginEmail = localStorage.getItem("loginEmail");
    if (loginEmail) {
      dispatch(submitted());
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("loginEmail");
    }
  }, []);
  return (
    <>
      {loginStatus && !adminStatus ? (
        <ModalProvider>
          <div className="app">
            <div className="navigation__wrapper">
              <Navigation />
            </div>
            <div className="main-section iframeClass">
              <Routes>
                <Route path={path.HOME} exact element={<HomePage />} />

                <Route path={path.MYPROFILE} exact element={<MyProfile />} />
                <Route
                  path={path.USERSTASTICS}
                  exact
                  element={<UserStatistics />}
                />
                <Route
                  path={path.COMPARESCORES}
                  exact
                  element={<CompareScores />}
                />
                <Route
                  path={path.PROFILEEDIT}
                  exact
                  element={<ProfileEdit />}
                />
                <Route
                  path={path.TEAMAFFILIATIONS}
                  exact
                  element={<TeamAffiliations />}
                />
                <Route
                  path={path.NOTIFICATIONSALERTS}
                  exact
                  element={<NotificationsAlerts />}
                />
                {/* <Route path="/achievements" exact element={<Achievements />} /> */}

                <Route path="/profileedit" exact element={<ProfileEdit />} />

                <Route
                  path={path.LEADERBOARD}
                  exact
                  element={<LeaderboardPage />}
                />
                <Route path={path.TEAMHOME} exact element={<TeamHome />} />
                <Route path={path.CREATETEAM} exact element={<CreateTeam />} />
                <Route path="/trivia" exact element={<TriviaQuiz />} />
                <Route path="/chat" exact element={<Chat />} />
                {/* <Route path="/user" exact element={<UserManagementTable />} /> */}
                {/* <Route path="/form" exact element={<NewGameForm />} />
              <Route path="/user" exact element= {<UserManagementTable />} />
              <Route path="/logout" exact element={<LogoutPage />} />
                <Route path="/trivia" exact element={<TriviaQuiz />} />
                <Route path="/chat" exact element={<Chat />} /> */}
              </Routes>
            </div>
          </div>
        </ModalProvider>
      ) : loginStatus && adminStatus ? (
        <>
          <div className="main-section">
            <AdminNavbar></AdminNavbar>
            <Routes>
              <Route path={path.ADMIN} exact element={<AdminDashboard />} />
              <Route path="/form" exact element={<NewGameForm />} />
              <Route path="/user" exact element={<UserManagementTable />} />
              <Route path="/logout" exact element={<LogoutPage />} />
            </Routes>
          </div>
        </>
      ) : (
        <>
          <Routes>
            <Route path={path.LOGIN} exact element={<LoginPage />} />
            <Route path={path.REGISTRATION} element={<RegistrationPage />} />
            <Route
              path={path.VERIFY_Q_AND_A}
              exact
              element={<VerifyAnswerPage />}
            />
            <Route path={path.SET_Q_AND_A} exact element={<SetAnswersPage />} />
            <Route
              path={path.VERIFYREGISTRATION}
              exact
              element={<RegistrationVerificationPage />}
            />
            <Route path={path.FORGOT} exact element={<ForgotPage />} />
            <Route
              path={path.VERIFYFORGOT}
              exact
              element={<VerifyResetPasswordPage />}
            />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
