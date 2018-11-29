import { StyleSheet } from "react-native";
import * as colors from "./colors";

export const AddGroupStyles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  primaryContainer: {
    flexBasis: "80%",
    flexDirection: "column",
    justifyContent: "space-around", 
    alignItems: "center",
  },
  errorContainer: {
    flexBasis: "10%",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  iconColumn: { 
    flexDirection: "column", 
    flexBasis: "40%",
    width: "100%",
    alignItems: "center", 
    justifyContent: "space-around",
  },
  iconHolder: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  searchContainer: {
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
  },
  searchResultPlaceholder: {
    flexBasis: "20%",
    flexDirection: "column",
    minHeight: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: { 
    marginTop: 5
  },
  navButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "80%",
  },
  buttonFont: {
    fontSize: 16,
    fontWeight: "300",
    color: "white",
    letterSpacing: 2,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#8bbcce",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    flexBasis: "40%"
  },
  backButton: {
    backgroundColor: "#B4452E",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    flexBasis: "40%"
  },
  disabledButton: {
    height: "100%",
    width: "100%",
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center"
  },
  nameResult: {
    fontSize: 26,
    fontWeight: "400",
    color: colors.white,
    letterSpacing: 1.25,
    textAlign: "center",
    height: "100%",
  },
});
