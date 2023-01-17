import { Button } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import React from "react";
import { Alert, Col, Form, Jumbotron, Toast } from "react-bootstrap";
import IntlCurrencyInput from "react-intl-currency-input";
import { v4 as uuidv4 } from "uuid";
import { AppToaster } from "../../others/toaster";
import { postCadastroVaga } from "../../stores/vagas/api";
import socket from "../socket";

const currencyConfig = {
  locale: "pt-BR",
  formats: {
    number: {
      BRL: {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

export default class CreateEmpresa extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isLoading: false };
  }

  closeToasts() {
    this.setState({ close_msg: false });
  }

  getMin() {
    let date = new Date();

    return date.getMinutes();
  }

  cadastrar = async () => {
    let formData = new FormData();

    let file = document.querySelector("#file");
    const id = uuidv4();

    // formData.append("id", id);
    formData.append("file", file.files[0]);
    formData.append(
      "valor",
      $("#valor-vaga").val().slice(3).split(",")[0].replace(".", ""),
    );
    formData.append("titulo", $("#titulo").val());
    formData.append("descricao", $("#descricao").val());
    formData.append("cidade", $("#cidade").val());
    formData.append("turno", $("#turno").val());
    formData.append("estado", $("#estado").val());
    formData.append("ramo", $("#ramo").val());
    formData.append(
      "disponibilidade_viajar",
      $("#disponibilidade").prop("checked").toString(),
    );
    formData.append(
      "planejamento_futuro",
      $("#planejamento").prop("checked").toString(),
    );

    if (!file.files[0]) {
      AppToaster.show({
        message: "Precisa anexar a imagem para prosseguir",
        intent: "warning",
      });
      return;
    }

    let config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    this.setState({ isLoading: true });

    let res = await postCadastroVaga(formData, config);

    if (res.data.Ok) {
      AppToaster.show({
        message: "Vaga cadastrada com sucesso!",
        intent: "success",
      });

      let channel = socket.channel("vagas:open");

      channel.join()
        .receive("ok", resp => {
          console.log("Bem vindo", resp);
        })
        .receive("error", resp => {
          console.log("Error", resp);
        });

      channel.push("vagas_send:", {});
    } else {
      AppToaster.show({
        message: "Não foi possível cadastrar a vaga",
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
            <Form className="mt-4">
              <Form.Group>
                <Form.Label>Valor da vaga: (opcional)</Form.Label>
                <IntlCurrencyInput
                  id="valor-vaga"
                  className="form-control"
                  currency="BRL"
                  config={currencyConfig}
                  onChange={() => {}}
                />
                <Form.Text className="text-muted">
                  valor em R$
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label>Título (obrigatório)</Form.Label>
                <Form.Control id="titulo" type="titulo" placeholder="título" />
                <Form.Text className="text-muted">
                  forneça um título para o cadastro
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label>Descrição: (obrigatório)</Form.Label>
                <Form.Control id="descricao" as="textarea" rows={3} />
                <Form.Text className="text-muted">
                  uma pequena descrição máximo 100 caracteres
                </Form.Text>
              </Form.Group>

              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Turno: (obrigatório)</Form.Label>
                  <Form.Control id="turno" as="select" defaultValue="Choose...">
                    <option>Diurmo</option>
                    <option>Noturno</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Cidade: (obrigatório)</Form.Label>
                  <Form.Control
                    id="cidade"
                    as="select"
                    defaultValue="Choose..."
                  >
                    <option>Bento Gonçalves</option>
                    <option>Garibaldi</option>
                    <option>Carlos Barbosa</option>
                    <option>Monte Belo do Sul</option>
                    <option>Farroupilha</option>
                    <option>Caxias do Sul</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Estado: (obrigatório)</Form.Label>
                  <Form.Control
                    id="estado"
                    as="select"
                    defaultValue="Choose..."
                  >
                    <option>RS</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Ramo: (obrigatório)</Form.Label>
                  <Form.Control id="ramo" as="select" defaultValue="Choose...">
                    <option value="metalurgico">Metalúrgico</option>
                    <option value="comercio">Comércio</option>
                    <option value="alimentos">Alimentos</option>
                    <option value="outros">Outros</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.File id="file" label="Imagem da vaga (obrigatório)" />
                  <Form.Text className="text-muted">
                    esta imagem irá aparecer no cabeçalho da vaga
                  </Form.Text>
                </Form.Group>
              </Form.Row>

              <Form.Row style={{ marginLeft: 40 }}>
                <Form.Group as={Col}>
                  <Form.Check
                    type="switch"
                    id="disponibilidade"
                    label="Disponibilidade para viajar ?"
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Check
                    type="switch"
                    id="planejamento"
                    label="Planejamento Futuro ?"
                  />
                </Form.Group>
              </Form.Row>

              <Button
                loading={this.state.isLoading}
                intent="success"
                onClick={() => this.cadastrar()}
                text="Cadastrar vaga"
              />
            </Form>
          </Jumbotron>
        </div>
      </div>
    );
  }
}
