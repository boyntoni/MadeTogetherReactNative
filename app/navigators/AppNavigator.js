import { createStackNavigator } from "react-navigation";

import SignIn from "../components/SignIn";
import LoadingSpinner from "../components/LoadingSpinnner";
import VerifyAccount from "../components/VerifyAccount";
import EditProfile from "../components/EditProfile";

import NoGroup from "../components/groups/NoGroup";
import GroupHome from "../components/groups/GroupHome";
import AddGroup from "../components/groups/AddGroup";
import ViewInvitations from "../components/groups/ViewInvitations";

import RestaurantList from "../components/restaurants/RestaurantList";
import AddRestaurant from "../components/restaurants/AddRestaurant";
import RestaurantSearchResultList from "../components/restaurants/RestaurantSearchResultList";
import RestaurantMap from "../components/restaurants/RestaurantMap";

import ItemHome from "../components/items/ItemHome";

export default AppNavigator = createStackNavigator(
  {
    SignIn: {
      screen: SignIn,
    },
    VerifyAccount: {
        screen: VerifyAccount,
    },
    EditProfile: {
        screen: EditProfile,
    },
    RestaurantList: {
      screen: RestaurantList,
    },
    AddRestaurant: {
      screen: AddRestaurant,
    },
    NoGroup: {
      screen: NoGroup,
    },
    ViewInvitations: {
      screen: ViewInvitations,
    },
    GroupHome: {
      screen: GroupHome,
    },
    AddGroup: {
      screen: AddGroup,
    },
    RestaurantSearchResultList: {
      screen: RestaurantSearchResultList,
    },
    RestaurantMap: {
      screen: RestaurantMap,
    },
    ItemHome: {
      screen: ItemHome,
    },
    LoadingSpinner: {
      screen: LoadingSpinner,
    }
  },
  {
    initialRouteName: "SignIn",
  }
);
