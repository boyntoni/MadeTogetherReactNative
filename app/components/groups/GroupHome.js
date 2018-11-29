import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Text, View, Image, TouchableHighlight } from "react-native";
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";

import { fetchGroup } from "../../actions/group"; 

import * as colors from "../../stylesheets/colors";
import { containers } from "../../stylesheets/containers";
import { groupHomescreen } from "../../stylesheets/groupHomescreen";
import { primary } from "../../stylesheets/primary";


class GroupHome extends Component {

    state = {
        menuItems: null,
        pollingInterval: null,
    }
    static propTypes = {
        account: PropTypes.object.isRequired,
        group: PropTypes.object.isRequired,
    }

    static navigationOptions = {
        title: "Made Together",
        headerLeft: null,
        headerStyle: { backgroundColor: colors.primary, borderWidth: 1, borderBottomColor: colors.primary },
        headerTitleStyle: primary.navFont
    };

    componentWillMount() {
        const { fetchGroup, account, jwtToken } = this.props;
        fetchGroup(account.groupId, jwtToken);
        this.renderImages();
        this.initiatePolling();
    }

    initiatePolling = () => {
        const pollingInterval = setInterval(this.fetchGroupUpdates, 20000);
        this.setState({
            pollingInterval,
        })
    }

    fetchGroupUpdates = () => {
        const { fetchGroup, account, jwtToken } = this.props;
        fetchGroup(account.groupId, jwtToken);
    }

    componentWillUnmount() {
        clearInterval(this.pollingInterval);
    }

    renderImages = () => {
        const items = ["Restaurants", "Movies", "Shows", "Destinations"]
        const newMenuItems = items.map((item) => {
            return { destination: this.determineRoute(item), image: this.loadImage(item), name: item }
        });
        this.setState({ menuItems: newMenuItems });
    }

    handleNavigation = (destination, itemType) => {
        return this.props.navigation.navigate(destination, {
            item: itemType,
        });
    }

    determineRoute = (menuItem) => {
        switch (menuItem) {
            case "Restaurants":
                return "RestaurantList";
            default:
                return "ItemHome";
        }
    }

    loadImage = (menuItem) => {
        switch (menuItem) {
            case "Restaurants":
                return require("../../assets/png/cutlery.png")
            case "Movies":
                return require("../../assets/png/clapperboard.png")
            case "Shows":
                return require("../../assets/png/television.png")
            case "Destinations":
                return require("../../assets/png/worldwide.png")
            default:
                return
        }
    }

    loadProfileIcon = () => {
        return require("../../assets/png/user.png");
    }


    render() {
        const { menuItems } = this.state;
        const { navigation } = this.props;
        return (
            <View style={containers.standardFlexStartLayout}>
                <View style={containers.shortBody}>
                    <TouchableHighlight
                        underlayColor={colors.secondary}
                        onPress={() => navigation.navigate("EditProfile")}
                        style={{ flex: 0.3, flexDirection: "row", justifyContent: "space-around", alignItems: "flex-end" }}
                    >
                        <View style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                            <Image
                                style={primary.smallIcon}
                                source={this.loadProfileIcon()}
                            />
                            <Text style={primary.primaryText}>Account Settings</Text>
                        </View>
                    </TouchableHighlight>
                    <View style={groupHomescreen.topContentRow}>
                        <TouchableHighlight
                            underlayColor={colors.secondary}
                            onPress={() => this.handleNavigation(menuItems[0].destination, menuItems[0].name)}
                            style={groupHomescreen.imageContainer}
                        >
                            <View>
                                <Image
                                    style={groupHomescreen.logo}
                                    source={menuItems[0].image} 
                                />
                                <Text style={primary.whitePromptFont}>{menuItems[0].name}</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={colors.secondary}
                            onPress={() => this.handleNavigation(menuItems[1].destination, menuItems[1].name)}
                            style={groupHomescreen.imageContainer}
                        >
                            <View>
                                <Image 
                                    style={groupHomescreen.logo}
                                    source={menuItems[1].image} 
                                />
                                <Text style={primary.whitePromptFont}>{menuItems[1].name}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={groupHomescreen.contentRow}>
                        <TouchableHighlight
                            underlayColor={colors.secondary}
                            onPress={() => this.handleNavigation(menuItems[2].destination, menuItems[2].name)}
                            style={groupHomescreen.imageContainer}
                        >
                            <View>
                                <Image
                                    style={groupHomescreen.logo}
                                    source={menuItems[2].image}
                                />
                                <Text style={primary.whitePromptFont}>{menuItems[2].name}</Text>
                            </View>
                        </TouchableHighlight> 
                        <TouchableHighlight
                            underlayColor={colors.secondary}
                            onPress={() => this.handleNavigation(menuItems[3].destination, menuItems[3].name)}
                            style={groupHomescreen.imageContainer}
                        >
                            <View>
                                <Image
                                    style={groupHomescreen.logo}
                                    source={menuItems[3].image}
                                />
                                <Text style={primary.whitePromptFont}>{menuItems[3].name}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        )
    }

}

const mapStateToProps = (state) => ({
  account: state.account,
  group: state.group,
  jwtToken: state.jwtToken,
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchGroup,
    }, dispatch)
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(GroupHome));
