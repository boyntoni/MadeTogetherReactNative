import * as types from "../actions/types";
import initialState from "./initialState";

export default function jwtTokenReducer(state = initialState.jwtToken, action) {
    switch (action.type) {
        case types.SET_TOKEN_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}
