import React from "react";
import {
  Container,
  Jumbotron,
  Form,
  Button,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { connect } from "react-redux";
import { register } from "../action";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      openPass: false,
    };
  }
  isOpen = () =>
    this.state.openPass ? "fas fa-eye fa-sm" : "fas fa-eye-slash fa-xs";

  submit = async () => {
    let username = this.refs.username.value;
    let password = this.refs.password.value;
    let email = this.refs.email.value;

    let data = { username, password, email };

    await this.props.register(data);

    if (this.props.errMsg.length !== 0) return this.setState({ show: true });

    this.refs.username.value = "";
    this.refs.password.value = "";
    this.refs.email.value = "";

    alert("Register success please check your email");
  };

  render() {
    return (
      <Jumbotron style={styles.jumbotron}>
        <Container className="text-center px-5">
          <h1 style={{ textAlign: "center" }}>Register</h1>
          <Form style={styles.form}>
            <Form.Group className="text-left">
              <Form.Label>Username</Form.Label>
              <InputGroup style={{ display: "flex", margin: "10px 0" }}>
                <InputGroup.Prepend style={{ width: 50 }}>
                  <InputGroup.Text>
                    <i className="fas fa-user"></i>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="text"
                  placeholder="Enter username..."
                  ref="username"
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="text-left">
              <Form.Label>Password</Form.Label>
              <InputGroup style={{ display: "flex", margin: "10px 0" }}>
                <InputGroup.Prepend style={{ width: 50 }}>
                  <InputGroup.Text>
                    <i
                      className={this.isOpen()}
                      style={styles.password}
                      onClick={() =>
                        this.setState({ openPass: !this.state.openPass })
                      }
                    />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type={this.state.openPass ? "text" : "password"}
                  placeholder="Enter password..."
                  ref="password"
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="text-left">
              <Form.Label>Email</Form.Label>
              <InputGroup style={{ display: "flex", margin: "10px 0" }}>
                <InputGroup.Prepend style={{ width: 50 }}>
                  <InputGroup.Text>
                    <i className="fas fa-envelope"></i>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="text"
                  placeholder="Enter email..."
                  ref="email"
                />
              </InputGroup>
            </Form.Group>
          </Form>
          <Button
            onClick={this.submit}
            variant="primary"
            type="submit"
            style={{ textAlign: "center" }}
            disabled={this.props.isLoading}
          >
            {this.props.isLoading === true ? "Loading..." : "Register"}
          </Button>
        </Container>
        <Modal show={this.state.show}>
          <Modal.Header closeButton>
            <Modal.Title>Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.props.errMsg.map((item, index) => {
              return (
                <p key={index} style={{ fontSize: 15 }}>
                  {item}
                </p>
              );
            })}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ show: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Jumbotron>
    );
  }
}

const styles = {
  jumbotron: { marginTop: 10, marginLeft: 50, marginRight: 50 },
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

const mapStateToProps = (state) => {
  return {
    isLoading: state.user.isLoading,
    errMsg: state.user.logError,
  };
};
export default connect(mapStateToProps, { register })(Register);
