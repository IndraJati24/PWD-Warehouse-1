import { Route, Switch } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import register from "./pages/register";
import Verify from "./pages/verification";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

function App() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={register} />
      <Route path="/verification" component={Verify} />
    </Switch>
  );
}

export default App;
