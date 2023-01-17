import { observable } from "mobx";
import { observer } from "mobx-react";
import moment from "moment";
import api from "../../others/api_default";
import init, { get_notificacoes } from "../../wasm/pkg/wasm";

// @observer
export class _NotificacoesStore {
  constructor() {
    this.obs = observable({
      notificacoes: [],
      messagens_by_id: [],
      avatar: "",
      status200: false,
    });
  }

  async handleGetMessageById(data) {
    this.obs.messagens_by_id = [];

    let resp = await api.post(`/api/get-messagens-by-id/`, data);

    if (resp.data.msg.length) {
      this.obs.messagens_by_id = [...resp.data.msg];
      this.obs.avatar = resp.data.avatar;
    }
  }

  async handlePutViewedNotify(id) {
    this.obs.status200 = false;

    let resp = await api.put(`/api/viewed-message/${id}`);

    if (resp.data == "ok") {
      this.obs.status200 = true;
    }
  }

  async handleGetNotificacoes(token) {
    this.obs.notificacoes = [];

    // await init()
    // let res = await get_notificacoes(token.toString())
    let resp = await api.get("/api/lista-notificacoes");

    console.log(resp, "Resposta");

    if (Array.isArray(resp.data)) {
      resp.data.map((el, index) => {
        // let json = JSON.parse(el)

        let date = el.updated_at;

        var end = moment(date);
        var duration = moment.duration(moment(new Date()).diff(end));
        var days = duration.asDays();

        console.log("Dias", days);

        if (Math.floor(days) <= 6) {
          this.obs.notificacoes.push(el);
        }
      });
    }

    // console.log(this.obs.notificacoes.length, "hereeee")

    // this.obs.notificacoes = res[0].notificacoes
  }
}

export const NotificacoesStore = new _NotificacoesStore();
