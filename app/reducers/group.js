import * as types from "../actions/types";
import initialState from "./initialState";

export default function groupReducer(state = initialState.group, action) {
    switch (action.type) {
        case types.FETCH_GROUP_SUCCESS:
            return Object.assign({}, action.group);
        case types.ADD_ITEM_SUCCESS:
            switch (action.itemType) {
                case "movies":
                    const newMovies = [...state.movies, action.newItem];
                    return Object.assign({}, state, { movies: newMovies });
                case "shows":
                    const newShows = [...state.shows, action.newItem];
                    return Object.assign({}, state, { shows: newShows });
                case "restaurants":
                    const newRestaurants = [...state.restaurants, action.newItem];
                    return Object.assign({}, state, { restaurants: newRestaurants, hasAdded: true });
                case "destinations":
                    const newDestinations = [...state.destinations, action.newItem];
                    return Object.assign({}, state, { destinations: newDestinations });
                default:
                    return state;
            }
        case types.REMOVE_ITEM_SUCCESS:
            const { itemName } = action;
            switch (action.itemType) {
                case "movies":
                    const newMovies = state.movies.filter((movie) => {
                        return movie.name !== itemName;
                    });
                    return Object.assign({}, state, { movies: newMovies });
                case "shows":
                    const newShows = state.shows.filter((show) => {
                        return show.name !== itemName;
                    });    
                    return Object.assign({}, state, { shows: newShows });
                case "restaurants":
                    const newRestaurants = state.restaurants.filter((restaurant) => {
                        return restaurant._id !== itemName;
                    });   
                    return Object.assign({}, state, { restaurants: newRestaurants });
                case "destinations":
                    const newDestinations = state.destinations.filter((destination) => {
                        return destination.name !== itemName;
                    });
                    return Object.assign({}, state, { destinations: newDestinations });
                default:
                    return state;
            }
        case types.ADD_FAVORITE_SUCCESS:
            switch (action.itemType) {
                case "movies":
                    const newMovies = state.movies.map((movie) => {
                        if (movie.name === action.itemName) {
                            movie.isFavorite = true;
                        }
                        return movie;
                    });
                    return Object.assign({}, state, { movies: newMovies });
                case "shows":
                    const newShows = state.shows.map((show) => {
                        if (show.name === action.itemName) {
                            show.isFavorite = true;
                        }
                        return show;
                    });
                    return Object.assign({}, state, { shows: newShows });
                case "restaurants":
                    const newRestaurants = state.restaurants.map((restaurant) => {
                        if (restaurant._id === action.itemName) {
                            restaurant.isFavorite = true;
                        }
                        return restaurant;
                    });
                    return Object.assign({}, state, { restaurants: newRestaurants });
                case "destinations":
                    const newDestinations = state.destinations.map((destination) => {
                        if (destination.name === action.itemName) {
                            destination.isFavorite = true;
                        }
                        return destination;
                    });
                    return Object.assign({}, state, { destinations: newDestinations });
                default:
                    return state;
            }
        case types.SET_ADD_RESTAURANT_FALSE:
            return Object.assign({}, state, { hasAdded: false });
        default:
            return state;
    }
}
