import * as types from "./types";
import { api } from "../lib/api"

export const fetchGroup = (groupId, jwtToken) => {
  return (dispatch) => {
    const url = `${api}/group/${groupId}`;
    fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwtToken
      }
    }).then(response => response.json())
      .then(group => {
        if (group.errorMessage) {
          throw new Error(group.errorMessage);
        }
        dispatch({ type: types.FETCH_GROUP_SUCCESS, group });
      }).catch((error) => {
        return dispatch({ type: types.ERROR_HANDLER, payload: error.message });
      })
  }
}

export const addGroup = (group, navigate, jwtToken) => {
  return (dispatch) => {
		const url = `${api}/group`;
    fetch(url, {
			method: "POST",
			headers: {
				"Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwtToken,
			},
			body: JSON.stringify(group)
		}).then(response => response.json())
    .then((group) => {
        if (group.errorMessage) {
          throw new Error(group.errorMessage);
        }
        dispatch({type: types.FETCH_GROUP_SUCCESS, group });
        return navigate("GroupHome");
      }).catch((error) => {
        dispatch({ type: types.ERROR_HANDLER, payload: error.message });
      })
  }
}

export const acceptInvite = (inviteDetails, navigate, jwtToken) => {
  return (dispatch) => {
    const url = `${api}/accounts/group/accept`;
    fetch(url, {
			method: "POST",
			headers: {
				"Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwtToken,
        body: JSON.stringify(inviteDetails)
			}
		}).then(response => response.json())
    .then((responseJson) => {
      if (responseJson.errorMessage) {
        throw new Error(responseJson.errorMessage);
      }
      dispatch({ type: types.FETCH_GROUP_SUCCESS, group: responseJson.group })
    }).then(() => {
      setTimeout(() => {
        navigate("GroupHome")
      }, 1000);
    }).catch((error) => {
      dispatch({ type: types.ERROR_HANDLER, payload: error.message });
    })
  }
}

export const rejectInvite = (inviteDetails, jwtToken) => {
  return (dispatch) => {
    const url = `${api}/accounts/group/reject`;
    fetch(url, {
			method: "POST",
			headers: {
				"Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwtToken,
      },
      body: JSON.stringify(inviteDetails)
		}).then(response => response.json())
    .then((responseJson) => {
      if (responseJson.errorMessage) {
        throw new Error(responseJson.errorMessage);
      }
      dispatch({type: types.FETCH_ACCOUNT_SUCCESS, group: responseJson.group});
    }).catch((error) => {
      dispatch({ type: types.ERROR_HANDLER, payload: error.message });
    });
  }
}

export const leaveGroup = (username, groupId, newGroupMembers, jwtToken) => {
  return (dispatch) => {
    const url = `${api}/accounts/group/leave`;
    fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwtToken,
        body: JSON.stringify({ username, groupId, newGroupMembers }),
      },
    }).then(response => response.json())
      .then((responseJson) => {
        if (responseJson.errorMessage) {
          throw new Error(responseJson.errorMessage);
        }
        // dispatch({ type: types.LEAVE_GROUP_SUCCESS, group: responseJson.group });
      }).catch((error) => {
        dispatch({ type: types.ERROR_HANDLER, payload: error.message });
      });
  }
}

export const deleteGroup = (groupId, jwtToken) => {
  return (dispatch) => {
    const url = `${api}/accounts/group/reject/${groupId}`;
    fetch(url, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwtToken,
      },
    }).then(response => response.json())
      .then((responseJson) => {
        if (responseJson.errorMessage) {
          throw new Error(responseJson.errorMessage);
        }
        // dispatch({ type: types.DELETE_GROUP_SUCCESS, group: responseJson.group });
      }).catch((error) => {
        dispatch({ type: types.ERROR_HANDLER, payload: error.message });
      });
  }
}