import { Route, Switch } from "react-router-dom";
import "./App.css";

import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import DetailProduct from "./pages/DetailProduct";

import Login from "./pages/Login";
import register from "./pages/register";
import Verify from "./pages/verification";
import Cart from "./pages/CartPage"
import { useDispatch } from "react-redux";
import { keepLogin } from "./action";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import History from "./pages/History"
import Dashboard from "./pages/admin/Dashboard";

function App() {
  const dispatch = useDispatch()

  dispatch(keepLogin())
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/detail/:id" component={DetailProduct} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={register} />
        <Route path="/verification" component={Verify} />
        <Route path="/cart" component={Cart} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/history" component={History} />

        <Route path="/admin/dashboard" component={Dashboard} />
      </Switch>
    </>
  );
}

export default App;
