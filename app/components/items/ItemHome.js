import React, { Component } from "react";
import { Text, View, TextInput, Modal, ScrollView, } from "react-native";
import Button from "react-native-button";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ActionButton from "react-native-action-button";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/Ionicons";
import Swipeout from "react-native-swipeout";
import { withNavigation } from "react-navigation";

import PrimaryFilter from "../PrimaryFilter";

import { addItem, removeItem, addFavorite } from "../../actions/items";

import * as colors from "../../stylesheets/colors";
import { containers } from "../../stylesheets/containers";
import { primary } from "../../stylesheets/primary";

class ItemHome extends Component {

    static propTypes = {
        group: PropTypes.object.isRequired,
    }

    static navigationOptions = {
        title: "Made Together",
        headerLeft: null,
        headerStyle: { backgroundColor: colors.primary },
        headerTitleStyle: primary.navFont
    };

    state = { 
        itemType: null,
        addingItem: false,
        itemName: false,
        modalVisible: false,
        activeItems: [],
        items: {},
        primaryFilter: "toDo",
        errorText: null,
    };

    componentWillMount() {
        const { navigation, group } = this.props;
        const item = navigation.getParam("item");
        const itemType = item.toLowerCase();
        const rawGroupItems = group[itemType];
        const toDoItems = rawGroupItems.filter((item) => {
            return !item.isFavorite;
        });
        const favoriteItems = rawGroupItems.filter((item) => {
            return item.isFavorite;
        })
        this.setState({
            itemType: itemType,
            activeItems: toDoItems,
            items: {
                toDo: toDoItems,
                favorites: favoriteItems,
            },
        });
    }

    componentWillReceiveProps = () => {
        this.setState({ modalVisible: false });
    }
    
    setModalVisibility = (visible) => {
        this.setState({ modalVisible: visible });
    }
    
    removeItem(itemName) {
        const { group, removeItem, jwtToken } = this.props;
        const { itemType, activeItems, items, primaryFilter } = this.state;
        const newItems = activeItems.filter((item) => {
            return item.name !== itemName;
        });
        let toDoItems = items.toDo;
        let favoritesItems = items.favorites;
        if (primaryFilter === "toDo") {
            toDoItems = toDoItems.filter((item) => {
                return item.name !== itemName;
            });
        } else {
            favoritesItems = favoritesItems.filter((item) => {
                return item.name !== itemName;
            });
        }

        const itemDetails = {
            removedItem: itemName,
            itemType,
            groupId: group.id,
        };

        const newItemObj = Object.assign({}, {
            toDo: toDoItems,
            favorites: favoritesItems,
        });
        removeItem(itemDetails, jwtToken);
        this.setState({ activeItems: newItems, items: newItemObj });
    }
    
    handleAddFavorite = (newItem) => {
        const { addFavorite, group, jwtToken } = this.props;
        const { itemType, activeItems, items } = this.state;

        const newActiveItems = activeItems.filter((item) => {
            return item.name !== newItem.name;
        });
        
        const toDoList = items.toDo.filter((item) => {
            return item.name !== newItem.name;
        });
        const favoritesList = [...items.favorites, newItem];

        const newItemObj = Object.assign({}, {
            toDo: toDoList,
            favorites: favoritesList, 
        });

        this.setState({
            activeItems: newActiveItems,
            items: newItemObj,
        });
        const itemDetails = {
            itemType,
            itemName: newItem.name,
            groupId: group.id,
        }
        addFavorite(itemDetails, jwtToken);
    }

    toggleAdd = () => {
        this.setState({ addingItem: true });
    }

