import { userReducer } from "./userReducer";
import { cardReducer } from "./cardReducer";

import { combineReducers } from "redux";
import { discountReducer } from "./discountReducer";
import { categoryReducer } from "./categoryReducer";

export default combineReducers({
  user: userReducer,
  card: cardReducer,
  category: categoryReducer,
  discount: discountReducer
});
