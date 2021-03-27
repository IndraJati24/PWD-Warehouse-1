import React, { useEffect, useState } from "react";
import {
  Container,
  Jumbotron,
  Form,
  Button,
  InputGroup,
  Alert,
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
// import axios from "axios";
import { Helmet } from 'react-helmet-async'
import { login } from '../action'

const defaultData = {
  username: "",
  password: "",
};

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch()
  let { isLoading, logError } = useSelector((state) => state.user);

  const [openPass, setOpenPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    if (!!logError.length) setErrorMessage(logError)
    else setErrorMessage('')

  }, [logError])

  const isOpen = () => (openPass ? "fas fa-eye" : "fas fa-eye-slash");

  const onChangeData = (e) => {
    const key = e.target.attributes.name.value;
    const value = e.target.value;
    setData((prevData) => ({ ...prevData, [key]: value }));
  };

  const onSubmitForm = (e) => {
    e.preventDefault();

    dispatch(login(data, history));
    // login();
    // axios
    //   .post("http://localhost:1000/login", data)
    //   .then((res) => {
    //     setData(defaultData);
    //     history.push("/");
    //   })
    //   .catch((err) => {
    //     console.error(err.response, "error");
    //     setErrorMessage(err.response.data);
    //   });
  };

  return (
    <Jumbotron style={styles.jumbotron}>
      <Helmet>
        <title>Login | Warehouse</title>
      </Helmet>
      <Container className="text-center px-5">
        <h1>Login</h1>
        <Form style={styles.form} onSubmit={onSubmitForm}>
          {errorMessage && (
            <Alert
              variant="danger"
              onClose={() => {
                // setErrorMessage("")
                dispatch({ type: 'CLEAR_ERROR' })
              }}
              dismissible
            >
              {errorMessage}
            </Alert>
          )}
          <Form.Group className="text-left">
            <Form.Label>Username</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <i className="fas fa-user"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                name="username"
                type="text"
                placeholder="Enter username..."
                defaultValue={data.username}
                onChange={onChangeData}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="text-left">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <i
                    className={isOpen()}
                    style={styles.password}
                    onClick={() => setOpenPass(!openPass)}
                  />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                name="password"
                defaultValue={data.password}
                onChange={onChangeData}
                type={openPass ? "text" : "password"}
                placeholder="Password"
              />
            </InputGroup>
            <Form.Text className="text-right">
              <Link to={{ pathname: "/forgot-password" }}>forgot password?</Link>
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit">
            {isLoading ? 'Loading...' : 'Submit'}
          </Button>
          <Form.Text>
            Don't Have Account Yet? Register{" "}
            <Link to={{ pathname: "/register" }}>here</Link>
          </Form.Text>
        </Form>
      </Container>
    </Jumbotron>
  );
};

const styles = {
  jumbotron: { marginTop: 100, marginLeft: 50, marginRight: 50 },
  form: {
    width: "100%",
    maxWidth: 330,
    padding: 15,
    margin: "auto",
  },
  password: {
    cursor: "pointer",
  },
};

export default Login;