    addItem = () => {
        const { itemName, itemType, items } = this.state;
        const { addItem, group, jwtToken } = this.props;
        
        if (!itemName) {
            return this.setState({ errorText: `Please enter a name` })
        } else {
            const trimmedItemName = itemName.trim();
            const allItems = items.toDo.concat(items.favorites);
            const filterItems = allItems.filter(item => item.name.toLowerCase() === trimmedItemName.toLowerCase());
            if (filterItems.length) {
                const formattedItemName = itemType.substring(0, itemType.length - 1);
                return this.setState({ errorText: `This ${formattedItemName} has already been added` })
            } else {
                const item = Object.assign({}, { name: trimmedItemName, isFavorite: false });
                const itemDetails = {
                    newItem: {
                        [trimmedItemName]: item,
                    },
                    itemType: itemType,
                    groupId: group.id,
                };  
                addItem(itemDetails, jwtToken);
                const newToDo = [...items.toDo, { name: trimmedItemName }];
                const newItemsObj = Object.assign({}, {
                    toDo: newToDo,
                    favorites: items.favorites,
                });
                this.setState({
                    items: newItemsObj,
                    activeItems: newToDo,
                    addingItem: false,
                    modalVisible: false,
                    itemName: null,
                    primaryFilter: "toDo",
                    errorText: null,
                });
            }
        }
    }

    handlePress = () => {
        const { addingItem } = this.state;
        if (addingItem) {
            this.addItem();
        } else {
            this.toggleAdd();
        }
    }

