import { observable } from "mobx";
import api from "../../others/api_default";


class _UrlSupportStore {
  constructor() {
    this.obs = observable({
      is_ok: false 
    });
  }

  async handleSendEmail(data) {

    this.is_ok = false

    const result = await api.post("/public/send-email", data);

    if(result.data.OK){
      this.is_ok = true
    }
   }


}

export const UrlSupportStore = new _UrlSupportStore();
