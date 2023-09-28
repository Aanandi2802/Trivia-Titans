import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registration-page.styles.scss";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  submitted,
  setLoginUser,
  setLoginEmail,
} from "../../redux/isLogin.reducers";
import path from "../../constants/paths";
import InputField from "../../components/input-field/input-field.component";
import Button from "../../components/button/button.component";
import axios from "axios";
import paths from "../paths";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputs.pass === inputs.cpass) {
      const createAccount = async () => {
        try {
          await axios({
            method: "post",
            url: paths.AWS_LAMBDA_FUNCTION + "/user/createAccount", // replace url with the serverless url...
            data: {
              email: inputs.email,
              password: inputs.pass,
            },
            headers: {
              "Content-type": "application/json",
            },
          })
            .then((res) => {
              console.log(res.data);

              if (res.data.message === "user created succesfully.") {
                saveUserData();
                dispatch(setLoginUser(inputs));
                dispatch(setLoginEmail(inputs.email));
                navigate(path.VERIFYREGISTRATION);
              } else {
                alert("something is wrong in the response of the backend");
                console.log(res.data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
          // navigate(path.VERIFYREGISTRATION);
        } catch (error) {
          console.log(error);
        }
        alert("passwords are match.");
      };

      createAccount();

      const saveUserData = async () => {
        try {
          await axios({
            method: "post",
            url: paths.GCP_CLOUD_FUNCTION + "/store-user-data", // replace url with the cloud function.
            data: {
              email: inputs.email,
              password: inputs.pass,
              firstName: inputs.fname,
              lastName: inputs.lname,
              age: inputs.age,
            },
            headers: {
              "Content-type": "application/json",
            },
          })
            .then((res) => {
              if (res.data.message === "New User Data added.") {
              } else {
                alert("something is wrong in the new user data.");
                console.log(res.data);
              }
            })
            .catch((error) => {
              console.log(error);
            });
          // navigate(path.VERIFYREGISTRATION);
        } catch (error) {
          console.log(error);
        }
      };
    }
    // password does not match in both boxes (password and confirm password).
    else {
      alert("Passwords do not match. Please try again.");
    }
  };

  return (
    <>
      <div className="app_registration">
        <div className="registration_div">
          <div className="form">
            <div className="reg_tile">
              <span style={{ color: "#1091e1" }}>Create</span> Account
            </div>
            <form onSubmit={handleSubmit}>
              <div className="regis-input-con">
                <InputField
                  type="text"
                  name="fname"
                  value={inputs.fname || ""}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  pattern="^[A-Za-z ]{1,25}$"
                  title="Only contain upto 25 letters"
                  label="Name:"
                />
              </div>

              <div className="regis-input-con">
                <InputField
                  type="text"
                  name="lname"
                  value={inputs.lname || ""}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  pattern="^[A-Za-z ]{1,25}$"
                  title="Only contain upto 25 letters"
                  label="Last Name"
                />
              </div>

              <div className="regis-input-con">
                <InputField
                  type="text"
                  name="age"
                  value={inputs.age || ""}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  pattern="^(?:[1-9][0-9]?|1[01][0-9]|160)$"
                  title="Enter valide numeric value."
                  label="Age"
                />
              </div>

              <div className="regis-input-con">
                <InputField
                  type="email"
                  name="email"
                  pattern="^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$"
                  value={inputs.email || ""}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  title="Enter valid email ID"
                  label="Email ID:"
                />
              </div>

              <div className="regis-input-con">
                <InputField
                  type="password"
                  name="pass"
                  value={inputs.pass || ""}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$^&*()_-]).{8,18}$"
                  title="Password should atlist 8 charecter with alpha (Capital & small)-numeric and special characters"
                  label="Password:"
                />
              </div>

              <div className="regis-input-con">
                <InputField
                  type="password"
                  name="cpass"
                  value={inputs.cpass || ""}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  label="Confirm Password:"
                />
              </div>

              <div className="button_con_regi">
                <Button type="submit">Submit</Button>
              </div>
              <br />
              <div className="sign-up-option">
                <h4>
                  Already have account?{" "}
                  <Link
                    style={{ color: "#1091e1", fontWeight: "bold" }}
                    to={path.LOGIN}
                  >
                    Sign In
                  </Link>
                </h4>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
