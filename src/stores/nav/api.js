import api from "../../others/api_default";

export const insert_message = async (data) => {
  let result = await api.post("/api/chat-insert", data);

  return result;
};
