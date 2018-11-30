import { StyleSheet } from "react-native";
import * as colors from "./colors";

export const primary = StyleSheet.create({
  navFont: {
    fontSize: 24,
    fontWeight: "200",
    color: colors.white,
    letterSpacing: 2,
    marginBottom: 10
  },
  icon: {
    height: 64,
    width: 64,
    marginBottom: 10,
  },
  forgotPassword: {
    fontSize: 16,
    fontWeight: "200",
    color: colors.white,
    letterSpacing: 2,
  },
  smallIcon: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  errorContainer: {
    flexBasis: "10%",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    height: 50,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    borderRadius: 4,
    backgroundColor: colors.primary
  },
  shortButton: {
    paddingTop: 10,
    paddingBottom: 10,
    height: 40,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    borderRadius: 4,
    backgroundColor: colors.primary
  },
  altShortButton: {
    paddingTop: 10,
    paddingBottom: 10,
    height: 40,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    borderRadius: 4,
    backgroundColor: colors.lightGrey
  },
  wideButton: {
    paddingTop: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
    height: 50,
    width: 130,
    borderRadius: 4,
    backgroundColor: colors.primary
  },
  filterButton: {
    backgroundColor:colors.secondary,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  altButton: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 100,
    borderRadius: 4,
    backgroundColor: colors.lightGrey
  },
  altWideButton: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 130,
    borderRadius: 4,
    backgroundColor: colors.lightGrey
  },
  buttonFont: {
    fontSize: 16,
    fontWeight: "300",
    letterSpacing: 1.25,
    color: colors.white,
    textAlign: "center",
  },
  activeButtonFont: {
    fontSize: 16,
    fontWeight: "300",
    letterSpacing: 1.25,
    color: colors.white,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  underlinedButtonFont: {
    fontSize: 16,
    fontWeight: "300",
    letterSpacing: 1.25,
    color: colors.white,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  largeButtonFont: {
    fontSize: 20,
    fontWeight: "300",
    letterSpacing: 1.50,
    color: colors.white,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: "300",
    letterSpacing: 1.75,
    color: colors.white, 
    textAlign: "center",
    marginBottom: 15
  },
  inputText: {
    width: "100%",
    fontWeight: "300",
    letterSpacing: 1.5,
    fontSize: 18,
    textAlign: "center",
    color: colors.white
  },
  largeInputText: {
    width: "100%",
    fontWeight: "300",
    letterSpacing: 1.5,
    fontSize: 22,
    textAlign: "center",
    color: colors.white
  },
  altInputText: {
    width: "100%",
    fontWeight: "300",
    letterSpacing: 1.5,
    fontSize: 18,
    textAlign: "center",
    color: colors.darkGrey,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontWeight: "400",
    letterSpacing: 1.25,
    fontSize: 16
  },
  actionButtonIcon: {
   fontSize: 20,
   height: 22,
   color: colors.white,
 },
  promptFont: {
    fontSize: 24,
    fontWeight: "300",
    color: colors.lightGrey,
    letterSpacing: 1.75,
    textAlign: "center"
  },
  whitePromptFont: {
    fontSize: 24,
    fontWeight: "300",
    color: colors.white,
    letterSpacing: 1.75,
    textAlign: "center"
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: "300",
    color: colors.lightGrey,
    letterSpacing: 1.75,
    textAlign: "center"
  },
  primaryText: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.white,
    letterSpacing: 1.25,
    textAlign: "center",
  },
  bluePrimaryText: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.lightGrey,
    letterSpacing: 1.25,
    textAlign: "center",
    fontWeight: "600",
  },
  addressFieldText: {
    fontSize: 16,
    fontWeight: "300",
    color: colors.lightGrey,
    letterSpacing: 1.75,
    textAlign: "center",
    width: "100%",
  },
  listItem: {
    fontSize: 16,
    fontWeight: "300",
    color: colors.white,
    letterSpacing: 1.75,
    textAlign: "center",
    width: "100%",
  },
  header: {
    fontSize: 30,
    fontWeight: "300",
    color: colors.white,
    letterSpacing: 1.75,
    textAlign: "center",
    width: "100%",
    marginTop: 20,
    marginBottom: 10,
  }
});
