import axios from "axios";

export const getUser = async (data) => {
  let result = await axios.post("/public/login-login_valida", data);

  return result;
};

export const postCadastroUser = async (data) => {
  let result = await axios.post("/public/login-cadastro", data);
  return result;
};

export const postVerificado = async (data) => {
  let result = await axios.post("/public/login-verificado-valida", data);
  return result;
};

export const handleResetPassword = async (email) => {
  const data = {
    email: email,
  };

  let result = await axios.post("/public/password-reset", data);
  return result;
};

export const handleSendPasswordNew = async (data) => {
  let result = await axios.post("/public/new-password", data);
  return result;
};

export const handlePassWordCodigoValid = async (data) => {
  let result = await axios.post("/public/new-password-confirm", data);
  return result;
};
