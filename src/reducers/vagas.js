import { VAGA_ONE } from "../actions/actionTypes";

const initialState = {
  vaga_one: {},
};

export const vagasReducer = (state = initialState, action) => {
  switch (action.type) {
    case VAGA_ONE:
      return {
        ...state,
        vaga_one: action.vaga_one,
      };

    default:
      return state;
  }
};
