import { StyleSheet } from "react-native";
import * as colors from "./colors";

export const groupHomescreen = StyleSheet.create({
  contentContainer: {
    flexBasis: "100%",
    justifyContent: "space-around",
    alignItems: "flex-start",
    flex: 1,
  },
  topContentRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-end",
    paddingBottom: 25,
    flex: 1,
    justifyContent: "space-around"
  },
  contentRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 25,
    flex: 1,
    justifyContent: "space-around"
  },
  imageContainer: {
    flexBasis: "50%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logo: {
    height: 128,
    width: 128,
    marginBottom: 20
  }
});
