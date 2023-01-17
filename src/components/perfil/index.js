import { Button, Icon } from "@blueprintjs/core";
import React from "react";
import { Container, Figure, Form, Jumbotron, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { perfilForm, perfilQuery } from "../../actions";
import { perfilMODEL } from "../../model/perfil";
import { AppToaster } from "../../others/toaster";
import { Store } from "../../store";
import { putPerfil } from "../../stores/perfil/api";
import init, { get_perfil } from "../../wasm/pkg/wasm";
import { tokenMain } from "../login/auth";
import PerfilFoto from "./index.foto";

class Perfil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      perfilMODEL,
      retornoBanco: {},
      email: "",
      nome: "",
      senha: "",
      isLoading: false,
    };
  }

  async componentDidMount() {
    // let res = await getPerfil()

    let token = tokenMain();

    await init();

    let res = await get_perfil(token);

    Object.assign(perfilMODEL, res[0]);

    this.setState({ perfilMODEL: perfilMODEL });

    this.props.perfilQuery({ foto_base64: this.state.perfilMODEL.foto_base64 });
  }

  getMin() {
    let date = new Date();

    return date.getMinutes();
  }

  closeToasts() {
    this.setState({ close_msg: false });
  }

  alterarPerfil = async () => {
    let store = Store.getState();
    let formData = new FormData();

    if (store.perfilState.form.length > 0) {
      formData.append("foto_base64", store.perfilState.form[0]);
    }

    formData.append("nome", this.state.nome || this.state.perfilMODEL.nome);
    formData.append("senha", this.state.senha || this.state.perfilMODEL.senha);
    formData.append("email", this.state.email || this.state.perfilMODEL.email);

    this.setState({ isLoading: true });

    let res = await putPerfil(formData);

    if (res.data.Ok) {
      store.perfilState.form.length
        ? window.location.reload()
        : AppToaster.show({
          message: "Perfil alterado com sucesso!",
          intent: "success",
        });
    } else {
      AppToaster.show({
        message: "Não foi possível alterar o perfil",
        intent: "danger",
      });
    }

    this.setState({ isLoading: false });
  };

  render() {
    return (
      <div>
        <Jumbotron className="ml-4 mr-4 mt-4">
          <Row>
            <Form>
              <PerfilFoto />

              <Button
                loading={this.state.isLoading}
                small="true"
                intent="success"
                onClick={this.alterarPerfil}
                text="Salvar alterações"
              />
            </Form>

            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Form>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  defaultValue={this.state.perfilMODEL.email}
                  onChange={(e) => {}}
                  readOnly={true}
                  type="email"
                  placeholder="email"
                />
                <Form.Text className="text-muted">
                  Email de acesso
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  defaultValue={this.state.perfilMODEL.nome}
                  onChange={(e) => this.setState({ nome: e.target.value })}
                  type="text"
                  placeholder="nome"
                />
                <Form.Text className="text-muted">
                  Preencha seu nome de acesso
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formSenha">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  defaultValue={this.state.perfilMODEL.senha}
                  onChange={(e) => this.setState({ senha: e.target.value })}
                  placeholder="senha"
                />
                <Form.Text className="text-muted">
                  Preencha a senha de acesso
                </Form.Text>
              </Form.Group>
            </Form>
          </Row>
        </Jumbotron>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  query: store.perfilState.query,
  form: store.perfilState.form,
});
const mapDispatchToProps = dispatch =>
  bindActionCreators({ perfilForm, perfilQuery }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Perfil);
