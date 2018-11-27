import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Text, View, TextInput } from "react-native";
import Button from "react-native-button";
import { withNavigation } from "react-navigation";

import { api } from "../../lib/api";
import { addGroup } from "../../actions/group";

import * as colors from "../../stylesheets/colors";
import { primary } from "../../stylesheets/primary";
import { containers } from "../../stylesheets/containers";
import { AddGroupStyles } from "../../stylesheets/addGroup";

class AddGroup extends Component {

  state = {
    groupMember: null,
    searchValue: null,
    searchResult: null,
    errorText: null,
  }

  static navigationOptions = {
    title: "Made Together",
    headerLeft: null,
    headerStyle: { backgroundColor: colors.primary, borderWidth: 1, borderBottomColor: "#8bbcce"},
    headerTitleStyle: primary.navFont
  };

  searchUsers = () => {
    const { searchValue } = this.state
    const { account } = this.props;
    if (!searchValue) { return this.setState({ errorText: "Enter a username to search for" })}
    this.setState({ errorText: null });
    const trimmedSearch = searchValue.trim();
    if (trimmedSearch === account.username) {
      this.setState({ errorText: "You cannot add yourself to a group" });
      return
    }
    const url = `${api}/accounts/${trimmedSearch}`;
    fetch(url, {
			method: "GET",
			headers: {
				"Accept": "application/json",
    		"Content-Type": "application/json",
			}
    }).then(response => response.json())
    .then((responseJson) => {
        if (responseJson.errorMessage || !responseJson.username) {
          throw new Error(responseJson.errorMessage);
        }
        this.setState({ searchResult: trimmedSearch });
      }).catch((e) => {
        this.setState({ errorText: "We could not find a user with that username" })
      })
  }

  navigateBack = () => {
    this.props.navigation.navigate("NoGroup");
  }

  submitGroup = () => {
    const { groupMember } = this.state;
    const { addGroup, navigation, account, jwtToken } = this.props;
    const isValid = this.validateForm();
    if (isValid) {
        const group = {
          owner: account.username,
          groupMember: groupMember,
        };
        addGroup(group, navigation.navigate, jwtToken);
    } 
  }

  validateForm = () => {
    const { groupMember } = this.state;
    if (!groupMember) {
      return this.setState({ errorText: "Must add a group member" });
    }
    return true
  }

  addInvitedUser = () => {
    this.setState({ groupMember: this.state.searchResult, searchResult: null});
  }

  resetSearch = () => {
    return this.setState({ searchResult: null });
  }

  resetAddedUser = () => {
    this.setState({ groupMember: null, searchResult: null });
  }

  determineSecondaryText = () => {
    const { groupMember, searchResult } = this.state;
    if (!groupMember && !searchResult) {
      return "Search for your friend, and invite them to your group.";
    }
    if (!searchResult) {
      return `Click create group to start planning with ${groupMember}, or search again.`;
    }
    return "We found an account with the username below. Invite them or search again.";
  }

  renderUserSearchUi = () => {
    const { searchResult, groupMember } = this.state;
    if (!searchResult && !groupMember) {
      return (
        <View style={AddGroupStyles.searchContainer}>
          <TextInput style={primary.largeInputText}
            placeholderTextColor={colors.white}
            onChangeText={(input) => this.setState({ searchValue: input })}
            autoCapitalize="none"
            placeholder="Friend's Username" />
          <Button
            containerStyle={primary.shortButton}
            style={primary.buttonFont}
            title="Search"
            name="Search"
            accessibilityLabel="Search"
            onPress={this.searchUsers}>
            Search
          </Button>
        </View> 
      );
    }
    if (!searchResult && groupMember) {
      return (
        <View style={AddGroupStyles.searchContainer}>
          <Button
            containerStyle={primary.altWideButton}
            style={primary.buttonFont}
            title="Search Again"
            name="Search Again"
            accessibilityLabel="Search Again"
            onPress={this.resetAddedUser}>
            Search Again
        </Button>
        </View>
      );
    }
    return (
      <View style={AddGroupStyles.searchContainer}>
        <View style={{ flexDirection: "column", height: 100, justifyContent: "space-around", alignItems: "center", marginTop: 35 }}>
          <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, width: '60%'}}>
            <Text style={AddGroupStyles.nameResult}>{groupMember || searchResult}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-around", width: "60%", marginTop: 5 }}>
            <Button
              containerStyle={primary.altShortButton}
              style={primary.buttonFont}
              title="Try Again"
              name="Try Again"
              accessibilityLabel="Try Again"
              onPress={this.resetSearch}>
              Try Again
                      </Button>
            <Button
              containerStyle={primary.shortButton}
              style={primary.buttonFont}
              title="Invite"
              name="Invite"
              accessibilityLabel="Invite"
              onPress={this.addInvitedUser}>
              Invite
                      </Button>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { errorText, searchResult, groupMember } = this.state;
    return (
      <View style={containers.standardLayout}>
        <View style={{ flexDirection: "column", flexBasis: "60%", width: "100%"}}>
          <View style={AddGroupStyles.headerContainer}>
              <Text style={primary.promptFont}>Begin planning your next experience today</Text>
          </View>
          <View style={AddGroupStyles.primaryContainer}>
            <View style={{ flexDirection: "column", flex: 1, width: "80%", justifyContent: "center", alignItems: "center" }}>
              <Text style={primary.primaryText}>{this.determineSecondaryText()}</Text>
            </View>
            <View style={AddGroupStyles.iconColumn}>
              { this.renderUserSearchUi() }
            </View>
            </View>
          </View>
        <View style={AddGroupStyles.errorContainer}>
          {errorText && <Text style={primary.errorText}>{errorText}</Text>}
        </View>
        <View>
          <View style={AddGroupStyles.navButtonsContainer}>
            <View>
              <Button
                onPress={this.navigateBack}
                style={primary.buttonFont}
                containerStyle={primary.altWideButton}
                title="Back"
                name="Back"
                accessibilityLabel="Back">
                Go Back
              </Button>
            </View>
            <View>
              <Button
                onPress={this.submitGroup}
                style={primary.buttonFont}
                containerStyle={primary.wideButton}
                title="Add Group"
                name="Add Group"
                accessibilityLabel="Add Group">
                Create
              </Button>
            </View>
          </View>
        </View>
    </View>
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.account,
  jwtToken: state.jwtToken,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addGroup,
  }, dispatch)
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(AddGroup));
