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

let cardRequestSource = null;
let discountRequestSource = null;
let categoryRequestSource = null;

const nextCancelToken = current => {
  current?.cancel?.("superseded");
  return Axios.CancelToken.source();
};

export function parseScannedCardCode(raw) {
  if (raw == null) {
    return "";
  }

  let value = String(raw).trim().replace(/\s/g, "");
  if (!value) {
    return "";
  }

  if (value.includes("/")) {
    const segment = value.split("/").filter(Boolean).pop();
    if (segment) {
      value = segment;
    }
  }

  try {
    value = decodeURIComponent(value);
  } catch (_) {
    // keep raw segment
  }

  return value.split("?")[0].split("#")[0].trim();
}

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

  if (error?.response?.status === 500) {
    return "Server error while loading the card. Try again in a moment.";
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

export const fetchCard = rawCode => dispatch => {
  const code = parseScannedCardCode(rawCode);
  if (!code) {
    dispatch({ type: CARD_FETCH_FAIL, payload: "Invalid QR Code" });
    return;
  }

  cardRequestSource = nextCancelToken(cardRequestSource);
  const cancelToken = cardRequestSource.token;

  dispatch({ type: FETCH_CARD });

  Axios.post(
    "/getcard",
    { code },
    { cancelToken }
  )
    .then(({ data }) => {
      if (data.status) {
        dispatch({ type: CARD_SUCCESS, payload: data.data });
      } else {
        dispatch({
          type: CARD_FETCH_FAIL,
          payload: data.message || "Invalid QR Code"
        });
      }
    })
    .catch(e => {
      if (Axios.isCancel(e)) {
        return;
      }
      console.log(e);
      dispatch({
        type: CARD_FETCH_FAIL,
        payload: getRequestErrorMessage(e, "Unable to load card")
      });
    });
};

export const addDiscountDB = usermeta => dispatch => {
  discountRequestSource = nextCancelToken(discountRequestSource);

  dispatch({ type: SET_DISCOUNT });

  Axios.post(
    "/set-discount",
    {
      data: usermeta
    },
    {
      cancelToken: discountRequestSource.token
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
      if (Axios.isCancel(e)) {
        return;
      }
      console.log(getRequestErrorMessage(e, "Unable to set discount"));
    });
};

export const fetchCategories = sid => dispatch => {
  categoryRequestSource = nextCancelToken(categoryRequestSource);
  dispatch({ type: FETCH_SHOP_DISCOUNT });

  Axios.get(`/get-discount-category/${sid}`, {
    cancelToken: categoryRequestSource.token
  })
    .then(({ data }) => {
      if (data.status) {
        dispatch({ type: DISCOUNT_FETCH_SUCCESS, payload: data.data });
      } else {
        dispatch({ type: DISCOUNT_FETCH_FAIL, payload: "Error" });
      }
    })
    .catch(e => {
      if (!Axios.isCancel(e)) {
        console.log(e);
      }
    });
};
