import {
  CHECKING_CODE,
  CODE_VALID,
  CODE_INVALID,
  FETCH_CARD,
  CARD_SUCCESS,
  CARD_FETCH_FAIL,
  SET_DISCOUNT,
  DISCOUNT_SUCCESS,
  DISCOUNT_FAIL,
  FETCH_SHOP_DISCOUNT,
  DISCOUNT_FETCH_SUCCESS,
  DISCOUNT_FETCH_FAIL
} from "../constant";
import Axios from "axios";

const source = Axios.CancelToken.source();

const getRequestErrorMessage = (error, fallback) => {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data?.message) {
    return data.message;
  }

  if (!error?.response && error?.message === "Network Error") {
    return "Unable to reach the server. On web this is often blocked by CORS because the API does not allow the apiKey header.";
  }

  return error?.message || fallback;
};

export const checkCode = code => dispatch => {
  dispatch({ type: CHECKING_CODE });

  Axios.post("/stafflogin", {
    code
  })
    .then(({ data }) => {
      if (data.status) {
        dispatch({
          type: CODE_VALID,
          payload: data.data
        });
      } else {
        dispatch({
          type: CODE_INVALID,
          payload: data.message || "Invalid Staff Code"
        });
      }
    })
    .catch(e => {
      dispatch({
        type: CODE_INVALID,
        payload: getRequestErrorMessage(e, "Unable to verify staff code")
      });
    });
};

export const fetchCard = code => dispatch => {
  if (source != null) {
    source.cancel("stop");
  }

  dispatch({ type: FETCH_CARD });

  Axios.post(
    "/getcard",
    {
      code
    },
    {
      token: source.token
    }
  )
    .then(({ data }) => {
      if (data.status) {
        dispatch({ type: CARD_SUCCESS, payload: data.data });
      } else {
        dispatch({ type: CARD_FETCH_FAIL, payload: "Invalid QR Code" });
      }
    })
    .catch(e => {
      console.log(e);
    });
};

export const addDiscountDB = usermeta => dispatch => {
  if (source != null) {
    source.cancel("stop");
  }

  dispatch({ type: SET_DISCOUNT });

  Axios.post(
    "/set-discount",
    {
      data: usermeta
    },
    {
      token: source.token
    }
  )
    .then(({ data }) => {
      if (data.status) {
        dispatch({ type: DISCOUNT_SUCCESS, payload: data.data });
      } else {
        dispatch({ type: DISCOUNT_FAIL, payload: "Error" });
      }
    })
    .catch(e => {
      console.log(getRequestErrorMessage(e, "Unable to set discount"));
    });
};

export const fetchCategories = sid => dispatch => {
  if (source != null) {
    source.cancel("stop");
  }
  dispatch({ type: FETCH_SHOP_DISCOUNT });

  Axios.get(`/get-discount-category/${sid}`, {
    token: source.token
  })
    .then(({ data }) => {
      if (data.status) {
        dispatch({ type: DISCOUNT_FETCH_SUCCESS, payload: data.data });
      } else {
        dispatch({ type: DISCOUNT_FETCH_FAIL, payload: "Error" });
      }
    })
    .catch(e => console.log(e));
};
