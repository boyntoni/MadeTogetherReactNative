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
		case types.MODIFY_INVITATION_SUCCESS:
			const newInvitations = state.groupInvitations.filter((invite) => {
				return invite.id !== action.groupId;
			});
			return Object.assign({}, state, { groupInvitations: newInvitations, groupId: action.groupId });
		case types.CREATE_GROUP_SUCCESS:
			return Object.assign({}, state, { groupId: action.groupId });
		default:
			return state;
	}
}
