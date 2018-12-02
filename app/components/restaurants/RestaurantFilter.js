import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import Button from "react-native-button";
import PropTypes from "prop-types";

import { primary } from "../../stylesheets/primary";
import { containers } from "../../stylesheets/containers";

export default class RestaurantFilter extends Component {

    static propTypes = {
        handleFilterValue: PropTypes.func.isRequired,
        handleFilter: PropTypes.func.isRequired,
        priceFilters: PropTypes.array.isRequired,
    };

    state = {
        currentFilter: null,
        filterShowing: false,
    };

    handleFilter = (filter) => {
        let filterShowing = false;
        let newFilter = filter;
        if (filter === "price" && (this.state.currentFilter !== filter)) {
            filterShowing = true;
        }
        if (this.state.currentFilter === filter) {
            newFilter = null;
        }
        this.setState({ currentFilter: newFilter, filterShowing: filterShowing });
        this.props.handleFilter(filter)
    }

    handleFilterValue = (value) => {
        this.props.handleFilterValue(value);
    }

    priceInSymbols = (price) => {
        return "$".repeat(price);
    }

    renderFilterOptions = () => {
        const { currentFilter } = this.state;
        const { priceFilters, filterValue } = this.props;
        let filterOptions;
        if (currentFilter === "price") {
            filterOptions = priceFilters;
        } else {
            return;
        }
        if (currentFilter === "price") {
            return filterOptions.map((filter, i) => {
                const isActive = filterValue ? filterValue.includes(filter) : false;
                const fontStyle = isActive ? primary.activeButtonFont : primary.buttonFont;
                return (
                    <View key={i} style={containers.filterButtonContainer}>
                        <Button containerStyle={primary.filterButton}
                            style={fontStyle}
                            title="Filter Option"
                            name="Filter Option"
                            accessibilityLabel="Filter Option"
                            onPress={() => { this.handleFilterValue(filter) }}>
                            {currentFilter === "price" ? this.priceInSymbols(filter) : filter}
                        </Button>
                    </View>
                );
            });
        } else {
            return filterOptions.map((filter, i) => {
                const isActive = filterValue ? filterValue === filter : false;
                const fontStyle = isActive ? primary.activeButtonFont : primary.buttonFont;
                return (
                    <View key={i} style={containers.filterButtonContainerCuisine}>
                        <Button containerStyle={primary.filterButton}
                            style={fontStyle}
                            title="Filter Option"
                            name="Filter Option"
                            accessibilityLabel="Filter Option"
                            onPress={() => { this.handleFilterValue(filter) }}>
                            {currentFilter === "price" ? this.priceInSymbols(filter) : filter}

                        </Button>
                    </View>
                );
            });
        }
      
    }

    isActiveFilter = (filter) => {
        if (filter === this.state.currentFilter) {
            return primary.underlinedButtonFont;
        }
        return primary.buttonFont;
    }

    render() {
        const { hasGeo } = this.props;
        return (
            <View style={containers.filterContainer}>
                <View style={containers.filterFieldContainer}>
                    { hasGeo && <View style={containers.filterButtonContainer}>
                        <Button containerStyle={primary.filterButton}
                            style={this.isActiveFilter("near")}
                            title="Near Me Filter"
                            name="Near Me Filter"
                            accessibilityLabel="Near Me Filter"
                            onPress={ () => { this.handleFilter("near") }}>
                            Near Me
                        </Button>
                    </View> }
                    <View style={containers.filterButtonContainer}>
                        <Button containerStyle={primary.filterButton}
                            style={this.isActiveFilter("price")}
                            title="Price Filter"
                            name="Price Filter"
                            accessibilityLabel="Price Filter"
                            onPress={ () => { this.handleFilter("price") }}>
                            Price
                        </Button>
                    </View>
                </View>
                {this.state.currentFilter === "price" ? 
                <View style={containers.filterFieldContainer}>
                    { this.renderFilterOptions() }
                </View> :
                <View style={containers.filterFieldContainer}>
                    <ScrollView horizontal={true} style={{ width: "100%", height: "100%" }}>
                        {this.renderFilterOptions()}
                    </ScrollView>
                </View>
                }
            </View>
        )
    }

}
