
import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import Button from "react-native-button";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { withNavigation } from "react-navigation";
import LoadingSpinner from "../LoadingSpinnner.js";

import { acceptInvite, rejectInvite } from "../../actions/group";

import * as colors from "../../stylesheets/colors";
import { primary } from "../../stylesheets/primary";
import { containers } from "../../stylesheets/containers";

require("../../assets/png/mailbox.png");

class ViewInvitations extends Component {

    static propTypes = {
        account: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: "Made Together",
        headerLeft: null,
        headerStyle: { backgroundColor: colors.primary, borderWidth: 1, borderBottomColor: colors.primary },
        headerTitleStyle: primary.navFont
    };

    state = {
        isAccepting: false,
        groupInvitations: [{ "owner": "ian", "groupId": 123123 }],
    }

    componentWillMount() {
        const { account } = this.props;
        this.setState({
          groupInvitations: account.groupInvitations,
        });
    }

    loadIcons = () => {
        return require("../../assets/png/mailbox.png")
    }

    triggerAdd = () => {
        return this.props.navigation.navigate("AddGroup");
    }

    acceptInvitation = (group) => {
        this.setState({ isAdding: true });
        const { navigation, acceptInvite, account, jwtToken } = this.props;
        const revisedInvitations = this.filterInvitations(account, group);
        const inviteDetails = {
            groupId: group.id,
            username: account.username,
            groupInvitations: revisedInvitations,
        };
        acceptInvite(inviteDetails, navigation.navigate, jwtToken);
    }

    removeInvitation = (group) => {
        const { rejectInvite, account, jwtToken, navigation } = this.props;
        const revisedInvitations = this.filterInvitations(account, group);
        const inviteDetails = {
            username: account.username,
            groupInvitations: revisedInvitations,
            groupId: group.id,
            ownerUsername: group.owner,
        };
        rejectInvite(inviteDetails, jwtToken, navigation.navigate);
        this.setState({ groupInvitations: revisedInvitations });
    }

    filterInvitations = (account, group) => {
        return account.groupInvitations.filter((invite) => {
            return invite.id !== group.id;
        });
    }

    renderInvitations = () => {
        const { groupInvitations, isAdding } = this.state;
        return groupInvitations.map((group, i) => {
            return (
                <View key={i} style={{ flexDirection: "column", justifyContent: "space-around", alignItems: "center", width: "100%" }}>
                    {!!isAdding && <LoadingSpinner isVisible={isAdding} />}
                    { !isAdding && <Text style={primary.primaryText}>{group.owner} would like to make plans with you!</Text> }
                    { !isAdding && <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 5 }}>
                        <Button
                            onPress={this.acceptInvitation.bind(null, group)}
                            style={primary.buttonFont}
                            containerStyle={primary.button}
                            title="Accept Invitation"
                            name="Accept Invitation"
                            accessibilityLabel="Accept Invitation">
                            Accept
                        </Button>
                        <Button
                            onPress={this.removeInvitation.bind(null, group)}
                            style={primary.buttonFont}
                            containerStyle={primary.altButton}
                            title="Reject Invitation"
                            name="Reject Invitation"
                            accessibilityLabel="Reject Invitation">
                            Reject
                        </Button>
                    </View> }
                </View>
            );
        });
    }

    render() {
        return (
            <View style={containers.standardLayout}>
                <View style={containers.shortNarrowBody}>
                    { this.renderInvitations() }
                </View>
            </View>
        )
    }

}

const mapStateToProps = (state) => ({
    account: state.account,
    jwtToken: state.jwtToken,
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        acceptInvite,
        rejectInvite,
    }, dispatch);
}


export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ViewInvitations));