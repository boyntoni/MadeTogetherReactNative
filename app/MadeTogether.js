import React, { Component } from "react";
import { Provider } from "react-redux";
import Amplify from "aws-amplify";

Amplify.configure({
  Auth: {
    identityPoolId: "arn:aws:cognito-idp:us-east-2:560827887082:userpool/us-east-2_NZsqjIaIw",
    region: "us-east-1",
    userPoolId: "us-east-2_NZsqjIaIw",
    userPoolWebClientId: "3fs31ms7lbqcgqjogk9v2idr39",
  }
});

import AppWithNavigationState from "./navigators/AppNavigator";
import { store } from "./store/configureStore";

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

export default App
