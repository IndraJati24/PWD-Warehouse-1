import { Route, Switch } from "react-router-dom";
import "./App.css";

import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import DetailProduct from "./pages/DetailProduct";

import Login from "./pages/Login";
import register from "./pages/register";
import Verify from "./pages/verification";
import Cart from "./pages/CartPage"

function App() {

  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" exact component={Home} exact />
        <Route path="/detail/:id" component={DetailProduct} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={register} />
        <Route path="/verification" component={Verify} />
        <Route path="/cart" component={Cart} />
      </Switch>
    </>
  );
}

export default App;
