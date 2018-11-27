import { combineReducers } from "redux";
import account from "./account";
import restaurants from "./restaurants";
import geolocation from "./geolocation";
import group from "./group";
import errors from "./error";
import jwtToken from "./jwtToken";

const rootReducer = combineReducers({
	account,
	restaurants,
	geolocation,
	group,
	errors,
	jwtToken,
})

export default rootReducer;
