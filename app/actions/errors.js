import * as types from "./types";

export const clearErrors = () => {
    return (dispatch) => {
        dispatch({ type: types.CLEAR_ERROR })
    }
}

