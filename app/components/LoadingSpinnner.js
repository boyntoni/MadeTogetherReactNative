import Spinner from "react-native-spinkit";
import React, { Component } from "react";
import { View } from "react-native";

import { primary } from "../stylesheets/primary";
import * as colors from "../stylesheets/colors";

export default class LoadingSpinner extends Component {

    static navigationOptions = {
        title: "Made Together",
        headerLeft: null,
        headerStyle: { backgroundColor: colors.primary, borderWidth: 1, borderBottomColor: "#8bbcce" },
        headerTitleStyle: primary.navFont
    };

    render() {
        const size = 100;
        const type = "Circle";
        const color = colors.white;
        return (
            <View style={{height: "100%", width: "100%", backgroundColor: colors.secondary, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Spinner style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 50, marginRight: 20 }} isVisible={true} size={size} type={type} color={color} />
            </View>
        )
    }

}
