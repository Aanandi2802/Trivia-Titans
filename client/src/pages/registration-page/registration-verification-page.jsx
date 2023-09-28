import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registration-page.styles.scss";
import { Link } from "react-router-dom";
import Button from "../../components/button/button.component";
import InputField from "../../components/input-field/input-field.component";
import path from "../../constants/paths";
import axios from "axios";
import { useSelector } from "react-redux";
import paths from "../paths";

export default function RegistrationVerificationPage() {
  const navigate = useNavigate();
  let loginEmail = useSelector((state) => state.loginStatus.userEmail);

  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("------------------------");
    console.log(loginEmail);
    console.log(inputs.verificationCode);
    try {
      await axios({
        method: "post",
        url: paths.AWS_LAMBDA_FUNCTION + "/user/verifyAccount", // replace url with the serverless AWS......
        data: {
          userId: loginEmail,
          verificationCode: inputs.verificationCode,
        },
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "verification successful") {
            addSubscription();
            navigate(path.SET_Q_AND_A);
          } else if (res.data.message === "verification failed") {
            alert("please enter valid code.");
          } else {
            alert("something is wrong in the verification code of new user.");
            console.log(res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      // navigate(path.SET_Q_AND_A);
    } catch (error) {
      console.log(error);
    }
  };

  const addSubscription = async () => {
    try {
      await axios({
        method: "post",
        url: "https://bn0jp8p9j3.execute-api.us-east-1.amazonaws.com/Dev/sendmail", // This will handle the email subscription.
        data: {
          email: loginEmail,
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
    <>
      <div className="app_registration">
        <div className="registration_div">
          <div className="form">
            <div className="reg_tile">Verification</div>
            <form onSubmit={handleSubmit}>
              <div className="regis-input-con">
                <InputField
                  type="text"
                  name="verificationCode"
                  value={inputs.verificationCode || ""}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  title="Enter the Verification Code form your mail."
                  label="Verification Code : "
                />
              </div>
              <div className="button_con_regi">
                <Button type="submit">Submit</Button>
              </div>
              <br />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
