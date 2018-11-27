import React, { Component } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import PropTypes from "prop-types";
import Swipeout from "react-native-swipeout";

import * as colors from "../../stylesheets/colors";
import { restaurantTile } from "../../stylesheets/restaurantTile";

export default class RestaurantTile extends Component {

  static propTypes = {
    isSearch: PropTypes.bool.isRequired,
    handleAdd: PropTypes.func,
    handleRemove: PropTypes.func,
    openInMaps: PropTypes.func,
    primaryFilter: PropTypes.string,
  }

  priceInSymbols = (price) => {
    return "$".repeat(price);
  }

  handlePress = (restaurant, isSearch) => {
    if (isSearch) {
      this.props.handleAdd(restaurant);
    } else {
      this.props.handleRemove(restaurant);
    }
  }

  handleFavorite = (restaurant) => {
    this.props.addFavorite(restaurant);
  }

  handleOpenInMap = () => {
    const { restaurant, openInMaps } = this.props;
    openInMaps(restaurant);
  }

  determineRemoveSwipeout = (restaurant) => {
    const { primaryFilter, isSearch } = this.props;
    if (primaryFilter === "toDo") {
      return [
        {
          text: "Remove",
          underlayColor: "#9f0000",
          backgroundColor: "#9f0000",
          color: colors.white,

          type: "remove",
          onPress: () => {
            this.handlePress(restaurant, isSearch);
          },
        },
        {
          text: "Favorite",
          underlayColor: colors.primary,
          backgroundColor: colors.primary,
          color: colors.white,

          type: "favorite",
          onPress: () => {
            this.handleFavorite(restaurant);
          },
        }
      ];
    } else {
      return [
        {
          text: "Remove",
          underlayColor: "#9f0000",
          backgroundColor: "#9f0000",
          color: colors.white,

          type: "remove",
          onPress: () => {
            this.handlePress(restaurant, isSearch);
          },
        }
      ];
    }
  }

  render() {
    const { restaurant, isSearch } = this.props;
    const addSwipeout = [
      {
        text: "Add",
        underlayColor: colors.primary,
        backgroundColor: colors.primary,
        color: colors.white,
        type: "add",
        onPress: () => {
          this.handlePress(restaurant, isSearch);
        },
      },
    ];
    const swipeoutBtns = isSearch ? addSwipeout : this.determineRemoveSwipeout(restaurant);
    return (
      <Swipeout autoClose={true} key={restaurant._id} right={swipeoutBtns} style={{ maxHeight: 125, minHeight: 125, width: "100%", backgroundColor: colors.secondary }}>
        <View key={restaurant._id} style={{ minHeight: 125, maxHeight: 125, flexDirection: "row", height: "100%", justifyContent: "center", alignItems: "center", borderBottomWidth: 1, borderBottomColor: colors.white}}>
          <View style={{flexDirection: "column", flex: 2, justifyContent: "space-around"}}>
            <View style={{flex: 2, flexDirection: "column", justifyContent: "space-around", alignItems: "center"}}>
              <View style={{flex: 2, flexDirection: "column", justifyContent: "flex-end", alignItems: "center"}}>
                <Text style={ restaurantTile.restaurantName }>{ restaurant.name }</Text>
              </View>
              <View style={{width: "50%", height: 1, backgroundColor: colors.white, marginTop: 10, marginBottom: 10}}/>
              <TouchableHighlight underlayColor={colors.secondary} onPress={this.handleOpenInMap} style={{flex: 2, width: "90%", flexDirection: "column", justifyContent: "flex-start", alignItems: "center"}}>
                <Text style={ restaurantTile.restaurantDetailAlt }>{ restaurant.formattedAddress  }</Text>
              </TouchableHighlight>
            </View>
          </View>
          <View style={ {flexDirection: "column", flex: 1, justifyContent: "center", alignItems: "center"} }>
            <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-around", alignItems: "flex-end" }}>
              <Text style={ restaurantTile.restaurantDetail }>Rating: </Text>
              <Text style={ restaurantTile.restaurantDetail }>{ restaurant.rating }</Text>
            </View>
            <View style={ {height: 5}} />
            <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-around", alignItems: "flex-start" }}>
            <Text style={ restaurantTile.restaurantDetail }>Price: </Text>
            <Text style={ restaurantTile.restaurantDetail }>{ this.priceInSymbols(restaurant.price) }</Text>
            </View>
          </View>
        </View>
      </Swipeout>
    )
  }

}

