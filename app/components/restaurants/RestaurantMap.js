import React, { Component } from "react";
import { Text, View, ScrollView } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MapView from "react-native-maps";
import ActionButton from "react-native-action-button";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/Ionicons";
import { withNavigation } from "react-navigation";

import * as colors from "../../stylesheets/colors";
import { containers } from "../../stylesheets/containers";
import { restaurantMap } from "../../stylesheets/restaurantMap";
import { primary } from "../../stylesheets/primary";

class RestaurantMap extends Component {

  static navigationOptions = {
    title: "Made Together",
    headerLeft: null,
    headerStyle: { backgroundColor: colors.primary},
    headerTitleStyle: primary.navFont
  };

  state = {
    searchView: null,
  }

  componentWillMount() {
    const { searchView } = this.props.navigation.state.params;
    const { group, restaurantData } = this.props;
    const restaurantList = searchView === "search" ? restaurantData.searchResults : group.restaurants;
    this.setState( {
      searchView: searchView,
      restaurantList: restaurantList,
    });
  }

  generateNewBoundingCoords = (restaurant) => {
    const { latitude, longitude } = restaurant;
    const adjustmentDistance = 1000;
    const earthRadius = 6378.137;
    const pi = Math.PI;
    const cos = Math.cos;
    const m = (1 / ((2 * pi / 360) * earthRadius)) / 1000;
    const newLat = latitude + (adjustmentDistance * m);
    const newLong = longitude + (adjustmentDistance * m) / cos(latitude * (pi / 180));
    return {
      newLat,
      newLong,
    }
  }

  generateMarkerCoords = () => {
    const { restaurantList } = this.state;
    const { geolocation } = this.props;
    let maxDistance = 0;
    let maxCoord;
    const restaurantCoords = restaurantList.map((restaurant) => {
      if (restaurant.distanceFromUser > maxDistance) {
        maxDistance = restaurant.distanceFromUser;
        maxCoord = this.generateNewBoundingCoords(restaurant);
      }
      return { latitude: restaurant.latitude, longitude: restaurant.longitude }
    });
    const userLocation =  { latitude: geolocation.latitude, longitude: geolocation.longitude };
    restaurantCoords.push(userLocation);
    restaurantCoords.push(maxCoord);
    console.log(restaurantCoords);
    return restaurantCoords;
  }

  navBack = () => {
    if (this.state.searchView === "search") {
      return this.props.navigation.navigate("RestaurantSearchResultList");
    } else {
      return this.props.navigation.navigate("RestaurantList");
    }
  }

  priceInSymbols = (price) => {
    return "$".repeat(price);
  }

  render() {
    const { restaurantList } = this.state;
    return (
      <View style={containers.standardLayout}>
        <MapView
          ref={ref => { this.map = ref; }}
          style={restaurantMap.map}
          onLayout={() => { this.map.fitToCoordinates(this.generateMarkerCoords(), {
            edgePadding: { top: 10, right: 10, bottom: 10, left: 10 },
            animated: false,
          })}}
          showsUserLocation={true}
        >
        {restaurantList.map((restaurant, i) => (
         <MapView.Marker
           key={i}
           flat={true}
           coordinate={{latitude: restaurant.latitude, longitude: restaurant.longitude}}
          //  title={String(restaurant.name)}
          //  description={String(restaurant.rating)}
           pinColor={colors.primary}
           provider={"google"}
         >
            <MapView.Callout>
                <View style={restaurantMap.calloutContainer}>
                  <Text style={restaurantMap.calloutTitle}>{ restaurant.name }</Text>
                  <View style={restaurantMap.subCalloutContainer}>
                    <Text style={restaurantMap.calloutText}>{ restaurant.rating }</Text>
                    <Text style={restaurantMap.calloutText}>{ this.priceInSymbols(restaurant.price) } </Text>
                  </View>
                </View>
              </MapView.Callout>
        </MapView.Marker>
        ))}
       </MapView>
        <ActionButton
          buttonColor={colors.primary}
          icon={<Icon name="md-undo" color={colors.white} size={25} />}
          name="home"
          position="left"
          onPress={() => { this.navBack() }}
        />
      </View>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    account: state.account,
    restaurants: state.restaurants,
    group: state.group,
    geolocation: state.geolocation,
  }
}

export default withNavigation(connect(mapStateToProps, null)(RestaurantMap));
