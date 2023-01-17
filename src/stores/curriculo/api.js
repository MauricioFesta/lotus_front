import api from "../../others/api_default";

export const postCurriculo = async (json) => {
  return await api.post("/api/curriculo-cadastro", json.formData, json.config);
};

export const postCurriculoForm = async (data) => {
  return await api.post("/api/curriculo-cadastro-form", data);
};

// export const getCurriculo = async () => {

//     return await api.get("/api/curriculo-consulta");

// }

export const getDownload = async (id) => {
  return await api.get(`/api/curriculo-download/${id}`, {
    responseType: "blob",
  });
};

export const postExcluir = async (id) => {
  return await api.delete(`/api/curriculo-excluir/${id}`);
};

export const setPrincipal = async (id, data) => {
  return await api.put(`/api/curriculo-principal-set/${id}`, data);
};
