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
      dispatch({ type: types.FETCH_GROUP_SUCCESS, group });
      dispatch({ type: types.CREATE_GROUP_SUCCESS, groupId: group.id });
      return navigate("GroupHome");
      }).catch((error) => {
        dispatch({ type: types.ERROR_HANDLER, payload: error.message });
      });
  }
}

export const acceptInvite = (inviteDetails, navigate, jwtToken) => {
  return (dispatch) => {
    const url = `${api}/group/accept`;
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
      const { groupId } = inviteDetails;
      dispatch({ type: types.MODIFY_INVITATION_SUCCESS, groupId });
      return navigate("GroupHome");
    }).catch((error) => {
      dispatch({ type: types.ERROR_HANDLER, payload: error.message });
    })
  }
}

export const rejectInvite = (inviteDetails, jwtToken, navigate) => {
  return (dispatch) => {
    const url = `${api}/group/reject`;
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
      const { groupId } = inviteDetails;
      dispatch({ type: types.MODIFY_INVITATION_SUCCESS, groupId });
      return navigate("NoGroup");
    }).catch((error) => {
      dispatch({ type: types.ERROR_HANDLER, payload: error.message });
    });
  }
}

export const leaveGroup = (username, groupId, newGroupMembers, jwtToken, navigate) => {
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
        dispatch({ type: types.DELETE_GROUP_SUCCESS });
        return navigate("NoGroup");
      }).catch((error) => {
        dispatch({ type: types.ERROR_HANDLER, payload: error.message });
      });
  }
}

export const deleteGroup = (groupId, jwtToken, navigate) => {
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
        dispatch({ type: types.DELETE_GROUP_SUCCESS });
        return navigate("NoGroup");
      }).catch((error) => {
        dispatch({ type: types.ERROR_HANDLER, payload: error.message });
      });
  }
}