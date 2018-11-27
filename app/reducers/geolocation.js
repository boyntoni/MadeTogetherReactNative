import * as types from "../actions/types";
import initialState from "./initialState";

export default function geolocationReducer(state = initialState.geolocation, action) {
	switch(action.type) {
		case types.FETCH_NAVIGATION_SUCCESS:
			return Object.assign({}, state, {
				latitude: action.payload.latitude,
				longitude: action.payload.longitude
			});
		default:
			return state;
	}
}
