import { combineReducers } from "redux";
import { perfilReducer } from "./perfil";
import { postagemReducer } from "./postagem";
import { vagasReducer } from "./vagas";

export const Reducers = combineReducers({
  perfilState: perfilReducer,
  vagasState: vagasReducer,
  postagemState: postagemReducer,
});
