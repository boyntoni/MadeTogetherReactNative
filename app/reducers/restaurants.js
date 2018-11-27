import * as types from "../actions/types";
import initialState from "./initialState";

export default function restaurantReducer(state = initialState.restaurants, action) {
	switch(action.type) {
		case types.FETCH_RESTAURANTS_SEARCH_SUCCESS:
			return action.restaurants;
		default:
			return state;
	}
}
