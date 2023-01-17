import { observable } from "mobx";
import { observer } from "mobx-react";
import api from "../../others/api_default";
import init, { get_vagas } from "../../wasm/pkg/wasm";

class _VagasStore {
  constructor() {
    this.obs = observable({
      vagas: [],
      length_vagas: 0,
      chat_msg: [],
    });
  }

  async handleGetVagas() {
    await init();
    let res = await get_vagas();

    this.obs.vagas = res;
  }

  async handleGetChat(empresa_id, user_id) {
    const data = {
      empresa_id,
      user_id,
    };

    let result = await api.post(`/api/chat-get`, data);

    this.obs.chat_msg = result.data;
  }
}

export const VagasStore = new _VagasStore();
