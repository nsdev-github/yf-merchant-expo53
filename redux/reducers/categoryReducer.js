import * as Types from "../constant";
const initialState = {
  loading: false,
  categories: [],
  error: ""
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.FETCH_SHOP_DISCOUNT:
      return { loading: true, categories: [], error: "" };

    case Types.DISCOUNT_FETCH_SUCCESS:
      return { loading: false, categories: action.payload, error: "" };

    case Types.DISCOUNT_FETCH_FAIL:
      return { loading: false, categories: [], error: action.payload };
    default:
      return state;
  }
};
