import React, { Component } from "react";
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { Text, View, TextInput } from "react-native";
import Button from "react-native-button";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import { withNavigation } from "react-navigation";
import AddressSearchFields from "./AddressSearchFields";

import { searchRestaurants } from "../../actions/restaurants";

import * as colors from "../../stylesheets/colors";
import { containers } from "../../stylesheets/containers";
import { primary } from "../../stylesheets/primary";

class AddRestaurant extends Component {

  state = {
    latitude: null,
    longitude: null,
    error: null,
    searchTerm: null,
    searchParamater: "near",
    streetAddress: null,
    zip: null,
    city: null,
  }


  static navigationOptions = {
    title: "Made Together",
    headerLeft: null,
    headerStyle: { backgroundColor: colors.primary},
    headerTitleStyle: primary.navFont
  }

  componentDidMount() {
    if (!this.props.geolocation.latitude) {
      this.setState({
        searchParamater: "address",
      });
    }
  }

  toggleSearchParam = (newSearch) => {
    if (newSearch !== this.state.searchParam) {
      this.setState({ searchParamater: newSearch });
    }
  }

  searchRestaurants = () => {
    const { searchTerm, searchParamater } = this.state;
    const { navigation, jwtToken, geolocation } = this.props;
    if (!searchTerm) {
      return this.setState({ error: "Please enter a valid search" });
    }
    let searchAddress = null;
    if (searchParamater !== "near") {
      searchAddress = this.concatSearchTerms();
    }
    const { longitude, latitude } = geolocation;
    const searchData = {
      longitude,
      searchAddress,
      latitude,
      searchTerm,
    };
    console.log(searchData);
    this.props.searchRestaurants(searchData, jwtToken, navigation.navigate);
    return navigation.navigate("LoadingSpinner")
  }

  concatSearchTerms() {
    const { streetAddress, zip, city } = this.state;
    let searchAddress = "";
    if (streetAddress) {
      searchAddress += streetAddress.trim();

      if (!city) {
        this.setState({ error: "Must include city with address"});
      } else { 
        searchAddress += ` ${city.trim()}`;
      }
    }
    if (zip) {
      if (searchAddress.length) {
        searchAddress += ` ${zip.trim()}`;
      } else {
        searchAddress = zip.trim();
      }
    }

    return searchAddress;
  }

  setStreetAddress = (text) => {
    this.setState({streetAddress: text});
  }

  setZip = (text) => {
    this.setState({ zip: text });
  }

  setCity = (text) => {
    this.setState({ city: text });
  }

  render() {
    const { searchParamater, error } = this.state;
    const { serverError, geolocation } = this.props;
    const displayError = error ? error : serverError;
    const nearSearchColor = searchParamater === "near" ? colors.primary : colors.lightGrey;
    const  locationSearchColor = searchParamater === "near" ? colors.lightGrey : colors.primary;
    return (
      <View style={containers.standardLayout}>
          <View style={containers.spaceAroundShort}>
            <TextInput style={primary.inputText}
                      onChangeText={(text) => this.setState({ searchTerm: text })} 
                      onFocus={() => { this.setState({ error: null })}}
                      placeholderTextColor={colors.white}
                      placeholder="Name of restaurant or cuisine" />
          { geolocation.latitude && 
              <View style={containers.spaceAroundRow}>
                 <Button containerStyle={{paddingTop: 10,
                    paddingBottom: 10,
                    height: 40,
                    width: 150,
                    borderRadius: 4,
                    backgroundColor: nearSearchColor}}
                    style={primary.buttonFont}
                    title="Near Me"
                    name="Near Me"
                    accessibilityLabel="Search By My Location"
                    onPress={() => { this.toggleSearchParam("near") }}>
                    Near Me
                </Button>
                <Button containerStyle={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  height: 40,
                  width: 150,
                  borderRadius: 4,
                  backgroundColor: locationSearchColor
                }}
                  style={primary.buttonFont}
                  title="Near Address"
                  name="Near Address"
                  accessibilityLabel="Search By Address"
                  onPress={() => { this.toggleSearchParam("address") }}>
                  Near Address
              </Button> 
              </View>
            }
            <View style={{ width: "100%", height: 30, borderTopWidth: 1, borderTopColor: colors.white }} />
              {searchParamater === "near" ? <View style={containers.addressContainer} /> : <AddressSearchFields setStreet={this.setStreetAddress} setCity={this.setCity} setZip={this.setZip} /> }
            <View style={{ height: 30 }} /> 
            <View style={{ flexBasis: "20%", flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>
              <Button containerStyle={primary.button}
                      style={primary.buttonFont}
                      title="Search"
                      name="Search"
                      accessibilityLabel="Find Restaurant"
                      onPress={() => { this.searchRestaurants() }}>
                      Search
              </Button>
            <View style={{ height: 50 }} />
            { !!displayError && <Text style={primary.errorText}>{displayError}</Text>}
            </View>
          </View>
          <ActionButton
          buttonColor={colors.primary}
          icon={<Icon name="md-undo" color={colors.white} size={25} />}
          name="home"
          position="left"
          onPress={() => { this.props.navigation.navigate("RestaurantList") }}
        />
      </View>
    )
  }

}

const mapStateToProps = (state) => ({
  account: state.account,
  serverError: state.errors,
  jwtToken: state.jwtToken,
  geolocation: state.geolocation,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    searchRestaurants,
  }, dispatch)
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(AddRestaurant));
