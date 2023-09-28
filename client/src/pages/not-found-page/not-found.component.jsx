import React from "react";
import { useSelector } from "react-redux";
import path from "../../constants/paths";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function NotFoundPage() {
  const loginStatus = useSelector((state) => state.loginStatus.status);
  const navigate = useNavigate();
  console.log(loginStatus);

  useEffect(() => {
    {
      loginStatus ? navigate(path.HOME) : navigate(path.LOGIN);
    }
  }, [navigate, loginStatus]);

  return <></>;
}
