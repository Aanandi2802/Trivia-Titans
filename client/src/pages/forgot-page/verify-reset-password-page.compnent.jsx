import React, { useState } from "react";
import "./forgot-page.styles.scss";
import { Link } from "react-router-dom";
import InputField from "../../components/input-field/input-field.component";
import Button from "../../components/button/button.component";
import { useNavigate } from "react-router-dom";
import path from "../../constants/paths";
import axios from "axios";
import { useLocation } from "react-router-dom";
import paths from "../paths";

export default function VerifyResetPasswordPage() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const email = useLocation();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const submitEvent = (event) => {
    console.log(email.state);
    event.preventDefault();
    if (inputs.pass === inputs.cpass) {
      try {
        axios({
          method: "post",
          url: paths.AWS_LAMBDA_FUNCTION + "/user/verifyReset", // replace this url with the cloud function url.
          data: {
            //email, verificationCode, newPassword this is all required to backend.
            email: email.state, //take this from previous page.
            verificationCode: inputs.verificationCode,
            newPassword: inputs.pass,
          },
          headers: {
            "Content-type": "application/json",
          },
        })
          .then((res) => {
            if (res.data.message === "Password reset successful") {
              alert("Password is succesfully updated");
              updateUserPassword();
              navigate(path.LOGIN);
            } else {
              alert("Email not found.");
              console.log(res.data.message);
            }
          })
          .catch((error) => {
            alert(error.response.data.message);
            console.log(error);
          });
        // navigate(path.LOGIN);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Password dose not match. Please enter same password.");
    }
  };

  const updateUserPassword = async () => {
    try {
      await axios({
        method: "post",
        url: paths.GCP_CLOUD_FUNCTION + "/update-user-password", // Cloud function
        data: {
          email: email.state,
          newPassword: inputs.pass,
        },
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.data.message === "Password updated successfully.") {
          } else {
            console.log(
              "Something is wrong in the updating the password in the firestore."
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

  return (
    <div className="app_forgot">
      <div className="forgot_div">
        <div className="forget_form">
          <form>
            <div className="forgot_tittle_div">Set new Password</div>

            <div className="input-con-login">
              <InputField
                type="password"
                name="pass"
                value={inputs.pass || ""}
                onChange={handleChange}
                required
                autoComplete="off"
                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$^&*()_-]).{8,18}$"
                title="Password should atlist 8 charecter with alpha (Capital & small)-numeric and special characters"
                label="Set new Password:"
              />
            </div>

            <div className="input-con-login">
              <InputField
                type="password"
                name="cpass"
                value={inputs.cpass || ""}
                onChange={handleChange}
                required
                autoComplete="off"
                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$^&*()_-]).{8,18}$"
                title="Password should atlist 8 charecter with alpha (Capital & small)-numeric and special characters"
                label="Confirm new Password:"
              />
            </div>

            <div className="input-con-login">
              <InputField
                type="text"
                name="verificationCode"
                value={inputs.verificationCode || ""}
                onChange={handleChange}
                required
                autoComplete="off"
                title=" Enter the Verification Code form your mail."
                label="Verification Code:"
              />
            </div>

            <div onClick={submitEvent}>
              <Button>Submit</Button>
            </div>
          </form>
          <br />
        </div>
      </div>
    </div>
  );
}
