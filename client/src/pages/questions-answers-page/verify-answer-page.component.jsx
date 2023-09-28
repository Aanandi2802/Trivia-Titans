import React, { useState, useEffect, useContext } from "react";
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
import SocketContext from "../../components/sockets/SocketContext";

export default function VerifyAnswerPage() {
  const navigate = useNavigate();
  const loginEmail = useSelector((state) => state.loginStatus.userEmail);
  console.log(loginEmail);
  const user = useSelector((state) => state.loginStatus.userInfo);
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({});
  const [question, setQuestion] = useState("");

  const socket = useContext(SocketContext);

  useEffect(() => {
    const questions = [
      { questionId: "q1", text: "What is your favorite color?" },
      { questionId: "q2", text: "What is your favorite food?" },
      { questionId: "q3", text: "What is your favorite hobby?" },
    ];
    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomQuestion = questions[randomIndex];
    setQuestion(randomQuestion);
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = loginEmail;
    const selectedQuestionId = question.questionId; // Extracting the selected question's ID
    try {
      await axios({
        method: "post",
        url: paths.GCP_CLOUD_FUNCTION + "/validate-answer",
        data: {
          email,
          questionId: selectedQuestionId, // Sending the selected question's ID to the backend
          answer: inputs.answer,
        },
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.data.message === "Validation successful") {
            dispatch(submitted());
            //setSocketConn
            socket.send(
              JSON.stringify({
                action: "loginData",
                userId: user.firstName,
              })
            );
            navigate(path.HOME);
            alert("User is successfully logged in");
          } else {
            alert("Validation not successful!!!!!!!");
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
    <>
      <div className="app_registration">
        <div className="registration_div">
          <div className="form">
            <div className="reg_tile">Verification Question</div>
            <form onSubmit={handleSubmit}>
              <div className="regis-input-con">
                <InputField
                  type="text"
                  name="answer"
                  value={inputs.answer || ""}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  title={`Enter the answer for: ${question.text}`} // Using the question text as the title
                  label={question.text}
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
