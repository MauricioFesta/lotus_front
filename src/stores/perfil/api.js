import api from "../../others/api_default";

export const putPerfil = async (data) => {
  let result = await api.put("api/perfil-alterar", data);

  return result;
};

export const getPerfil = async () => {
  let result = await api.get("/api/get-perfil");

  return result;
};
