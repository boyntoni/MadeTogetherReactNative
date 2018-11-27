import { StyleSheet } from "react-native";
import * as colors from "./colors";

export const restaurantMap = StyleSheet.create({
  map: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 0,
  },
  calloutContainer: {
    backgroundColor: colors.white,
    flexDirection: "column",
    position: "relative",
    top: 0,
    right: 0,
    bottom: 0,
    right: 0,
    padding: 0,
    flex: 1,
    alignSelf: "center",
    width: 90,
  },
  calloutText: {
    color: colors.primary,
    fontWeight: "300",
    fontSize: 14,
    textAlign: "center",
    letterSpacing: 1.5,
    flex: 1,
  },
  calloutTitle: {
    color: colors.secondary,
    textAlign: "center",
    fontWeight: "300",
    fontSize: 16,
    letterSpacing: 1.5,
    flex: 1,
  },
  subCalloutContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.primary,
    justifyContent: "space-between",
  },
});
