import * as Types from "../constant";

const initialState = {
  loading: false,
  data: null,
  error: ""
};

export const discountReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.SET_DISCOUNT:
      return { loading: true, data: null, error: "" };

    case Types.DISCOUNT_SUCCESS:
      return { loading: false, data: action.payload, error: "" };

    case Types.DISCOUNT_FAIL:
      return { loading: false, data: null, error: action.payload };

    case "RESET_DISCOUNT_STATUS":
      return { loading: false, data: null, error: "" };
    default:
      return state;
  }
};
