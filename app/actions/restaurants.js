import * as types from "./types";
import { api } from "../lib/api";

export const searchRestaurants = (searchData, jwtToken, navigate) => {
  return (dispatch) => {
    const url = `${api}/restaurants/search`;
    fetch(url, {
			method: "POST",
			headers: {
				"Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwtToken,
			},
			body: JSON.stringify(searchData)
		}).then(response => response.json())
    .then((restaurants) => {
        if (restaurants.errorMessage) {
          throw new Error(restaurants.errorMessage);
        }
        dispatch({type: types.FETCH_RESTAURANTS_SEARCH_SUCCESS, restaurants });
        return navigate("RestaurantSearchResultList");
      }).catch((error) => {
        dispatch({ type: types.ERROR_HANDLER, payload: error.message });
        return navigate("AddRestaurant");
      })
  }
}

export const setAddRestaurantFalse = () => {
  return (dispatch) => {
    return dispatch({ type: types.SET_ADD_RESTAURANT_FALSE });
  }
}

