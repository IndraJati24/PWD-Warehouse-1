import { Route, Switch } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";

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
      <Route path="/login" component={Login} />
      <Route path="/" exact component={Home} />
    </Switch>
  );
}

export default App;
