import * as types from "./types";
import { api } from "../lib/api";

export const addItem = (itemDetails, jwtToken) => {
    return (dispatch) => {
        const url =  `${api}/group/add-item`;
        fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken,
            },
            body: JSON.stringify(itemDetails),
        }).then(response => response.json())
        .then((responseJson) => {
                if (responseJson.errorMessage) {
                    throw new Error(responseJson.errorMessage);
                }
                const { itemType, newItem } = itemDetails;
                const item = newItem[Object.keys(newItem)[0]];
                return dispatch({ type: types.ADD_ITEM_SUCCESS, newItem: item, itemType });
            }).catch((error) => {
                dispatch({ type: types.ERROR_HANDLER, payload: error.message });
        });
    }
}


export const removeItem = (itemDetails, jwtToken) => {
    return (dispatch) => {
        const url = `${api}/group/remove-item`;
        fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken,
            },
            body: JSON.stringify(itemDetails),
        }).then((responseJson) => {
            if (responseJson.errorMessage) {
                throw new Error(responseJson.errorMessage);
            }
            const { itemType, itemName } = itemDetails;
            return dispatch({ type: types.REMOVE_ITEM_SUCCESS, itemName, itemType });
        }).catch((error) => {
            return dispatch({ type: types.ERROR_HANDLER, payload: error.message });
        })
    }
}

export const addFavorite = (itemDetails, jwtToken) => {
    return (dispatch) => {
        const url = `${api}/group/add-favorite`;
        fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken,
            },
            body: JSON.stringify(itemDetails),
        }).then((responseJson) => {
            if (responseJson.errorMessage) {
                throw new Error(responseJson.errorMessage);
            }
            const { itemType, itemName } = itemDetails;
            return dispatch({ type: types.ADD_FAVORITE_SUCCESS, itemName, itemType });
        }).catch((error) => {
            return dispatch({ type: types.ERROR_HANDLER, payload: error.message });
        })
    }
}
