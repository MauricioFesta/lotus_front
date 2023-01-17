import { Spinner } from "@blueprintjs/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Link from "@material-ui/core/Link";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { AppToaster } from "../../others/toaster";
import { postCadastroUser, postVerificado } from "../../stores/login/api";

const InputMask = require("react-input-mask");

class CadastroLogin extends React.Component {
  constructor(props) {
    super(props);

    this.obs = observable({
      is_empresa: false,
      is_cod: false,
      open_spinner: false,
      id: "",
      email: "",
      user_valid: false,
      cnpj: "",
      codigo_front: "",
      type_password: "password",
    });
  }

  async handleVerifyCod(vl) {
    this.obs.open_spinner = true;

    let data = {
      id: this.obs.id,
      email: this.obs.email,
      cod_front: this.obs.codigo_front,
      token: this.obs.token,
    };

    let res = await postVerificado(data);

    if (res.data.verificado && !res.data.invalido) {
      this.obs.open_spinner = false;
      AppToaster.show({
        message:
          "Usuário validado, agora você pode se redirecionar para o Login.",
        intent: "success",
      });
      this.obs.user_valid = true;
    } else if (res.data.invalido) {
      this.obs.open_spinner = false;
      AppToaster.show({
        message: "Código inválido, verifique e tente novamente",
        intent: "warning",
      });
    } else {
      this.obs.open_spinner = false;
      AppToaster.show({
        message: "Código inválido, verifique novamente.",
        intent: "warning",
      });
    }
  }

  handleVisualizarSenha() {
    this.obs.type_password = this.obs.type_password == "text"
      ? "password"
      : "text";
  }

  cadastrar = async () => {
    let data = {
      id: uuidv4(),
      nome: $("#nome").val(),
      email: $("#email").val(),
      senha: $("#senha").val(),
      cnpj_cpf: this.obs.cnpj.replaceAll(".", "").replaceAll("-", "")
        .replaceAll("/", ""),
      is_empresa: $("#conta-corporativa").prop("checked").toString(),
    };

    if (this.obs.cnpj === "") {
      AppToaster.show({
        message: this.obs.is_empresa
          ? "Favor preencha o CNPJ da Empresa"
          : "Favor preencha seu CPF.",
        intent: "warning",
      });
      return;
    }

    this.obs.open_spinner = true;

    let res = await postCadastroUser(data);

    if (res.data.time) {
      AppToaster.show({
        message:
          "Para fazer um novo cadastro e para receber um novo códifo, precisa esperar 1 dia",
        intent: "warning",
      });

      this.obs.open_spinner = false;
      return;
    }

    if (res.data.exist) {
      AppToaster.show({
        message: "Email já cadastrado no sistema",
        intent: "warning",
      });

      this.obs.open_spinner = false;
      return;
    }

    if (res.data.pre_cad) {
      this.obs.open_spinner = false;
      this.obs.is_cod = true;
      this.obs.id = res.data.id;
      this.obs.email = res.data.email;
      this.obs.token = res.data.id_random;

      AppToaster.show({
        message: "Foi encaminhado um código para seu email.",
        intent: "success",
      });
    } else {
      this.obs.open_spinner = false;

      AppToaster.show({
        message: "Não foi possível cadastrar o usuário Erro",
        intent: "danger",
      });
    }
  };

  render() {
    return (
      <div className="container mt-4 main">
        <Modal show={this.obs.open_spinner}>
          <Modal.Body>
            <Spinner size={80} value={null} />
          </Modal.Body>
        </Modal>

        {!this.obs.is_cod
          ? (
            <Form>
              <Form.Group>
                <Form.Label>
                  {this.obs.is_empresa ? "Razão Social" : "Nome"}
                </Form.Label>
                <Form.Control
                  id="nome"
                  type="text"
                  placeholder="Entre com seu nome"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  id="email"
                  type="email"
                  placeholder="Entre com seu email"
                />
                <Form.Text className="text-muted">
                  Forneça a o email para cadastro
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  id="senha"
                  type={this.obs.type_password}
                  placeholder="Senha"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      onChange={(e) => this.handleVisualizarSenha()}
                      color="primary"
                    />
                  }
                  label="Visualizar senha"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>{this.obs.is_empresa ? "CNPJ" : "CPF"}</Form.Label>
                {this.obs.is_empresa
                  ? (
                    <InputMask
                      className="form-control"
                      mask="99.999.999/9999-99"
                      onChange={(el) => this.obs.cnpj = el.target.value}
                    />
                  )
                  : (
                    <InputMask
                      className="form-control"
                      mask="999.999.999-99"
                      onChange={(el) => this.obs.cnpj = el.target.value}
                    />
                  )}
              </Form.Group>

              <Form.Group>
                <Form.Label>Conta corporativa ?</Form.Label>
                <Form.Check
                  style={{ marginLeft: 35, marginBottom: 50 }}
                  type="switch"
                  id="conta-corporativa"
                  label=""
                  onChange={(e) => this.obs.is_empresa = !this.obs.is_empresa}
                />
              </Form.Group>

              <Button onClick={this.cadastrar} variant="primary" type="button">
                Cadastrar
              </Button>
            </Form>
          )
          : (
            <>
              <Form.Group as={Col}>
                <Form.Label>Código</Form.Label>
                <Form.Control
                  onChange={(vl) => this.obs.codigo_front = vl.target.value}
                  id="email"
                  type="email"
                  placeholder="cod..."
                />
                <Form.Text className="text-muted">
                  Forneça o código recebido no email
                </Form.Text>
              </Form.Group>

              <Form.Group as={Col}>
                <Button
                  onClick={() => this.handleVerifyCod()}
                  variant="success"
                  type="button"
                >
                  Validar código
                </Button>
              </Form.Group>
            </>
          )}

        {this.obs.user_valid &&
          (
            <Link href="login" variant="body2">
              {"Ir para o Login"}
            </Link>
          )}
      </div>
    );
  }
}

export default observer(CadastroLogin);
