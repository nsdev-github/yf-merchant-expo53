import { createSelector } from "reselect";

const user = state => state.user;
const card = state => state.card;
const discount = state => state.discount;
const categories = state => state.category;

export const getUser = createSelector(user, user => user);
export const getCard = createSelector(card, card => card);
export const getDiscountStatus = createSelector(discount, discount => discount);

export const getCategoryLists = createSelector(
  categories,
  categories => categories
);
