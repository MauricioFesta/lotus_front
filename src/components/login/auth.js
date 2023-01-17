import Cookies from "universal-cookie";
import { secret } from "./secret";
var jwt = require("jsonwebtoken");
const cookies = new Cookies();
export const isAuthenticatedUser = () => {
  try {
    let ck_token = cookies.get("_A-T-T_L");

    var decoded = jwt.verify(ck_token, secret());

    if (!decoded.is_empresa) {
      return decoded.logged;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const isAuthenticated = () => {
  try {
    let ck_token = cookies.get("_A-T-T_L");

    var decoded = jwt.verify(ck_token, secret());

    return decoded.logged;
  } catch (err) {
    return false;
  }
};

export const isAuthenticatedEmpresa = () => {
  try {
    let ck_token = cookies.get("_A-T-T_L");

    var decoded = jwt.verify(ck_token, secret());

    if (decoded.is_empresa) {
      return decoded.logged;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const idMaster = () => {
  try {
    let ck_token = cookies.get("_A-T-T_L");

    var decoded = jwt.verify(ck_token, secret());

    return decoded.id;
  } catch (err) {
    return false;
  }
};

export const isEmpresa = () => {
  try {
    let ck_token = cookies.get("_A-T-T_L");

    var decoded = jwt.verify(ck_token, secret());

    return decoded.is_empresa;
  } catch (err) {
    return false;
  }
};

export const tokenMain = () => {
  return cookies.get("_A-T");
};