    renderNoItem = () => {
        const { itemType, addingItem, errorText } = this.state;
        const buttonName = `Add ${itemType}`;
        const buttonText = addingItem ? "Add" : "Tap";
        const promptMessage = `to begin adding ${itemType}`;
        const inputText = itemType.slice(0, -1);
        return (
            <View style={{ height: "100%", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
                {addingItem ? 
                    <View style={{ height: 75, width: "100%"}}>
                        <TextInput autoCapitalize="none"
                            style={primary.largeInputText}
                            placeholderTextColor={colors.white}
                            onFocus={() => { this.setState({ errorText: null }) }}
                            onChangeText={(userInput) => this.setState({ itemName: userInput })}
                            placeholder={`Enter ${inputText} name`} />
                        {errorText && <Text style={primary.errorText}>{ errorText }</Text>}
                    </View>
                     :
                    <View style={{height: 75 }} />
                }
                <Button containerStyle={primary.wideButton}
                    style={primary.largeButtonFont}
                    title="Tap Here"
                    accessibilityLabel={buttonName}
                    onPress={() => { this.handlePress() }}>
                    { buttonText }
                </Button>
                <View style={{ height: 25 }} />
                { !addingItem && <Text style={primary.whitePromptFont}>{ promptMessage }</Text> }
                <View style={{ height: 25 }} />
            </View>
        )
    }

    renderItemTiles = () => {
        const { activeItems, primaryFilter } = this.state;
        return activeItems.map((item, i) => {
            let swipeoutBtns;
            if (primaryFilter === "toDo") {
                swipeoutBtns = [
                    {
                        text: "Remove",
                        underlayColor: colors.primary,
                        backgroundColor: "#9f0000",
                        color: colors.white,
                        type: "delete",
                        onPress: () => {
                            this.removeItem(item.name);
                        },
                    },
                    {
                        text: "Favorite",
                        underlayColor: colors.primary,
                        backgroundColor: colors.primary,
                        color: colors.white,
                        type: "favorite",
                        onPress: () => {
                            this.handleAddFavorite(item);
                        },
                    },
                ];
            } else {
                swipeoutBtns = [
                    {
                        text: "Remove",
                        underlayColor: colors.primary,
                        backgroundColor: "#9f0000",
                        color: colors.white,
                        type: "delete",
                        onPress: () => {
                            this.removeItem(item.name);
                        },
                    }
                ]
            } 
            return (
                <Swipeout key={i} autoClose={true} right={swipeoutBtns} style={{ flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: colors.secondary }}>
                    <View key={item.id} style={{ minHeight: 100, flexDirection: "column", alignItems: "center", justifyContent: "center", justifyContent: "center", alignItems: "center"}}>
                        <View style={containers.itemListTile} key={item.id + Math.random(0,99)}>
                            <Text style={primary.listItem} key={item.name}>{item.name}</Text>
                        </View>
                        <View style={{ height: 1, borderBottomWidth: 1, borderBottomColor: colors.white, width: "45%" }} />
                    </View>
                </Swipeout>
            )
        });
    }

    handlePrimaryFilter = (filterValue) => {
        const { items } = this.state;
        const activeItems = items[filterValue];
        this.setState({ activeItems: activeItems, primaryFilter: filterValue });
    }
       

    render() {
        const { itemType, activeItems, items, errorText } = this.state;
        const inputText = itemType.slice(1, -1);
        const formattedInputText = `${itemType[0].toUpperCase()}${inputText}`;
        const areItems = activeItems.length;
        const calculatedHeight = activeItems.length * 100;
        return (
            <View style={containers.standardLayout}>
                <View style={{ flexBasis: "10%" }}>
                    <Text style={primary.header}>{`${formattedInputText}s`}</Text>
                </View>
                { items.toDo.length || items.favorites.length ? <PrimaryFilter handlePrimaryFilter={this.handlePrimaryFilter} /> : null }
                { areItems ?
                    <ScrollView contentContainerStyle={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }} style={{height: calculatedHeight, width: "100%"}}>
                        <View style={{ flexBasis: "80%", flexDirection: "column", width: "100%", justifyContent: "flex-start", alignItems: "center" }}>
                            { this.renderItemTiles() }
                        </View>
                        <View style={{ height: 100 }} />
                </ScrollView> :
                <View style={{ flexBasis: "80%", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
                    { (!items.toDo.length && !items.favorites.length) && this.renderNoItem() }
                </View> }
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                >
                    <View style={containers.standardLayout}>
                        <View style={{ flexBasis: "40%", flexDirection: "column", width: "100%", justifyContent: "space-around", alignItems: "center" }}>
                            <View style={{ flexBasis: "10%", flexDirection: "column", width: "100%", justifyContent: "space-around", alignItems: "center" }}>
                                {errorText && <Text style={primary.errorText}>{errorText}</Text>}
                            </View>
                            <TextInput autoCapitalize="none"
                                style={primary.inputText}
                                onFocus={() => {this.setState({ errorText: null })}}
                                placeholderTextColor={colors.white}
                                onChangeText={(userInput) => this.setState({ itemName: userInput })}
                                placeholder={`${formattedInputText} Name`}
                            />
                            <View style={{ flexBasis: "30%", flexDirection: "row", width: "70%", justifyContent: "space-between", alignItems: "center" }}>
                                <Button containerStyle={primary.altWideButton}
                                    style={primary.largeButtonFont}
                                    name="Back"
                                    title="Back"
                                    accessibilityLabel="Back"
                                    onPress={() => { this.setModalVisibility(!this.state.modalVisible) }}>
                                    Back
                                </Button>
                                <Button containerStyle={primary.wideButton}
                                    style={primary.largeButtonFont}
                                    name="Add"
                                    title="Add"
                                    accessibilityLabel={`Add ${formattedInputText}`}
                                    onPress={() => { this.addItem() }}>
                                    Add
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
                { items.toDo.length || items.favorites.length ?
                    <ActionButton
                        buttonColor={colors.primary}
                        name="md-add"
                        position="right"
                        onPress={() => { this.setModalVisibility(!this.state.modalVisible) }}
                    /> : null
                }
                <ActionButton
                    buttonColor={colors.primary}
                    icon={<Icon name="md-home" color={colors.white} size={25} />}
                    name="home"
                    position="left"
                    onPress={() => { this.props.navigation.navigate("GroupHome") }}
                />
            </View>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        group: state.group,
        jwtToken: state.jwtToken,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        addItem,
        removeItem,
        addFavorite,
    }, dispatch)
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ItemHome));
