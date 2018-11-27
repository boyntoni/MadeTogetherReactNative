import React, { Component } from "react";
import { View, Text, TextInput } from "react-native";
import PropTypes from "prop-types";

import * as colors from "../../stylesheets/colors";
import { containers } from "../../stylesheets/containers";
import { primary } from "../../stylesheets/primary";

export default class AddressSearchFields extends Component {

    static propTypes = {
        setStreet: PropTypes.func.isRequired,
        setZip: PropTypes.func.isRequired,
        setCity: PropTypes.func.isRequired
    };

    render() {
        return (
            <View style={containers.addressContainer}>
                <View style={containers.centeredRow}>
                    <TextInput autoCapitalize="none" 
                        onChangeText={(text) => this.props.setStreet(text)} 
                        style={primary.inputText}
                        placeholderTextColor={colors.white}
                        placeholder="Address" />
                </View>
                <View style={containers.centeredRow}>
                    <TextInput autoCapitalize="none"
                        onChangeText={(text) => this.props.setCity(text)}
                        style={primary.inputText}
                        placeholderTextColor={colors.white}
                        placeholder="City" />
                </View>
                <View style={containers.centeredRow}>
                    <Text style={primary.addressFieldText}>and/or</Text>
                </View>
                <View style={containers.centeredRow}>
                    <TextInput autoCapitalize="none"
                        onChangeText={(text) => this.props.setZip(text)}
                        style={primary.inputText}
                        placeholderTextColor={colors.white}
                        placeholder="Zip" />
                </View>
            </View>
        )
    }

}

