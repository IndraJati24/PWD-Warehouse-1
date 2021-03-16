import Axios from "axios";

export const register = (data) => {
	return async (dispatch) => {
		dispatch({ type: "LOADING", payload: true });
		dispatch({ type: "ERROR", payload: [] });
		try {
			await Axios.put("http://localhost:1000/user/register", data);

			dispatch({ type: "LOADING", payload: false });
		} catch (err) {
			// console.log(err)
			dispatch({ type: "ERROR", payload: err.response.data });
			dispatch({ type: "LOADING", payload: false });
		}
	};
};

export const logout = () => {
	return async (dispatch) => {
		try {
			localStorage.removeItem("token");
			dispatch({ type: "LOGOUT" });
		} catch (err) {
			console.log(err);
		}
	};
};
