import * as account from "./account";
import * as restaurants from "./restaurants";
import * as navigation from "./navigation";
import * as errors from "./errors";

export const actions = Object.assign({},
  account,
  restaurants,
  navigation,
  geolocation,
  group,
  errors,
);
