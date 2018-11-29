import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Text, View, TextInput } from "react-native";
import Button from "react-native-button";
import { withNavigation } from "react-navigation";
import { Auth } from "aws-amplify";

import * as colors from "../stylesheets/colors";
import { containers } from "../stylesheets/containers";
import { primary } from "../stylesheets/primary";
import { createAccount, setToken } from "../actions/account";


class VerifiyAccount extends Component {

    static navigationOptions = {
        title: "Made Together",
        headerLeft: null,
        headerStyle: { backgroundColor: colors.primary, borderWidth: 1, borderBottomColor: colors.primary },
        headerTitleStyle: primary.navFont
    };

    state = {
        verificationCode: "",
        errorText: "",
    };

    submitCode = () => {
        const { verificationCode } = this.state;
        const { navigation, createAccount, setToken } = this.props;
        const username = navigation.getParam("username");
        const password = navigation.getParam("password");
        Auth.confirmSignUp(username, verificationCode)
        .then(() => {
            Auth.signIn(username, password).then((userInfo) => {
                const { signInUserSession } = userInfo;
                const { jwtToken } = signInUserSession.idToken;
                setToken(jwtToken);
                createAccount(username, jwtToken, navigation.navigate);
            }).catch(err => {
                this.setState({ errorText: err.message });
            });
        })
        .catch((err) => {
            this.setState({ errorText: err.message});
        });
    }

    render() {
        const { errorText } = this.state;
        return (
            <View style={containers.standardLayout}>
                <View style={{ flex: 1 }} />
                <View style={{ flex: 1, alignItems: 'center', width: '100%' }}>
                    <TextInput
                        onFocus={() => this.setState({ errorText: null })}
                        onChangeText={(text) => this.setState({ verificationCode: text })}
                        style={primary.largeInputText}
                        placeholderTextColor={colors.white}
                        placeholder="Enter your verification code"
                    />
                    <View style={{ height: 50 }} />
                    <Button containerStyle={primary.wideButton}
                        style={primary.buttonFont}
                        title="Submit"
                        name="Submit"
                        accessibilityLabel="Submit"
                        onPress={this.submitCode}>
                        Submit
                    </Button>
                    <View style={{ height: 50 }} />
                    { !!errorText && <Text style={primary.errorText}>{errorText}</Text>}
                </View>
            </View>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        errors: state.errors,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        createAccount,
        setToken,
    }, dispatch);
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(VerifiyAccount));
