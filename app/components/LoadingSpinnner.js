import Spinner from "react-native-spinkit";
import React, { Component } from "react";
import { View, Button } from "react-native";
import PropTypes from "prop-types";

import * as colors from "../stylesheets/colors";

export default class LoadingSpinner extends Component {

    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
    }

    render() {
        const { isVisible } = this.props;
        const size = 100;
        const type = "Circle";
        const color = colors.white;
        return (
            <View style={{height: "100%", width: "100%", backgroundColor: colors.secondary, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Spinner style={{}} isVisible={isVisible} size={size} type={type} color={color} />
            </View>
        )
    }

}
