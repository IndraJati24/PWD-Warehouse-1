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

export const login = (data, history) => async (dispatch) => {
    dispatch({ type: "LOADING", payload: true });
    try {
        const result = await Axios.post('http://localhost:1000/user/login', data)
        localStorage.setItem('token', result.data.token)
        dispatch({ type: 'LOGIN', payload: result.data.user })
        if(result.data.role === 'user'){
            history.push('/')
        } else {
            history.push('/admin/dashboard')
        }
        dispatch({ type: "LOADING", payload: false });
    } catch (err) {
        console.log(err.response)
        dispatch({ type: 'ERROR', payload: err.response.data });
        dispatch({ type: 'LOADING', payload: false });
    }
}

export const keepLogin = () => async (dispatch) => {
	const token = localStorage.getItem('token')
	try {
		const result = await Axios.post('http://localhost:1000/user/keepLogin', { token: token })
		dispatch({ type: 'LOGIN', payload: result.data })
	} catch (err) {
		console.log(err)
	}
}
