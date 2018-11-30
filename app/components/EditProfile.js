import React, { Component } from "react";
import { connect } from "react-redux";
import { Text, View, TextInput } from "react-native";
import Button from "react-native-button";
import { bindActionCreators } from "redux";
import { withNavigation } from "react-navigation";
import { Auth } from "aws-amplify";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";

import { deleteGroup, leaveGroup } from "../actions/group";

import * as colors from "../stylesheets/colors";
import { containers } from "../stylesheets/containers";
import { primary } from "../stylesheets/primary";
import { AddGroupStyles } from "../stylesheets/addGroup";


class EditProfile extends Component {

    static navigationOptions = {
        title: "Made Together",
        headerLeft: null,
        headerStyle: { backgroundColor: colors.primary, borderWidth: 1, borderBottomColor: colors.primary },
        headerTitleStyle: primary.navFont
    };

    state = {
        ownerIsUser: false,
        changingPassword: false,
        newPassword: null,
        oldPassword: null,
        errorText: null,
        hasChangedGroup: false,
    }

    componentWillMount() {
        const { group, account } = this.props;
        if (group.owner === account.username) {
            this.setState({ ownerIsUser: true });
        }
    }

    handleRemove = () => {
        const { deleteGroup, leaveGroup, jwtToken, account, group, navigation } = this.props;
        const { ownerIsUser } = this.state;
        this.setState({ hasChangedGroup: true });
        if (ownerIsUser) {
            deleteGroup(group.id, jwtToken, navigation.navigate);
        } else {
            const newGroupMembers = group.members.filter(member => member !== account.username);
            leaveGroup(account.username, group.id, newGroupMembers, jwtToken, navigation.navigate);
        }
        return navigation.navigate("LoadingSpinner");
    };

    handleUpdatePassword = () => {
        const { newPassword, oldPassword } = this.state;
        if (!newPassword || !oldPassword) {
            return this.setState({ errorText: "Must provide old and new password"});
        }
        Auth.currentAuthenticatedUser()
            .then(user => {
                Auth.changePassword(user, oldPassword, newPassword)
                .then(() => {
                    return this.setState({
                        errorText: null,
                        newPassword: null,
                        oldPassword: null,
                        changingPassword: false,
                    });
                });
            }).catch(() => this.setState({ errorText: "There was an issue updating your password. Try again", oldPassword: null, newPassword: null }));
    }

    handleNavigation = () => {
        const { hasChangedGroup } = this.state;
        const { navigation } = this.props;
        if (hasChangedGroup) {
            return navigation.navigate("NoGroup");
        }
        return navigation.navigate("GroupHome");
    }

    render() {
        const { ownerIsUser, changingPassword, errorText } = this.state;
        const { account, group } = this.props;
        return (
            <View style={containers.standardLayout}>
                <View style={{ flexDirection: "column", flexBasis: "70%", width: "100%" }}>
                    <View style={AddGroupStyles.editProfileHeader}>
                        <Text style={primary.whitePromptFont}>Hi, {account.username}</Text>
                        <Text style={primary.whitePromptFont}>{ !changingPassword ? "Edit your profile below" : "Change your password below"}</Text>
                    </View>
                    <View style={AddGroupStyles.primaryContainer}>
                        { !changingPassword && group ?
                            <View style={{ flexDirection: "column", flex: 1, width: "80%", justifyContent: "space-around", alignItems: "center" }}>
                                <View style={{ flexDirection: "column", flex: 0.3, width: "80%", justifyContent: "space-around", alignItems: "center" }}>
                                    <Text style={primary.primaryText}>Change your password</Text>
                                    <Button
                                        containerStyle={primary.shortButton}
                                        style={primary.buttonFont}
                                        title="Change Password"
                                        name="Change Password"
                                        accessibilityLabel="Change Password"
                                        onPress={() => this.setState({ changingPassword: true })}>
                                        Edit
                                    </Button>
                                </View>
                                <View style={{ flexDirection: "column", flex: 0.3, width: "80%", justifyContent: "space-around", alignItems: "center" }}>
                                    <Text style={primary.primaryText}>{ownerIsUser ? "Delete your group" : `Leave your group with ${group.owner}`}</Text>
                                    <Button
                                        containerStyle={primary.shortButton}
                                        style={primary.buttonFont}
                                        title="Submit"
                                        name="Submit"
                                        accessibilityLabel="Submit"
                                        onPress={this.handleRemove}>
                                        {ownerIsUser ? "Delete" : "Leave" }
                                    </Button>
                                </View>
                            </View>
                        :
                            changingPassword &&
                            <View style={{ flexDirection: "column", flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}>
                                <View style={{ flexDirection: "column", alignItems: "center", width: "100%", marginTop: 30, justifyContent: "space-around", flex: 0.6 }}>
                                    <TextInput
                                        autoCapitalize="none"
                                        onFocus={() => this.setState({ errorText: null })}
                                        onChangeText={(text) => this.setState({ oldPassword: text })}
                                        secureTextEntry={true}
                                        style={primary.inputText}
                                        placeholderTextColor={colors.white}
                                        placeholder="Old Password" />
                                    <TextInput
                                        autoCapitalize="none"
                                        onFocus={() => this.setState({ errorText: null })}
                                        secureTextEntry={true}
                                        onChangeText={(text) => this.setState({ newPassword: text })}
                                        style={primary.inputText}
                                        placeholderTextColor={colors.white}
                                        placeholder="New Password" />
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: 60, width: "80%" }}>
                                    <Button
                                        containerStyle={primary.altButton}
                                        style={primary.buttonFont}
                                        title="Cancel"
                                        name="Cancel"
                                        accessibilityLabel="Cancel"
                                        onPress={() => this.setState({ changingPassword: false, newPassword: null, oldPassword: null })}>
                                        Cancel
                                    </Button>
                                    <Button
                                        containerStyle={primary.button}
                                        style={primary.buttonFont}
                                        title="Update Password"
                                        name="Update Password"
                                        accessibilityLabel="Update Password"
                                        onPress={this.handleUpdatePassword}>
                                        Update
                                    </Button>
                                </View>
                                <View style={primary.errorContainer}>
                                    {errorText && <Text style={primary.errorText}>{errorText}</Text>}
                                </View>
                            </View>
                        }
                    </View>
                </View>
                <ActionButton
                    buttonColor={colors.primary}
                    icon={<Icon name="md-undo" color={colors.white} size={25} />}
                    name="home"
                    position="left"
                    onPress={this.handleNavigation}
                />
            </View>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        group: state.group,
        account: state.account,
    };
}


const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        deleteGroup,
        leaveGroup,
    }, dispatch)
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(EditProfile));
