import React from "react";
import "./login-page.styles.scss";
import { useDispatch } from "react-redux";
import {
  setLoginEmail,
  setLoginUser,
  submitted,
  setAdmin,
} from "../../redux/isLogin.reducers";
import path from "../../constants/paths";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/button.component";
import { Link } from "react-router-dom";
import InputField from "../../components/input-field/input-field.component";
import axios from "axios";
import paths from "../paths";
import { LoginSocialGoogle, LoginSocialFacebook } from "reactjs-social-login";
import {
  GoogleLoginButton,
  FacebookLoginButton,
} from "react-social-login-buttons";
// import { Auth } from "aws-amplify";
// import { async } from "@firebase/util";
import { async } from "@firebase/util";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitEvent = async (event) => {
    event.preventDefault();
    var { uname, pass } = document.forms[0];
    var emailNotFound = true; // this is checking if the email is exit or not.

    try {
      await axios({
        method: "post",
        url: paths.AWS_LAMBDA_FUNCTION + "/user/login", // replace this with the aws url
        data: {
          email: uname.value,
          password: pass.value,
        },
        headers: {
          "Content-type": "application/json",
        },
      })
        .then(async (res) => {
          if (res.data.message === "Login successful.") {
            emailNotFound = false;
            localStorage.setItem("accessToken", res.data.token.accessToken);
            console.log(res.data.token);
            localStorage.setItem("loginEmail", res.data.email);
            // dispatch(setLoginEmail(res.data.email));
            getUserDataByEmail();
            // navigate(path.VERIFY_Q_AND_A); // Navigate to the question verification page.
          }
        })
        .catch((error) => {
          console.log(error);
        });
      // navigate(path.VERIFY_Q_AND_A);
    } catch (error) {
      console.log(error);
    }
    if (emailNotFound) {
      alert("Please enter valid credentials.");
    }
  };

  const getUserDataByEmail = async () => {
    var { uname, pass } = document.forms[0];
    try {
      await axios({
        method: "post",
        url: paths.GCP_CLOUD_FUNCTION + "/get-user-data-by-email", // Cloud function
        data: {
          email: uname.value,
        },
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.data.message === "User found.") {
            localStorage.setItem("loginUserData", res.data.userData);
            console.log(res.data.userData, "-----------------");
            dispatch(setLoginUser(res.data.userData));
            if (res.data.userData.admin) {
              dispatch(submitted());
              dispatch(setAdmin());
              navigate(path.ADMIN);
            } else {
              dispatch(setLoginEmail(res.data.userData.email));
              navigate(path.VERIFY_Q_AND_A);
            }
          } else {
            console.log(
              "Something is wrong in the finding user data from firestore.."
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // google log in method ------------------------------------------------------
  const handleGoogleUserLogin = (response) => {
    console.log(response);
    window.localStorage.setItem("google_login_user_email", response.email);
    localStorage.setItem("loginEmail", response.email);
    dispatch(setLoginEmail(response.email));
    // method that directly login the user
    addUserDirect(
      response.email,
      response.given_name,
      response.family_name,
      "Gmail@123456"
    );
    saveUserData(
      response.email,
      response.given_name,
      response.family_name,
      "Gmail@123456"
    );
    addSubscription(response.email);
    dispatch(submitted());
    navigate(path.HOME);
    // navigate(path.GOOGLEREGISTRATION);
  };

  // facebook login method ------------------------------------------------------------
  const handleFacebookLogin = async (response) => {
    console.log(response);
    localStorage.setItem("loginEmail", response.email);
    dispatch(setLoginEmail(response.email));
    // method that directly login the user
    addUserDirect(
      response.email,
      response.given_name,
      response.family_name,
      "Facebbok@123456"
    );
    saveUserData(
      response.email,
      response.given_name,
      response.family_name,
      "Facebook@123456"
    );
    addSubscription(response.email);
    dispatch(submitted());
    navigate(path.HOME);
  };

  const addUserDirect = async (email, firstName, lastName, password) => {
    try {
      await axios({
        method: "post",
        url: paths.AWS_LAMBDA_FUNCTION + "/user/CreateAndVerifyAccount",
        data: {
          email: email,
          password: password,
        },
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.data.message === "user created and verified successfully.") {
          } else {
            // alert("something is wrong in the response of the backend");
            console.log(res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Save user Data into the firestore
  const saveUserData = async (email, firstName, lastName, password) => {
    try {
      await axios({
        method: "post",
        url: paths.GCP_CLOUD_FUNCTION + "/store-user-data", // replace url with the cloud function.
        data: {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          age: "",
        },
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.data.message === "New User Data added.") {
          } else {
            // alert("something is wrong in the new user data.");
            console.log(res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const addSubscription = async (email) => {
    try {
      await axios({
        method: "post",
        url: "https://bn0jp8p9j3.execute-api.us-east-1.amazonaws.com/Dev/sendmail", // This will handle the email subscription.
        data: {
          email: email,
        },
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {})
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="app_login">
      <div className="login_div">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="title_login_bid" style={{ fontSize: "25px" }}>
            <span style={{ color: "#1091e1" }}>Trivia</span> Titans
          </div>
          <div
            className="title_login"
            style={{
              fontSize: "30px",
            }}
          >
            <b>Login</b>
          </div>
        </div>

        <div className="form">
          <form onSubmit={submitEvent}>
            <div className="input-con-login">
              <InputField
                type="email"
                name="uname"
                required
                id="uname"
                label="Email ID :"
                pattern="^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$"
              />
            </div>
            <div className="input-con-login">
              <InputField
                type="password"
                name="pass"
                required
                id="pass"
                label="Password :"
              />
            </div>
            <div className="button_con_login">
              <Button
                type="submit"
                style={{
                  color: "1091e1",
                }}
              >
                Submit
              </Button>
            </div>
            <br />
            <h4 style={{ textAlign: "right" }}>
              <Link
                style={{
                  color: "#1091e1",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
                to={path.FORGOT}
              >
                forgot password?
              </Link>
            </h4>
            <br />
            <div className="sign-up-option">
              <h4
                style={{
                  fontSize: "18px",
                }}
              >
                Don't have an account?{" "}
                <Link
                  style={{
                    color: "#1091e1",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                  to={path.REGISTRATION}
                >
                  Create One
                </Link>
              </h4>
            </div>
            <br />
            <br />
            <div className="sign-up-option">
              <h4
                style={{
                  fontSize: "18px",
                  lineHeight: "0.8",
                  marginTop: "-2rem",
                  marginBottom: "-2rem",
                }}
              >
                OR
              </h4>
            </div>
            <br />
            <br />
            <LoginSocialGoogle
              client_id={
                "957635891214-60v3t8m1k061pm0g6nqmgcidgsqbevmm.apps.googleusercontent.com"
              }
              scope="openid profile email"
              discoveryDocs="claims_supported"
              access_type="offline"
              onResolve={({ provider, data }) => {
                handleGoogleUserLogin(data);
              }}
              onReject={(err) => {
                console.log(err);
              }}
            >
              <GoogleLoginButton className="google_login_btn" />
            </LoginSocialGoogle>
            <br />
            <br />
            <LoginSocialFacebook
              appId="673360167578041"
              onResolve={(response) => {
                handleFacebookLogin(response.data);
              }}
              onReject={(error) => {
                console.log(error);
              }}
            >
              <FacebookLoginButton className="facebook_login_btn" />
            </LoginSocialFacebook>

            <LoginSocialFacebook
              appId="673360167578041"
              onResolve={(response) => {
                handleFacebookLogin(response.data);
              }}
              onReject={(error) => {
                console.log(error);
              }}
            >
              {/* <img
                className="loginwithfacebook"
                src={require("../../assets/facebook.png")}
                alt="facebook"
              /> */}
            </LoginSocialFacebook>
          </form>
        </div>
      </div>
    </div>
  );
}
