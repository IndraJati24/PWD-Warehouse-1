import React from "react";
import { Route, Switch } from "react-router-dom";

import Register from "./pages/register";
import Verify from "./pages/verification";

function App() {
	return (
		<div>
			<Switch>
				<Route path="/register" component={Register} />
				<Route path="/verification" component={Verify} />
			</Switch>
		</div>
	);
}

export default App;
