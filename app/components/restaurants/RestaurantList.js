import React, { Component } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import Button from "react-native-button";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import { showLocation } from "react-native-map-link";
import { withNavigation } from "react-navigation";
import Permissions from 'react-native-permissions'

import RestaurantTile from "./RestaurantTile";
import RestaurantFilter from "./RestaurantFilter";
import PrimaryFilter from "../PrimaryFilter";
import { setGeolocationData } from "../../actions/geolocation";

import { removeItem, addFavorite } from "../../actions/items";

import * as colors from "../../stylesheets/colors";
import { containers } from "../../stylesheets/containers";
import { primary } from "../../stylesheets/primary";

class RestaurantList extends Component {

  static navigationOptions = {
    title: "Made Together",
    headerLeft: null,
    headerStyle: { backgroundColor: colors.primary},
    headerTitleStyle: primary.navFont
  };

  state = {
    primaryFilter: "toDo",
    filterValue: null,
    filter: null,
    activeRestaurants: [],
    restaurants: {
      toDo: [],
      filters: {
        toDo: {
          price: [],
        },
        price: {
          price: [],
        },
      },
      favorites: [],
    },
  }

  componentWillMount() {
    const { group, account } = this.props;
    const restaurantData = group.restaurants || account.group.restaurants;
    this.populateData(restaurantData);
  }

  componentDidMount() {
    this.fetchLocation();
    setTimeout(this.locationAlert, 1500);
  }

  fetchLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.props.setGeolocationData({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => { this.setState({ errorText: "Unable to set location" }) },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000000, distanceFilter: 10 },
    );
  }

  locationAlert = () => {
    if (!this.props.geolocation.latitude) {
      Alert.alert(
        'Enable Location Services',
        'MadeTogether uses your location to find restaurants by you',
        [
          { text: 'OK', onPress: () => this.requestGeolocationAccess() },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: false }
      )
    }
  }

  requestGeolocationAccess = () => {
    Permissions.request('location').then(response => {
      if (response === "authorized") {
        this.fetchLocation();
      }
      return;
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.group.restaurants.length < this.props.group.restaurants.length) {
      this.populateData(this.props.group.restaurants);
    }
  }

  populateData = (restaurants) => {
    let restaurantsToDo = [];
    let restaurantsFavorites = [];
    let toDoPriceFilters = [];
    let favoritesPriceFilters = [];

    if (restaurants.length) {

      const allRestaurantsWithGeo = restaurants.map((restaurant) => {
        restaurant.distanceFromUser = this.calculateDistance(restaurant.latitude, restaurant.longitude);
        return restaurant;
      });

      const allRestaurants = this.props.geolocation.latitude ? allRestaurantsWithGeo : restaurants;

      restaurantsToDo = allRestaurants.filter((restaurant) => {
        return !restaurant.isFavorite;
      });

      restaurantsFavorites = allRestaurants.filter((restaurant) => {
        return restaurant.isFavorite;
      });

      const allToDoPriceFilters = restaurantsToDo.map((restaurant) => {
        return restaurant.price;
      });
      toDoPriceFilters = [...new Set(allToDoPriceFilters)].sort();

      const allFavoritesPriceFilters = restaurantsFavorites.map((restaurant) => {
        return restaurant.price;
      });
      favoritesPriceFilters = [...new Set(allFavoritesPriceFilters)];
    }

    const restaurantDataObject = {
      toDo: restaurantsToDo,
      favorites: restaurantsFavorites,
      filters: {
        toDo: {
          price: toDoPriceFilters,
        },
        favorites: {
          price: favoritesPriceFilters,
        },
      },
    };

    this.setState({
      restaurants: restaurantDataObject,
      activeRestaurants: restaurantDataObject.toDo,
    });
  }

  handlePrimaryFilter = (filterValue) => {
    const { restaurants } = this.state;
    const activeRestaurants = restaurants[filterValue];
    this.setState({ activeRestaurants: activeRestaurants, primaryFilter: filterValue });
  }

  openInMaps = (restaurant) => {
    const { geolocation } = this.props;
    showLocation({
      sourceLatitude: geolocation.latitude,
      sourceLongitude: geolocation.longitude,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      title: restaurant.name,
      googleForceLatLon: false,
      app: "google-maps"
    });
  }
  
  handleRemove = (restaurant) => {
    const { group } = this.props;

    const itemDetails = {
      removedItem: restaurant.name,
      itemType: "restaurants",
      groupId: group.id,
    };
    this.props.removeItem(itemDetails);
    this.updateUiAfterRemove(restaurant);
  }

  handleFilter = (filter) => {
    if (this.state.filter === filter) {
      return this.setState({ filter: null, filterValue: null });
    }
    return this.setState({ filter: filter, filterValue: null });
  }

  addFavorite = (restaurant) => {
    const { group, addFavorite, jwtToken } = this.props;

    const itemDetails = {
      itemType: "restaurants",
      itemName: restaurant.name,
      groupId: group.id,
    }

    addFavorite(itemDetails, jwtToken);
    this.updateUiAfterFavorite(restaurant);
  }

  handleFilterValue = (newValue) => {
    const { filter, filterValue } = this.state;
    if (filter === "price") {
      if (!filterValue) {
        return this.setState({ filterValue: [newValue]});
      }
      if (!filterValue.includes(newValue)) {
        const newValues = [...filterValue, newValue];
        return this.setState({ filterValue: newValues });
      } else {
        const newValues = filterValue.filter((val) => {
          return val !== newValue;
        });
        if (newValues.length) {
          return this.setState({ filterValue: newValues });
        } else {
          return this.setState({ filterValue: null });
        }
      }
    } else {
      if (newValue === filterValue) {
        return this.setState({ filterValue: null });
      }
      return this.setState ({ filterValue: newValue });
    }
  }

  calculateDistance = (lat, lon) => {
    const { longitude, latitude } = this.props.geolocation;
    const radlat1 = Math.PI * latitude / 180;
    const radlat2 = Math.PI * lat / 180;
    const theta = longitude - lon;
    const radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    return dist;
  }

  renderRestaurantTiles = () => {
    const { activeRestaurants, filter, filterValue, primaryFilter } = this.state
    let filteredRestaurants;
    if (!filter || (!filterValue && filter !== "near")) {
      filteredRestaurants = activeRestaurants;
    } else if (filter === "near") {
      filteredRestaurants = activeRestaurants.sort((a, b) => {
        return a.distanceFromUser - b.distanceFromUser;
      });
    } else {
      filteredRestaurants = activeRestaurants.filter((restaurant) => {
        if (filter === "price") {
          return filterValue.includes(restaurant.price);
        }
        return [];
      });
    }
    return filteredRestaurants.map((restaurant, i) => {
      return <RestaurantTile key={i + 1} primaryFilter={primaryFilter} addFavorite={this.addFavorite} openInMaps={this.openInMaps} isSearch={false} handleRemove={this.handleRemove} restaurant={restaurant} key={restaurant.id}/>
    });
  }

  updateUiAfterFavorite(restaurant) {
    const { activeRestaurants, restaurants } = this.state;
    const newActiveRestaurants = activeRestaurants.filter((rest) => {
      return rest.name !== restaurant.name;
    });
    const newFavorites = [...restaurants.favorites, restaurant];
    let favoritesPriceFilters = restaurants.filters.favorites.price;
    let toDoPriceFilters = restaurants.filters.toDo.price;
    if (!favoritesPriceFilters.includes(restaurant.price)) {
      favoritesPriceFilters = [...favoritesPriceFilters, restaurant.price];
    }
    const filteredToDoPriceFilters = newActiveRestaurants.filter((rest) => {
      return rest === restaurant.price;
    });
    if (!filteredToDoPriceFilters.length) {
      toDoPriceFilters = toDoPriceFilters.filter((filter) => {
        return filter !== restaurant.price;
      });
    }
    
    const newRestaurantDataObj = Object.assign({}, restaurants, {
      favorites: newFavorites,
      toDo: newActiveRestaurants,
      filters: {
        toDo: {
          price: toDoPriceFilters,
        },
        favorites: {
          price: favoritesPriceFilters,
        }
      }
    });

    this.setState({
      restaurants: newRestaurantDataObj,
      activeRestaurants: newActiveRestaurants,
    });
  }

  updateUiAfterRemove = (removedRestaurant) => {
    const restaurantName = removedRestaurant.name;
    const { activeRestaurants, primaryFilter, restaurants } = this.state;

    const newRestaurants = activeRestaurants.filter((restaurant) => {
      return restaurant.name != restaurantName;
    });
    let newToDo = restaurants.toDo;
    let newFavorites = restaurants.favorites;
    if (primaryFilter === "toDo") {
      newToDo = restaurants.toDo.filter((restaurant) => {
        return restaurant.name !== restaurantName;
      });
    } else {
      newFavorites = restaurants.favorites.filter((restaurant) => {
        return restaurant.name !== restaurantName;
      });
    }
    const newRestaurantObj = Object.assign({}, restaurants, {
      favorites: newFavorites,
      toDo: newToDo,
    });

    this.setState({
      activeRestaurants: newRestaurants,
      restaurants: newRestaurantObj,
    });
  }

  renderNoItem = () => {
      return (
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: "10%"}}>
          <Button containerStyle={primary.wideButton}
            style={primary.largeButtonFont}
            name="Add Restaurant"
            title="Tap Here"
            accessibilityLabel="Add Restaurant"
            onPress={() => { this.props.navigation.navigate("AddRestaurant")}}>
            Tap here
          </Button>
          <View style={{ height: 25 }} />
          <Text style={primary.whitePromptFont}>to begin adding restaurants</Text>
        </View>
      )
  }

  render() {
    const { activeRestaurants, filterValue, primaryFilter, restaurants } = this.state;
    const { geolocation } = this.props;
    const priceFilters = restaurants.filters[primaryFilter].price;
    const hasGeo = !!geolocation.latitude;
    const calculatedHeight = activeRestaurants.length * 250;
    
    return (
      <View style={containers.standardLayout}>
        <View style={{ flexBasis: "10%", justifyContent: "center", alignItems: "center" }}>
          <Text style={primary.header}>Restaurants</Text>
        </View>
        { restaurants.toDo.length || restaurants.favorites.length ? <PrimaryFilter handlePrimaryFilter={this.handlePrimaryFilter} /> : null }
        {activeRestaurants.length ? <RestaurantFilter  hasGeo={hasGeo} filterValue={filterValue} handleFilterValue={this.handleFilterValue} handleFilter={this.handleFilter} priceFilters={priceFilters} /> : null }
        { restaurants.toDo.length || restaurants.favorites.length ? <ScrollView contentContainerStyle={{ paddingBottom: 100, flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }} style={{ height: calculatedHeight, width: "100%" }}>
          <View style={{ flexBasis: "80%", flexDirection: "column", width: "100%", justifyContent: "flex-start", alignItems: "center" }}>
            {this.renderRestaurantTiles()}
          </View>
        </ScrollView> :
        <View style={{ flexBasis: "80%", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
          {(!restaurants.toDo.length && !restaurants.favorites.length) && this.renderNoItem()}
        </View> 
        }
        { ((!!restaurants.toDo.length || !!restaurants.favorites.length) && !!hasGeo) &&
        <ActionButton buttonColor={colors.primary}>
          <ActionButton.Item buttonColor={colors.primary} onPress={() => { this.props.navigation.navigate("AddRestaurant") }}>
            <Icon name="md-add" style={primary.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor="#1abc9c" onPress={() => { this.props.navigation.navigate("RestaurantMap", { searchView: "saved" }) }}>
            <Icon name="md-map" style={primary.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton> }
        { ((!!restaurants.toDo.length || !!restaurants.favorites.length) && !hasGeo) &&
        <ActionButton
          buttonColor={colors.primary}
          name="md-add"
          position="right"
          onPress={() => { this.props.navigation.navigate("AddRestaurant") }}
        />
       }
        <ActionButton
          buttonColor={colors.primary}
          icon={<Icon name="md-home" color={colors.white} size={25} />}
          name="home"
          position="left"
          onPress={() => { this.props.navigation.navigate("GroupHome") }}
        />
      </View>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    group: state.group,
    account: state.account,
    geolocation: state.geolocation,
    jwtToken: state.jwtToken,
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    removeItem,
    addFavorite,
    setGeolocationData,
  }, dispatch)
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(RestaurantList));
