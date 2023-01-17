import { POSTAGEM_ONE } from "../actions/actionTypes";

const initialState = {
  postagem_one: {},
};

export const postagemReducer = (state = initialState, action) => {
  switch (action.type) {
    case POSTAGEM_ONE:
      return {
        ...state,
        postagem_one: action.postagem_one,
      };

    default:
      return state;
  }
};
