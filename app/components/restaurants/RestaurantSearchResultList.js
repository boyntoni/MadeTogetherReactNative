import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Text, View, ScrollView } from "react-native";
import PropTypes from "prop-types";
import openMap from "react-native-open-maps";
import { withNavigation } from "react-navigation";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";

import RestaurantTile from "./RestaurantTile";

import { setAddRestaurantFalse } from "../../actions/restaurants";
import { addItem } from "../../actions/items";

import * as colors from "../../stylesheets/colors";
import { containers } from "../../stylesheets/containers";
import { primary } from "../../stylesheets/primary";

class RestaurantSearchResultList extends Component {

  static propTypes = {
    geolocation: PropTypes.object.isRequired,
  }

  static navigationOptions = {
    title: "Made Together",
    headerLeft: null,
    headerStyle: { backgroundColor: colors.primary },
    headerTitleStyle: primary.navFont
  };

  handleAdd = (restaurant) => {
    const { group, addItem, jwtToken, navigation } = this.props;
    const restaurantName = restaurant.name
    const restaurantObj = Object.assign({}, restaurant, { name: restaurantName, isFavorite: false });
    const itemDetails = {
        newItem: {
          [restaurantName]: restaurantObj
        },
        itemType: "restaurants",
        groupId: group.id,
    };
    addItem(itemDetails, jwtToken, navigation.navigate);
    return navigation.navigate("LoadingSpinner");
  }

componentDidUpdate(prevProps) {
  const hasAdded = prevProps.group.restaurants.length !== this.props.group.restaurants.length;
  if (hasAdded) {
    this.props.setAddRestaurantFalse();
    this.props.navigation.navigate("RestaurantList");
  }
}

  mapView = () => {
    return this.props.navigation.navigate("RestaurantMap");
  }

  openInMaps = (restaurant) => {
    openMap({
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      travelType: "public_transport",
      end: restaurant.name,
      provider: "google"
    });
  }

  renderRestaurantTiles = () => {
    const { restaurants } = this.props
    if ( restaurants.length ) {
      return restaurants.map((restaurant, i) => {
        return <RestaurantTile isSearch={true} openInMaps={this.openInMaps} handleAdd={this.handleAdd} restaurant={restaurant} key={restaurant._id}/>
      });
    }
  }

  render() {
    const { restaurants } = this.props;
    const calculatedHeight = restaurants.length * 125;
    return (
      <View style={containers.standardLayout}>
        { restaurants.length ?
          <ScrollView contentContainerStyle={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }} style={{ height: calculatedHeight, width: "100%" }}>
            <View style={{ flexBasis: "80%", flexDirection: "column", width: "100%", justifyContent: "flex-start", alignItems: "center" }}>
              {this.renderRestaurantTiles()}
            </View>
            <View style={{ height: 100 }} />
          </ScrollView>
          : 
          <View style={{ flexBasis: "80%", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
            <Text>Looks like there are no results for that search!</Text>
            <Button containerStyle={primary.wideButton}
              style={primary.largeButtonFont}
              name="Back"
              title="Back"
              accessibilityLabel="Back"
              onPress={() => { return this.props.navigation.navigate("AddRestaurant") }}>
              Search Again
            </Button>
          </View> 
        }
        <ActionButton
          buttonColor={colors.primary}
          icon={<Icon name="md-undo" color={colors.white} size={25} />}
          name="home"
          position="left"
          onPress={() => { this.props.navigation.navigate("RestaurantList") }}
        />
        <ActionButton
          buttonColor={colors.primary}
          icon={<Icon name="md-map" color={colors.white} size={25} />}
          name="md-map"
          position="right"
          onPress={() => { this.props.navigation.navigate("RestaurantMap", { searchView: "search" })}}
        />
      </View>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    group: state.group,
    jwtToken: state.jwtToken,
    account: state.account,
    geolocation: state.geolocation,
    restaurants: state.restaurants,
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addItem,
    setAddRestaurantFalse,
  }, dispatch)
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(RestaurantSearchResultList));
