import { createSelector } from 'reselect';
import { getById } from './utils';

export const restaurantsSelector = (state) => state.restaurants.entities;
const orderSelector = (state) => state.order;

const reviewsSelector = (state) => state.reviews.entities;
const usersSelector = (state) => state.users.entities;

export const productsSelector = (state) => state.products.entities;

export const restaurantsLoadingSelector = (state) => state.restaurants.loading;
export const restaurantsLoadedSelector = (state) => state.restaurants.loaded;

export const productsLoadingSelector = (state) => state.products.loading;
export const productsLoadedSelector = (state) => state.products.loaded;

export const reviewsLoadingSelector = (state) => state.reviews.loading;
export const reviewsLoadedSelector = (state) => state.reviews.loaded;

export const usersLoadingSelector = (state) => state.users.loading;
export const usersLoadedSelector = (state) => state.users.loaded;

export const orderProductsSelector = createSelector(
  productsSelector,
  orderSelector,
  (products, order) => {
    return Object.keys(order)
      .filter((productId) => order[productId] > 0)
      .map((productId) => products[productId])
      .map((product) => ({
        product,
        amount: order[product?.id],
        subtotal: order[product?.id] * product?.price,
      }));
  }
);

export const totalSelector = createSelector(
  orderProductsSelector,
  (orderProducts) =>
    orderProducts.reduce((acc, { subtotal }) => acc + subtotal, 0)
);

export const restaurantsListSelector = createSelector(
  restaurantsSelector,
  Object.values
);
export const productsListSelector = createSelector(
  productsSelector,
  Object.values
);
export const reviewsListSelector = createSelector(
  reviewsSelector,
  Object.values
);
export const productAmountSelector = getById(orderSelector, 0);
export const productSelector = getById(productsSelector);
const reviewSelector = getById(reviewsSelector);

export const reviewWitUserSelector = createSelector(
  reviewSelector,
  usersSelector,
  (review, users) => ({
    ...review,
    user: users[review?.userId]?.name,
  })
);

export const averageRatingSelector = createSelector(
  reviewsSelector,
  (_, { reviews }) => reviews,
  (reviews, ids) => {
    const ratings = ids.map((id) => reviews[id]?.rating);
    return Math.round(
      ratings.reduce((acc, rating) => acc + rating) / ratings.length
    );
  }
);
export const isCurrentReviewsInStore = (state, id) => {
  const restorauntReviewId = restaurantsSelector(state)[id].reviews;
  const reviewInStore = reviewsSelector(state);
  const results = restorauntReviewId.filter(
    (reviewId) => reviewInStore[reviewId]
  );

  return results.length === restorauntReviewId.length;
};

export const isProductsLoadedSelector = (state, id) => {
  const restorauntMenuIds = restaurantsSelector(state)[id].menu;
  const productsInStore = productsSelector(state);
  const results = restorauntMenuIds.filter(
    (reviewId) => productsInStore[reviewId]
  );

  return results.length === restorauntMenuIds.length;
};
