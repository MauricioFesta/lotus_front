import { Socket } from "phoenix";
import { tokenMain } from "../login/auth";

// Em producao
let socket = new Socket("/socket", { params: { "x-nz-token": tokenMain() } });

// Local
// let socket = new Socket("ws://127.0.0.1:4000/socket", {params: {"x-nz-token": tokenMain()}});

socket.connect();

export default socket;
