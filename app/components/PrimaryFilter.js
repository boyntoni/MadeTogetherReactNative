import React, { Component } from "react";
import { View, Text } from "react-native";
import Button from "react-native-button";
import PropTypes from "prop-types";

import * as colors from "../stylesheets/colors";
import { primary } from "../stylesheets/primary";
import { containers } from "../stylesheets/containers";

export default class PrimaryFilter extends Component {

    static propTypes = {
        handlePrimaryFilter: PropTypes.func.isRequired,
    };

    state = {
        filter: "toDo",
    };

    handleFilter = (filter) => {
        if (this.state.filter === filter) {
            return;
        }
        this.setState({ filter: filter });
        this.props.handlePrimaryFilter(filter)
    }

    isActiveFilter = (value) => {
        if (value === this.state.filter) {
            return primary.activeButtonFont;
        } else {
            return primary.buttonFont;
        }
    }

    render() {
        return (
            <View style={containers.primaryFilterContainer}>
                <View style={containers.filterFieldContainer}>
                    <View style={containers.filterButtonContainerNoBorder}>
                        <Button containerStyle={primary.filterButton}
                            style={this.isActiveFilter("toDo")}
                            title="To Do Filter"
                            name="To Do Filter"
                            accessibilityLabel="To Do Filter"
                            onPress={() => { this.handleFilter("toDo") }}>
                            To Do
                        </Button>
                    </View>
                    <View style={containers.filterButtonContainerNoBorder}>
                        <Button containerStyle={primary.filterButton}
                            style={this.isActiveFilter("favorites")}
                            title="Favorites Filter"
                            name="Favorites Filter"
                            accessibilityLabel="Favorites Filter"
                            onPress={() => { this.handleFilter("favorites") }}>
                            Favorites
                        </Button>
                    </View>
                </View>
            </View>
        )
    }

}
