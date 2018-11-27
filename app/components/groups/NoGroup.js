import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, TouchableHighlight, Image } from "react-native";
import Button from "react-native-button";
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";

import * as colors from "../../stylesheets/colors";
import { primary } from "../../stylesheets/primary";
import { containers } from "../../stylesheets/containers";

require("../../assets/png/mailbox.png");

class NoGroup extends Component {

  static propTypes = {
    account: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: "Made Together",
    headerLeft: null,
    headerStyle: { backgroundColor: colors.primary, borderWidth: 1, borderBottomColor: colors.primary},
    headerTitleStyle: primary.navFont
  };

  componentWillMount() {
    const { account } = this.props;
    this.setState({
      groupInvitations: account.groupInvitations,
    });
  }

  componentDidUpdate(prevProps) {
    const { account } = this.props;
    if (account.groupInvitations.length !== prevProps.account.groupInvitations.length) {
      this.setState({
        groupInvitations: account.groupInvitations,
      });
    }
  }

  loadIcons = () => {
    return require("../../assets/png/mailbox.png")
  }

  triggerAdd = () => {
    return this.props.navigation.navigate("AddGroup");
  }

  render() {
    const { groupInvitations } = this.state;
    const { navigation } = this.props;
    return (
      <View style={containers.standardLayout}>
        <View style={containers.narrowBody}>
            {groupInvitations.length ?
            <TouchableHighlight
              underlayColor={colors.secondary}
              onPress={() => navigation.navigate("ViewInvitations")}
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
              <View style={{ alignItems: "center" }}>
                <Image
                  style={primary.icon}
                  source={this.loadIcons()}
                />
                  <View>
                    <Text style={primary.primaryText}>You have <Text style={primary.bluePrimaryText}>{groupInvitations.length}</Text> invitation(s)</Text>
                    <Text style={primary.primaryText}>Tap to view</Text>
                  </View>
              </View> 
            </TouchableHighlight> :
              <View style={{ flex: 1, justifyContent: "center" }} />
            }
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={primary.whitePromptFont}>It looks like you don't belong to a group yet</Text>
            <View style={{ height: 25 }} />
            <Text style={primary.secondaryText}>Get started now by creating your own group</Text>
            <View style={{ height: 35 }} />
            <Button
                containerStyle={primary.wideButton}
                style={primary.buttonFont}
                title="Submit"
                name="Submit"
                accessibilityLabel="Submit"
                onPress={this.triggerAdd}>
                Create Group
              </Button>
              <View style={{ height: 50 }} />
          </View>
        </View>
      </View>
    )
  }

}

const mapStateToProps = (state) => ({
  account: state.account,
  jwtToken: state.jwtToken,
});


export default withNavigation(connect(mapStateToProps, null)(NoGroup));
