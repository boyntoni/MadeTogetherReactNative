import * as types from "./types";
import { api } from "../lib/api"

export const fetchAccount = (username, navigate, jwtToken) => {
  return (dispatch) => {
    const url = `${api}/accounts/${username}`;
    fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwtToken,
      }
    }).then(response => response.json())
      .then((account) => {
        dispatch({ type: types.FETCH_ACCOUNT_SUCCESS, account });
        if (account.groupId) {
          return navigate("GroupHome");
        } else {
          return navigate("NoGroup");
        }
      }).catch((error) => {
        dispatch({ type: types.ERROR_HANDLER, payload: error.message });
      });
  }
}

export const createAccount = (username, jwtToken, navigate) => {
  return (dispatch) => {
    const url = `${api}/accounts`;
    fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwtToken,
      },
      body: JSON.stringify({ username }),
    }).then(response => response.json())
    .then((account) => {
          if (account.errorMessage) {
            throw new Error(account.errorMessage);
          }
          dispatch({ type: types.FETCH_ACCOUNT_SUCCESS, account });
          return navigate("NoGroup");
        }).catch((error) => {
          dispatch({ type: types.ERROR_HANDLER, payload: error.message });
      });
  }
}

export const setToken = (token) => {
  return (dispatch) => {
    return dispatch({ type: types.SET_TOKEN_SUCCESS, payload: token });
  };
}

export const userAcknowledgeGeo = () => {
    return (dispatch) => {
      return dispatch({ type: types.USER_ACNKNOWLEDGE_GEO });
    }
}





