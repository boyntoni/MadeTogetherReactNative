import * as types from "../actions/types";
import initialState from "./initialState";

export default function geolocationReducer(state = initialState.errors, action) {
    switch (action.type) {
        case types.ERROR_HANDLER:
            return action.payload;
        case types.CLEAR_ERROR:
            return "";
        default:
            return state;
    }
}
