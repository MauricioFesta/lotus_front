import { observable } from "mobx";
import { observer } from "mobx-react";
import socket from "../../components/socket";

class _SocketStore {
  obs = observable({
    channel_vagas: {},
    channel_notfy: {},
    is_load: false,
  });

  constructor() {
  }

  load() {
    this.obs.channel_notfy = socket.channel("notify:open");
    this.obs.channel_vagas = socket.channel("vagas:open");

    this.obs.channel_notfy.join()
      .receive("ok", resp => {
        console.log("Bem vindo", resp);
      })
      .receive("error", resp => {
        console.log("Error", resp);
      });

    this.obs.channel_vagas.join()
      .receive("ok", resp => {
        console.log("Bem vindo", resp);
      })
      .receive("error", resp => {
        console.log("Error", resp);
      });

    this.obs.is_load = true;
  }
}

export const SocketStore = new _SocketStore();
