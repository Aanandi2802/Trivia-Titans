import React, { useState, useEffect } from "react";

import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

const BootstrapToast = ({ variant, title, body, handleRemove }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <Toast
      delay={3000}
      show={show}
      onClose={() => {
        handleRemove();
        setShow(false);
      }}
      autohide
      bg={variant.toLowerCase()}
      key={variant}
    >
      <Toast.Header closeButton={false}>
        <strong className="me-auto">{title}</strong>
        <small className="text-muted">just now</small>
      </Toast.Header>
      <Toast.Body>{body}</Toast.Body>
    </Toast>
  );
};

export default BootstrapToast;
