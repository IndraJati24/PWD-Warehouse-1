import React from "react";
import Register from "./pages/register";
import Verify from "./pages/verification";
import { Route, Switch } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";

function App() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" exact component={Home} />
        {/* <Route path="/login" component={Login} />
        <Route path="/register" component={Register} /> */}
        <Route path="/register" component={Register} />
				<Route path="/verification" component={Verify} />
      </Switch>
    </>
  );

export default App;