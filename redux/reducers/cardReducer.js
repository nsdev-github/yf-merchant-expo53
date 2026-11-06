import * as Types from "../constant";
const initialState = {
  card: null,
  loading: false,
  error: ""
};

export const cardReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.FETCH_CARD:
      return { card: null, error: "", loading: true };

    case Types.CARD_SUCCESS:
      return { card: action.payload, loading: false, error: "" };

    case Types.CARD_FETCH_FAIL:
      return { card: null, loading: false, error: action.payload };

    default:
      return state;
  }
};
