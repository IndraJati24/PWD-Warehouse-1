import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async'

import allReducer from "./reducer";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const globalState = createStore(allReducer, applyMiddleware(thunk));

globalState.subscribe(() =>
  console.log("Global State: ", globalState.getState())
);

ReactDOM.render(
  <Provider store={globalState}>
    <Router>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Router>
  </Provider>,
  document.getElementById("root")
);
