import { Button } from "@blueprintjs/core";
import { observable } from "mobx";
import { autorun, makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Col, Form, Jumbotron } from "react-bootstrap";
import IntlCurrencyInput from "react-intl-currency-input";
import history from "../../others/redirect";
import { AppToaster } from "../../others/toaster";
import { Store } from "../../store";
import { SocketStore } from "../../stores/socket";
import { updateVaga } from "../../stores/vagas/api";

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

class VagasEmpresaEditar extends React.Component {
  constructor(props) {
    super(props);

    this.obs = observable({
      vaga: Store.getState().vagasState.vaga_one,
      disable_all: false,
      valor_ref: Store.getState().vagasState.vaga_one.valor,
      isLoading: false,
    });

    console.log(this.obs.vaga, "Teste");

    autorun(() => {
      if (!this.obs.vaga.ativo) {
        AppToaster.show({
          message:
            "Ao desabilitar uma vaga, os candidatos serão automaticamente removidos.",
          intent: "warning",
        });
      }
    });
  }

  async componentDidMount() {
    if (!this.obs.vaga._id) {
      history.push("/vagas/cadastradas");
    }
  }

  handeDisabledVaga(check) {
    this.obs.disable_all = check;
    this.obs.vaga.ativo = !check;
  }

  async handleSendEditVaga() {
    if (!this.obs.vaga.valor && !this.obs.valor_ref) {
      AppToaster.show({
        message: "Preencha um valor válido",
        intent: "warning",
      });
      return;
    }

    this.obs.isLoading = true;

    if (typeof (this.obs.valor_ref) == "string") {
      this.obs.vaga.valor = this.obs.valor_ref.slice(3).replace(",", "").slice(
        0,
        -2,
      ).replace(".", "");
    }

    let formData = new FormData();

    let file = document.querySelector("#file");

    formData.append("_id", this.obs.vaga._id);
    formData.append("file", file.files[0]);
    formData.append("valor", this.obs.vaga.valor);
    formData.append("titulo", this.obs.vaga.titulo);
    formData.append("ativo", this.obs.vaga.ativo);
    formData.append("descricao", this.obs.vaga.descricao);
    formData.append("cidade", this.obs.vaga.cidade);
    formData.append("turno", this.obs.vaga.turno);
    formData.append("candidatos", this.obs.vaga.candidatos);
    formData.append("estado", "RS");
    formData.append("ramo", this.obs.vaga.ramo);
    formData.append("imagem_base64_old", this.obs.vaga.imagem_base64);
    formData.append("inserted_at", this.obs.vaga.inserted_at);
    formData.append(
      "disponibilidade_viajar",
      this.obs.vaga.disponibilidade_viajar,
    );
    formData.append("planejamento_futuro", this.obs.vaga.planejamento_futuro);

    let config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    let resp = await updateVaga(formData, config);

    if (resp.data.ok) {
      AppToaster.show({
        message: "Vaga alterada com sucesso!",
        intent: "success",
      });
      if (!SocketStore.obs.is_load) {
        SocketStore.load();
      }
      SocketStore.obs.channel_vagas.push("vagas_send:", {});
    } else {
      AppToaster.show({
        message: "Não foi possível alterar a vaga",
        intent: "danger",
      });
    }

    this.obs.isLoading = false;
  }

