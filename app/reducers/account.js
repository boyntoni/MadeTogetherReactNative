import * as types from "../actions/types";
import initialState from "./initialState";

export default function accountReducer(state = initialState.account, action) {
	switch(action.type) {
		case types.FETCH_ACCOUNT_SUCCESS:
			return Object.assign({}, state, action.account);
		case types.CREATE_ACCOUNT_SUCCESS:
			return Object.assign({}, state, {
				username: action.account.username,
				group: action.account.group,
				groupInvitations: action.account.groupInvitations,
			});
		case types.ACCEPT_INVITATION_SUCCESS:
			return state
		case types.REJECT_INVITATION_SUCCESS:
			return state
		default:
			return state;
	}
}
