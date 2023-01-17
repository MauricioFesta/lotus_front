import { FORM, QUERY } from "../actions/actionTypes";

const initialState = {
  form: [],
  query: {},
};

export const perfilReducer = (state = initialState, action) => {
  switch (action.type) {
    case FORM:
      return {
        ...state,
        form: action.form,
      };

    case QUERY:
      return {
        ...state,
        query: action.query,
      };

    default:
      return state;
  }
};
