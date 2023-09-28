import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registration-page.styles.scss";
import Button from "../../components/button/button.component";
import InputField from "../../components/input-field/input-field.component";
import path from "../../constants/paths";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { submitted } from "../../redux/isLogin.reducers";
import paths from "../paths";

export default function SET_Q_AND_A() {
  const navigate = useNavigate();
  const loginEmail = useSelector((state) => state.loginStatus.userEmail);
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({});

  const questions = [
    "What is your favorite color?",
    "What is your favorite food?",
    "What is your favorite hobby?",
  ];

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios({
        method: "post",
        url: paths.GCP_CLOUD_FUNCTION + "/store-user-response", // replace with the cloud funtion url.
        data: {
          q1: inputs.q1,
          q2: inputs.q2,
          q3: inputs.q3,
          userID: loginEmail,
        },
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.data.message === "User response added") {
            // dispatch(submitted());
            alert("User is created succsefully...");
            navigate(path.LOGIN);
          } else {
            alert("user response is not added");
          }
        })
        .catch((error) => {
          console.log(error);
        });
      // dispatch(submitted());
      // navigate(path.HOME);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="app_registration">
        <div className="registration_div">
          <div className="form">
            <div className="reg_tile">Set Answer</div>
            <form onSubmit={handleSubmit}>
              <div className="regis-input-con">
                <InputField
                  type="text"
                  name="q1"
                  value={inputs.q1 || ""}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  title="Enter the answer for question 1."
                  label={questions[0]} // this will change with the question 1.
                />
              </div>

              <div className="regis-input-con">
                <InputField
                  type="text"
                  name="q2"
                  value={inputs.q2 || ""}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  title="Enter the answer for question 2."
                  label={questions[1]} // this will change with the question 2.
                />
              </div>

              <div className="regis-input-con">
                <InputField
                  type="text"
                  name="q3"
                  value={inputs.q3 || ""}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  title="Enter the answer for question 3."
                  label={questions[2]} // this will change with the question 3.
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
