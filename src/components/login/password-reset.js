import { Callout, Code, H5, Intent, Switch } from "@blueprintjs/core";
import { Spinner } from "@blueprintjs/core";
import { Example } from "@blueprintjs/docs-theme";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Button, Col, Container, Form, Modal } from "react-bootstrap";
import App from "../../App";
import { AppToaster } from "../../others/toaster";
import {
  handlePassWordCodigoValid,
  handleResetPassword,
  handleSendPasswordNew,
} from "../../stores/login/api";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.obs = observable({
      email: "",
      open_spinner: false,
      cod_email: 0,
      id: "",
      email: "",
      is_open_codigo: false,
      cod_input: 0,
      valid_codigo: false,
      new_password: "",
      codigo_front: "",
      token: "",
    });
  }

  async handleSendCodigo() {
    if (this.obs.email === "") {
      AppToaster.show({ message: "Preencha um email", intent: "warning" });

      this.obs.open_spinner = false;
      return;
    } else {
      this.obs.open_spinner = true;

      let res = await handleResetPassword(this.obs.email);

      if (res.data.exist) {
        this.obs.token = res.data.id_random;
        this.obs.email = res.data.email;
        this.obs.id = res.data.id;

        this.obs.open_spinner = false;
        this.obs.is_open_codigo = true;
        AppToaster.show({
          message: "Código enviado para o email",
          intent: "success",
        });
      } else {
        AppToaster.show({
          message: "Este email não existe cadastrado em nossa base de dados",
          intent: "danger",
        });

        this.obs.open_spinner = false;
        return;
      }
    }
  }

  async handleSendNewPassword() {
    this.obs.open_spinner = true;

    if (this.obs.new_password === "") {
      AppToaster.show({ message: "Preencha uma senha", intent: "warning" });

      this.obs.open_spinner = false;
      return;
    }

    let data = {
      password: this.obs.new_password,
      email: this.obs.email,
      id: this.obs.id,
      token: this.obs.token,
      cod_front: this.obs.codigo_front,
    };

    let res = await handleSendPasswordNew(data);

    if (res.data.ok) {
      AppToaster.show({
        message: "Senha alterada com sucesso",
        intent: "success",
      });
    } else {
      AppToaster.show({
        message: "Não foi possével alterar a senha, tente novamente mais tarde",
        intent: "danger",
      });
    }

    this.obs.open_spinner = false;
  }

  async handleValidaCodigo(el) {
    let data = {
      cod_front: this.obs.codigo_front,
      token: this.obs.token,
      email: this.obs.email,
      id: this.obs.id,
    };

    let resp = await handlePassWordCodigoValid(data);

    if (resp.data.confirmado) {
      this.obs.valid_codigo = true;
      AppToaster.show({ message: "Preencha a nova senha", intent: "success" });
    } else {
      this.obs.valid_codigo = false;
      AppToaster.show({
        message: "Código inválido, verifique e tente novamente",
        intent: "warning",
      });
    }
  }

  render() {
    const options = (
      <Form.Row className="mt-4">
        {!this.obs.is_open_codigo
          ? (
            <>
              <Form.Group as={Col}>
                <Form.Control
                  id="nome"
                  type="text"
                  onChange={(el) => this.obs.email = el.target.value}
                  placeholder="Entre com seu email"
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Button
                  onClick={() => this.handleSendCodigo()}
                  variant="success"
                  type="button"
                >
                  Enviar Código
                </Button>
              </Form.Group>
            </>
          )
          : this.obs.valid_codigo
          ? (
            <>
              <Form.Group as={Col}>
                <Form.Control
                  type="password"
                  value={this.obs.new_password}
                  onChange={(el) => this.obs.new_password = el.target.value}
                  placeholder="Entre com sua nova senha"
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Button
                  onClick={() => this.handleSendNewPassword()}
                  variant="success"
                  type="button"
                >
                  Alterar Senha
                </Button>
              </Form.Group>
            </>
          )
          : (
            <>
              <Form.Group as={Col}>
                <Form.Control
                  id="nome"
                  type="text"
                  value={this.obs.codigo_front}
                  onChange={(el) => this.obs.codigo_front = el.target.value}
                  placeholder="Entre com seu código"
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Button
                  onClick={() => this.handleValidaCodigo()}
                  variant="success"
                  type="button"
                >
                  Validar código
                </Button>
              </Form.Group>
            </>
          )}
      </Form.Row>
    );

    return (
      <Container className="mt-4">
        <Modal show={this.obs.open_spinner}>
          <Modal.Body>
            <Spinner size={80} value={null} />
          </Modal.Body>
        </Modal>

        <Example options={options} {...this.props}>
          <Callout title="Redefinição de senha">
            Para redefinir sua senha você precisa informar seu email e solicitar
            o envio do código. Você recebera o códido no email, após isso basta
            digita-lo no campo CÓDIGO e clicar em verificar, que será liberado
            após a confirmação do e-mail. Após a confirmação do mesmo iremos
            liberar o campo para preencher a nova senha, se caso algo der errado
            você pode reiniciar o processo.
          </Callout>
        </Example>
      </Container>
    );
  }
}

export default observer(ResetPassword);
