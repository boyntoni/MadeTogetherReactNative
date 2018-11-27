import * as types from "./types";

export const setGeolocationData = (data) => {
  return (dispatch) => {
    dispatch({ type: types.FETCH_NAVIGATION_SUCCESS, payload: data })
  }
}
