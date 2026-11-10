import { createStore, applyMiddleware } from "redux";
import { configureStore,getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistReducer, persistStore, createTransform } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from "./reducers";
import thunk from "redux-thunk";

const userPersistTransform = createTransform(
  (inboundState) => ({
    ...inboundState,
    loading: false,
    error: "",
  }),
  (outboundState) => ({
    ...outboundState,
    loading: false,
    error: "",
  }),
  { whitelist: ["user"] }
);

const persistConfig = {
  key: "ns-app-v1",
  storage: AsyncStorage,
  blacklist: ["react-navigation", "card", "discount"],
  transforms: [userPersistTransform],
};

// const persistReducers = persistReducer(persistConfig, rootReducer);
// 
// export default () => {
//   let store = createStore(persistReducers, applyMiddleware(thunk));
//   let persistor = persistStore(store);
//   return { store, persistor };
// };
const persistedReducer = persistReducer(persistConfig, rootReducer);
export default () => {
let store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  }),
});
let persistor = persistStore(store);


return {store,persistor};
};