  render() {
    return (
      <div className="mt-4 ml-4 mr-4">
        <Jumbotron className="mt-4">
          <div className="container mt-4">
            <Form.Group>
              <Form.Check
                type="switch"
                id="jjbb"
                label="Desabilitar vaga"
                defaultChecked={!this.obs.vaga.ativo}
                onChange={(vl) => this.handeDisabledVaga(vl.target.checked)}
              />
            </Form.Group>

            <Form className="mt-4">
              <Form.Group>
                <Form.Label>Valor da vaga: (opcional)</Form.Label>
                <IntlCurrencyInput
                  disabled={this.obs.disable_all}
                  defaultValue={this.obs.valor_ref}
                  className="form-control"
                  currency="BRL"
                  config={currencyConfig}
                  onChange={(vl) => this.obs.valor_ref = vl.target.value}
                />
                <Form.Text className="text-muted">
                  valor em R$
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label>Título (obrigatório)</Form.Label>
                <Form.Control
                  disabled={this.obs.disable_all}
                  defaultValue={this.obs.vaga.titulo}
                  onChange={(vl) => this.obs.vaga.titulo = vl.target.value}
                  type="titulo"
                  placeholder="título"
                />
                <Form.Text className="text-muted">
                  forneça um título para o cadastro
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label>Descrição: (obrigatório)</Form.Label>
                <Form.Control
                  disabled={this.obs.disable_all}
                  defaultValue={this.obs.vaga.descricao}
                  onChange={(vl) => this.obs.vaga.descricao = vl.target.value}
                  as="textarea"
                  rows={3}
                />
                <Form.Text className="text-muted">
                  uma pequena descrição máximo 100 caracteres
                </Form.Text>
              </Form.Group>

              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Turno: (obrigatório)</Form.Label>
                  <Form.Control
                    disabled={this.obs.disable_all}
                    as="select"
                    onChange={(vl) => this.obs.vaga.turno = vl.target.value}
                    defaultValue="Choose..."
                  >
                    <option>{this.obs.vaga.turno}</option>
                    <option>Diurmo</option>
                    <option>Noturno</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Cidade: (obrigatório)</Form.Label>
                  <Form.Control
                    disabled={this.obs.disable_all}
                    as="select"
                    onChange={(vl) => this.obs.vaga.cidade = vl.target.value}
                    defaultVale="Choose..."
                  >
                    <option>{this.obs.vaga.cidade}</option>
                    <option>Bento Gonçalves</option>
                    <option>Garibaldi</option>
                    <option>Carlos Barbosa</option>
                    <option>Monte Belo</option>
                    <option>Monte Belo do Sul</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Estado: (obrigatório)</Form.Label>
                  <Form.Control
                    disabled={this.obs.disable_all}
                    as="select"
                    defaultValue="Choose..."
                  >
                    <option>RS</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Ramo: (obrigatório)</Form.Label>
                  <Form.Control
                    disabled={this.obs.disable_all}
                    onChange={(vl) => this.obs.vaga.ramo = vl.target.value}
                    as="select"
                    defaultValue="Choose..."
                  >
                    <option>{this.obs.vaga.ramo}</option>
                    <option value="metalurgico">Metalúrgico</option>
                    <option value="comercio">Comércio</option>
                    <option value="alimentos">Alimentos</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.File
                    disabled={this.obs.disable_all}
                    id="file"
                    label="Imagem da vaga (obrigatório)"
                  />
                  <Form.Text className="text-muted">
                    esta imagem irá aparecer no cabeçalho da vaga
                  </Form.Text>
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group>
                  <Form.Check
                    disabled={this.obs.disable_all}
                    type="switch"
                    id="disponibilidade"
                    label="Disponibilidade para viajar ?"
                    defaultChecked={this.obs.vaga.disponibilidade_viajar}
                    onChange={(vl) =>
                      this.obs.vaga.disponibilidade_viajar = vl.target.checked}
                  />
                </Form.Group>

                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

                <Form.Group>
                  <Form.Check
                    disabled={this.obs.disable_all}
                    type="switch"
                    id="planejamento"
                    defaultChecked={this.obs.vaga.planejamento_futuro}
                    onChange={(vl) =>
                      this.obs.vaga.planejamento_futuro = vl.target.checked}
                    label="Planejamento Futuro ?"
                  />
                </Form.Group>
              </Form.Row>

              <Button
                loading={this.obs.isLoading}
                intent="success"
                onClick={() => this.handleSendEditVaga()}
                text="Alterar Cadastro"
              />
            </Form>
          </div>
        </Jumbotron>
      </div>
    );
  }
}

export default observer(VagasEmpresaEditar);
