import * as Types from "../constant";

const initialState = {
  user: null,
  loading: false,
  error: "",
  admin: false
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.CHECKING_CODE:
      return { loading: true, user: null, error: "" };

    case Types.CODE_VALID:
      return { user: action.payload, loading: false, error: "" };

    case Types.CODE_INVALID:
      return { error: action.payload, loading: false, user: null };

    case Types.LOGOUT_USER:
      return { user: null, loading: false, error: "", admin: false };

    case Types.SET_AS_ADMIN:
      return { loading: false, error: "", user: action.payload, admin: true };

    case Types.LOGOUT_ADMIN:
      return { user: null, loading: false, error: "", admin: false };

    default:
      return state;
  }
};