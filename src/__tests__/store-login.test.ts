import { getUser } from "../stores/login/api";

test("Login", async () => {
  let email: String = "festamauricio42@gmail.com";
  let senha: String = "7777";

  let data = {
    email,
    senha,
  };

  let struct = {
    Ok: true,
    id: "d508e1d5-c12d-4bb7-81f2-4ee3b97cacc3",
    is_empresa: true,
    verificado: true,
  };

  let resp = await getUser(data);

  expect(resp.data).toMatchObject(struct);
});
