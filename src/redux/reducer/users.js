import produce from 'immer';
import {
  ADD_REVIEW,
  FAILURE,
  LOAD_USERS,
  REQUEST,
  SUCCESS,
} from '../constants';
import { arrToMap } from '../utils';

const initialState = {
  entities: {},
  loading: false,
  loaded: false,
  error: null,
};

export default produce((draft = initialState, action) => {
  const { type, payload, userId, response, error } = action;

  switch (type) {
    case LOAD_USERS + REQUEST:
      return {
        ...draft,
        loading: true,
        error: null,
      };
    case LOAD_USERS + SUCCESS:
      return {
        ...draft,
        entities: {
          ...draft.entities,
          ...arrToMap(response),
        },
        loading: false,
        loaded: true,
      };
    case LOAD_USERS + FAILURE:
      return {
        ...draft,
        loading: false,
        loaded: false,
        error,
      };
    case ADD_REVIEW:
      const { name } = payload.review;
      draft.entities[userId] = { id: userId, name };
      break;
    default:
      return draft;
  }
});