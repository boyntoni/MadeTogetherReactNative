import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Text, View, TextInput } from "react-native";
import Button from "react-native-button";
import { withNavigation } from "react-navigation";
import { Auth } from "aws-amplify";

import { createAccount, fetchAccount, setToken } from "../actions/account";
import { setGeolocationData } from "../actions/geolocation";
import { clearErrors } from "../actions/errors";

import * as colors from "../stylesheets/colors";
import { containers } from "../stylesheets/containers";
import { primary } from "../stylesheets/primary";


class SignIn extends Component {

  static navigationOptions = {
    header: null
  };

  state = {
    signingIn: false,
    userAction: "",
    username: "",
    password: "",
    phoneNumber: "",
    errorText: "",
    isLoading: true,
    forgotPassword: false,
  };

  componentDidMount() {
    const { navigation, fetchAccount, setToken } = this.props;
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.props.setGeolocationData({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => this.setState({ errorText: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000000, distanceFilter: 10 },
    );
    // Handle current session/log-in
    Auth.currentAuthenticatedUser().then((user) => {
      const { username, signInUserSession } = user;
      const { jwtToken } = signInUserSession.idToken; 
      if (jwtToken) {
        setToken(jwtToken);
        fetchAccount(username, navigation.navigate);
        return navigation.navigate("LoadingSpinner");
      } else {
        this.setState({ isLoading: false });
      }
    }).catch(e => {
      this.setState({ isLoading: false });
    });
  }

  renderInputs = (userAction) => {
    this.setState({
      signingIn: true,
      userAction: userAction
    });
  }

  displayInputs = () => {
    const { signingIn, userAction, forgotPassword } = this.state;
    if (signingIn) {
      return (
        <View style={{flexDirection: "column", alignItems: "center", marginTop: 30, justifyContent: "space-around", flexBasis: "25%"}}>
          { userAction === "Register" && <TextInput autoCapitalize="none" onFocus={() => this.setState({ errorText: null })} onChangeText={(text) => this.setState({ phoneNumber: text })} style={primary.inputText} placeholderTextColor={colors.white} placeholder="Phone Number" /> }
          <TextInput autoCapitalize="none" onFocus={() => this.setState({ errorText: null })} onChangeText={(text) => this.setState({username: text})} style={primary.inputText} placeholderTextColor={colors.white} placeholder="Username" />
          { !forgotPassword && <TextInput autoCapitalize="none" onFocus={() => this.setState({ errorText: null })} secureTextEntry={true} onChangeText={(text) => this.setState({password: text})} style={primary.inputText} placeholderTextColor={colors.white} placeholder="Password" /> }
        </View>
      );
    }
  }

  submitForm = () => {
    const { userAction, phoneNumber, forgotPassword } = this.state;
    const { navigation, fetchAccount } = this.props;
    const username = this.state.username.trim();
    const password = this.state.password.trim();
    const validSubmission = this.validateForm();
    if (this.props.errors) {
      this.props.clearErrors();
    }
    if (validSubmission) {
      if (forgotPassword) {
        Auth.forgotPassword(username)
          .then(() => {
            this.toggleForgotPassword();
            this.setState({
              signingIn: false,
              userAction: "",
              username: "",
              password: "",
              phoneNumber: "",
              errorText: "",
              forgotPassword: false,
            });
            return navigation.navigate("VerifyAccount", {
              username: username,
              password: password,
              forgotPassword: true,
            });
          }).catch((e) => {
            return this.setState({ errorText: "Unable to locate username" });
          });
      }
      if (userAction === "Sign In") {
        Auth.signIn(username, password).then((user) => {
          const { username, signInUserSession } = user;
          const { jwtToken } = signInUserSession.idToken;
          setToken(jwtToken);
          fetchAccount(username, navigation.navigate);
          return navigation.navigate("LoadingSpinner");
        }).catch(err => {
          this.setState({ errorText: err.message});
        });
      } else {
        const phone_number = `+1${phoneNumber}`;
        Auth.signUp({
          username,
          password,
          attributes: {
            phone_number,
          }
        }).then(() => {
          return navigation.navigate("VerifyAccount", {
            username: username,
            password: password,
            forgotPassword: false,
          });
        }).catch(err => {
          this.setState({ errorText: err.message});
        });
      }
    }
  }

  validateForm = () => {
    const { password, username, userAction, forgotPassword } = this.state;
    if (!username) {
      this.setState({ errorText: "You must enter a username" });
      return false;
    }
    if (!password && !forgotPassword) {
      this.setState({ errorText: "You must enter a password" });
      return false;
    }
    if (password.length < 6 && !forgotPassword) {
      if (userAction === "Register") {
        this.setState({ errorText: "Password must be more 6+ characters" });
      } else {
        this.setState({ errorText: "Incorrect password (must be 6+ characters)" });
      }
      return false;
    }
   
    return true;
  }

  changeUserAction = () => {
    const { userAction } = this.state;
    const newChoice = userAction === "Sign In" ? "Register" : "Sign In";
    this.setState({userAction: newChoice});
  }

  toggleForgotPassword = () => {
    const { forgotPassword } = this.state;
    this.setState({ forgotPassword: !forgotPassword, errorText: "", signingIn: !forgotPassword });
  }

  displayButtons = () => {
    const { userAction, signingIn, forgotPassword } = this.state;
    if (!signingIn) {
      return (
      <View style={{flexDirection: "row", justifyContent: "center", alignItems:"center", marginTop: 60}}>
        <Button containerStyle={primary.button}
                style={primary.buttonFont}
                title="Sign In"
                name="Sign In"
                accessibilityLabel="Sign In"
                onPress={() => this.renderInputs("Sign In")}>
                Sign In
        </Button>
        <View style={{width: 50}} />
        <Button containerStyle={primary.button}
                style={primary.buttonFont}
                title="Register"
                title="Register"
                accessibilityLabel="Register"
                onPress={() => this.renderInputs("Register")}>
                Register
        </Button>
      </View>
    );
    }
    const altChoice = userAction === "Sign In" ? "Register" : "Sign In";
    return (
      <View style={{flexDirection: "column", justifyContent: "space-between", alignItems:"center", flexBasis: "40%", marginTop: 15}}>
        <Button containerStyle={primary.wideButton}
                style={primary.buttonFont}
                title="Submit"
                name="Submit"
                accessibilityLabel="Submit"
                onPress={this.submitForm}>
                Submit
        </Button>
        {!forgotPassword ? <Button containerStyle={primary.altWideButton}
          style={primary.buttonFont}
          onPress={this.changeUserAction} >
          {altChoice}
        </Button> :
          <Button containerStyle={primary.altWideButton}
            style={primary.buttonFont}
            onPress={this.toggleForgotPassword} >
            Return
          </Button>
        }
        <View style={containers.errorContainer}>
          <Text style={primary.errorText}>{this.state.errorText || this.props.errors}</Text>
        </View>
      </View>
    );
  }

  render() {
    const { forgotPassword, isLoading } = this.state;
    return (
      <View style={containers.standardLayout}>
          <View style={{flex: 2, flexDirection: "column", justifyContent: "flex-end", backgroundColor: colors.primary, width: "100%"}}>
            <Text style={primary.welcomeText}>Made Together</Text>
          </View>
          <View style={{flex: 2.5, flexDirection: "column", justifyContent: "flex-start", width: "100%", backgroundColor: colors.secondary}}>
            { !this.state.isLoading && this.displayInputs() }
            {!this.state.isLoading && this.displayButtons()}
            { !isLoading && <View style={{ justifyContent: "center", alignItems: "center", margin: 40 }}>
              { !forgotPassword && <Text onPress={this.toggleForgotPassword} style={primary.forgotPassword}>Forgot Password?</Text> }
            </View> }
          </View>
      </View>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    errors: state.errors,
    account: state.account,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    createAccount,
    fetchAccount,
    setGeolocationData,
    clearErrors,
    setToken,
  }, dispatch);
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(SignIn));
