import { StyleSheet } from "react-native";
import * as colors from "./colors";

export const restaurantTile = StyleSheet.create({
  restaurantName: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 1.5,
    textAlign: "center"
  },
  restaurantDetail: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "300",
    letterSpacing: 1.25,
    textAlign: "center"
  },
  restaurantDetailAlt: {
    color: colors.darkGrey,
    fontSize: 12,
    fontWeight: "300",
    letterSpacing: 1.25,
    textAlign: "center"
  },
  listItem: {
    flexDirection: "row",
    width: "90%",
    height: 80,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
});
