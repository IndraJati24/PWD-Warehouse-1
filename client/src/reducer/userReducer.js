const INITIAL_STATE = {
	isLoading: false,
	logError: [],
	user: {
		id_user: null,
		email: "",
		username: "",
		id_role: null,
	},
};

export const userReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case "LOADING":
			return {
				...state,
				isLoading: action.payload,
			};
		case "ERROR":
			return {
				...state,
				logError: action.payload,
			};
		case "LOGIN":
			return {
				...state,
				user: action.payload,
			};
		case "LOGOUT":
			return INITIAL_STATE;
		case "CLEAR_ERROR":
			return {
				...state,
				logError: []
			}
		default:
			return state;
	}
};
