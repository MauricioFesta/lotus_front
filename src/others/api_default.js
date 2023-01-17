import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

let api = axios.create({
  headers: { "X-NZ-Token": cookies.get("_A-T") },
});

export default api;
