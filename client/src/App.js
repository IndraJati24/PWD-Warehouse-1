import { Route, Switch } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";

import Login from "./pages/Login";
import register from "./pages/register";
import Verify from "./pages/verification";

function App() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={register} />
        <Route path="/verification" component={Verify} />
      </Switch>
    </>
  );
}

export default App;
