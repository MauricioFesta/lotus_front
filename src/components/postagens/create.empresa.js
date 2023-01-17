import { Button } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import $, { param } from "jquery";
import React from "react";
import { Form, Jumbotron } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { AppToaster } from "../../others/toaster";
import { postCreatePostagem } from "../../stores/postagens/api";
import NavbarEmpresa from "../navbar/index.empresa";

export default class PostCreateEmpresa extends React.Component {
  constructor(props) {
    super(props);
    this.state = { image: "/images/alert-sucsses.gif", isLoading: false };
  }

  getMin() {
    let date = new Date();

    return date.getMinutes();
  }

  cadastrar = async () => {
    let descricao = $("#descricao").val();

    let params = {
      id: uuidv4(),
      descricao,
    };

    this.setState({ isLoading: true });

    let res = await postCreatePostagem(params);

    if (res.data.Ok) {
      AppToaster.show({
        message: "Postagem cadastrada com sucesso!",
        intent: "success",
      });
    } else {
      AppToaster.show({
        message: "Não foi possível, tente novamente mais tarde",
        intent: "danger",
      });
    }

    this.setState({ isLoading: false });
  };

  render() {
    return (
      <div>
        <div className="container mt-4">
          <Jumbotron className="mt-4">
            <Form>
              <Form.Group>
                <Form.Label>Descrição: (obrigatório)</Form.Label>
                <Form.Control id="descricao" as="textarea" rows={3} />
              </Form.Group>

              <Button
                loading={this.state.isLoading}
                intent="success"
                onClick={() => this.cadastrar()}
                text="Cadastrar"
              />
            </Form>
          </Jumbotron>
        </div>
      </div>
    );
  }
}
