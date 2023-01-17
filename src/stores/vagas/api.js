import api from "../../others/api_default";

const config = {};

export const postCadastroVaga = async (data, config) => {
  let result = await api.post("/api/vagas-cadastro", data, config);
  return result;
};

// export const listVagas = async () => {

//     let result = await api.get("/api/vagas-lista")
//     return result

// }

export const postCandidatarseVaga = async (data) => {
  let result = await api.post("/api/vagas-candidatar-se", data, config);
  return result;
};

export const deleteCandidatarseVaga = async (id_vaga) => {
  let result = await api.delete(`/api/vagas-delete-candidatura/${id_vaga}`);
  return result;
};

// export const listVagasEmpresa = async () => {

//     let result = await api.get("/api/vagas-lista-empresa")
//     return result
// }

// export const listVagasEmpresaFechado = async () => {

//     let result = await api.get("/api/vagas-lista-empresa-fechado")
//     return result
// }

export const listVagasEmpresaId = async (id) => {
  let result = await api.get(`/api/vagas-lista-candidatos/${id}`);
  return result;
};

export const downloadCurriculoCandidato = async (id) => {
  return await api.get(`/api/curriculo-download-candidato/${id}`, {
    responseType: "blob",
  });
};

export const candidatoAprovar = async (id, data) => {
  let result = await api.put(`/api/vagas-arovar-candidato/${id}`, data, config);
  return result;
};

export const updateVaga = async (data, config) => {
  let result = await api.post(`/api/update-vaga/`, data, config);
  return result;
};

export const candidatoDesaprovar = async (id, data) => {
  let result = await api.put(
    `/api/vagas-desaprovar-candidato/${id}`,
    data,
    config,
  );
  return result;
};

// export const listNotificacoes = async () => {
//     let result = await api.get("/api/lista-notificacoes")
//     return result
// }

export const listVagasAprovadas = async () => {
  let result = await api.get("/api/lista-vagas-aprovadas");
  return result;
};

export const filterRamo = async (data) => {
  let result = await api.post("/api/vagas-filter-ramo", data);
  return result;
};

export const filterEmpresa = async (data) => {
  let result = await api.post("/api/vagas-filter-empresa", data);
  return result;
};

export const allEmpresas = async () => {
  let result = await api.get("/api/vagas-all-empresas");
  return result;
};
