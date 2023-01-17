import { Button } from "@blueprintjs/core";
import * as Mui from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Form, ListGroup } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
const InputMask = require("react-input-mask");

const theme = createTheme({
  palette: {
    secondary: green,
  },
});

class CadastroNotPDF extends React.Component {
  constructor(props) {
    super(props);

    this.obs = observable({
      isLoading: props.loading,
      experiencia: [],
      empresa: "",
      ano: "",
      curso: "",
      data: "",
      formacao: [],
      instituicao: "",
      cargo: "",
    });

    this.cadastrar = props.cadastrar;

    this.curriculoForm = {
      cidade: "",
      ensinomedio: "",
      filhos: "Não",
      casado: "Não",
      idade: "N/A",
      rua: "N/A",
      cidade: "N/A",
      telefone: "N/A",
      telefone_fixo: "N/A",
      descricao: "N/A",
      fax: "N/A",
      nome: "N/A",
      cidade: "Bento Gonçalves",
      ensinomedio: "Não",
    };
  }

  handleAddExperiencia() {
    if (this.obs.empresa == "" || this.obs.ano == "" || this.obs.cargo == "") {
      return;
    }
    this.obs.experiencia.push({
      empresa: this.obs.empresa,
      ano: this.obs.ano,
      cargo: this.obs.cargo,
    });
    this.obs.ano = "";
    this.obs.empresa = "";
    this.obs.cargo = "";
  }

  handleAddFormacao() {
    if (
      this.obs.curso == "" || this.obs.data == "" || this.obs.instituicao == ""
    ) {
      return;
    }
    this.obs.formacao.push({
      curso: this.obs.curso,
      data: this.obs.data,
      instituicao: this.obs.instituicao,
    });
    this.obs.data = "";
    this.obs.curso = "";
    this.obs.instituicao = "";
  }

  handleGetFoto() {
    let formData = new FormData();

    this.obs.isLoading.bol = true;

    let file = document.querySelector("#file_foto");

    formData.append("id", uuidv4());
    formData.append("cidade", this.curriculoForm.cidade);
    formData.append("nome", this.curriculoForm.nome);
    formData.append(
      "telefone",
      this.curriculoForm.telefone
        ? this.curriculoForm.telefone.replace("(", "").replace(")", "").replace(
          "-",
          "",
        )
        : "",
    );
    formData.append(
      "telefone_fixo",
      this.curriculoForm.telefone_fixo
        ? this.curriculoForm.telefone_fixo.replace("(", "").replace(")", "")
          .replace("-", "")
        : "",
    );
    formData.append("ensinomedio", this.curriculoForm.ensinomedio);
    formData.append("rua", this.curriculoForm.rua);
    formData.append("idade", this.curriculoForm.idade);
    formData.append("filhos", this.curriculoForm.filhos);
    formData.append("casado", this.curriculoForm.casado);
    formData.append("descricao", this.curriculoForm.descricao);
    formData.append("experiencias", JSON.stringify(this.obs.experiencia));
    formData.append("formacoes", JSON.stringify(this.obs.formacao));
    formData.append("fax", this.curriculoForm.fax);
    formData.append(
      "foto_curriculo",
      file.files.length > 0 ? file.files[0] : "",
    );

    console.log(formData, "Data here");
    this.cadastrar(formData);
  }

  render() {
    return (
      <>
        <Form.Group>
          <Form.Label>Nome Completo (obrigatório)</Form.Label>
          <Form.Control
            onChange={(el) => this.curriculoForm.nome = el.target.value}
            id="titulo"
            type="titulo"
            placeholder="Nome"
          />
          <Form.Text className="text-muted">
            forneça seu nome para o cadastro
          </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>Idade (obrigatório)</Form.Label>
          <InputMask
            className="form-control"
            mask="99"
            onChange={(el) => this.curriculoForm.idade = el.target.value}
          />

          <Form.Text className="text-muted">
            forneça sua idade para o cadastro
          </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>Telefone Celular</Form.Label>
          <InputMask
            className="form-control"
            mask="(99)99999-9999"
            onChange={(el) => this.curriculoForm.telefone = el.target.value}
          />
          <Form.Text className="text-muted">
            forneça seu telefone para o cadastro
          </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>Telefone Fixo</Form.Label>
          <InputMask
            className="form-control"
            mask="(99)9999-9999"
            onChange={(el) =>
              this.curriculoForm.telefone_fixo = el.target.value}
          />
          <Form.Text className="text-muted">
            forneça seu telefone para o cadastro
          </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>Fax</Form.Label>
          <InputMask
            className="form-control"
            mask="+99-999-99999999"
            onChange={(el) => this.curriculoForm.fax = el.target.value}
          />
          <Form.Text className="text-muted">
            forneça seu fax para o cadastro
          </Form.Text>
        </Form.Group>

        <Form.Row>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

          <Form.Group>
            <Form.Check
              type="switch"
              id="filhos"
              label="Filhos ?"
              onChange={() =>
                this.curriculoForm.filhos =
                  $("#filhos").prop("checked").toString() === true
                    ? "Sim"
                    : "Não"}
            />
          </Form.Group>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

          <Form.Group>
            <Form.Check
              type="switch"
              id="casado"
              label="Casado ?"
              onChange={() =>
                this.curriculoForm.casado =
                  $("#casado").prop("checked").toString() === true
                    ? "Sim"
                    : "Não"}
            />
          </Form.Group>
        </Form.Row>

        <Form.Group>
          <Form.Label>Cidade: (obrigatório)</Form.Label>
          <Form.Control
            id="ramo"
            as="select"
            onChange={(el) => this.curriculoForm.cidade = el.target.value}
          >
            <option>Bento Gonçalves</option>
            <option>Garibaldi</option>
            <option>Carlos Barbosa</option>
            <option>Monte Belo do Sul</option>
            <option>Caxias do Sul</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Rua (obrigatório)</Form.Label>
          <Form.Control
            id="titulo"
            type="titulo"
            onChange={(el) => this.curriculoForm.rua = el.target.value}
            placeholder="rua"
          />
          <Form.Text className="text-muted">
            forneça sua Rua para o cadastro
          </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>Objetivo: (obrigatório)</Form.Label>
          <Form.Control
            id="descricao"
            as="textarea"
            onChange={(el) => this.curriculoForm.descricao = el.target.value}
            rows={3}
          />
          <Form.Text className="text-muted">
            máximo 100 caracteres
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label>Experiência Profissional</Form.Label>
          <Form.Row className="mb-4">
            <Form.Group>
              <Form.Control
                style={{ width: 300 }}
                value={this.obs.empresa}
                id="empresa"
                type="titulo"
                onChange={(el) => this.obs.empresa = el.target.value}
                placeholder="empresa"
              />
            </Form.Group>
            &nbsp;&nbsp;
            <Form.Group>
              <Form.Control
                style={{ width: 450 }}
                value={this.obs.cargo}
                id="cargo"
                type="titulo"
                onChange={(el) => this.obs.cargo = el.target.value}
                placeholder="cargo"
              />
            </Form.Group>
            &nbsp;&nbsp;
            <Form.Group>
              <InputMask
                value={this.obs.ano}
                className="form-control"
                mask="9999"
                onChange={(el) => this.obs.ano = el.target.value}
                placeholder="ano saída"
              />
            </Form.Group>
            &nbsp;&nbsp;
            <Form.Group>
              <Button
                className="mb-2"
                intent="success"
                onClick={() => this.handleAddExperiencia()}
                text="+"
              />
            </Form.Group>
          </Form.Row>
          <ListGroup variant="flush">
            {this.obs.experiencia.map((el, index) => {
              return (
                <ListGroup.Item id={index + Math.random}>
                  {el.empresa + " " + el.ano}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Form.Group>

        <Form.Group>
          <Form.Label>Formação Acadêmica</Form.Label>
          <Form.Row className="mb-4">
            <Form.Group>
              <Form.Control
                style={{ width: 300 }}
                value={this.obs.curso}
                id="curso"
                type="titulo"
                onChange={(el) => this.obs.curso = el.target.value}
                placeholder="curso"
              />
            </Form.Group>
            &nbsp;&nbsp;
            <Form.Group>
              <Form.Control
                style={{ width: 450 }}
                value={this.obs.instituicao}
                id="instituicao"
                type="titulo"
                onChange={(el) => this.obs.instituicao = el.target.value}
                placeholder="Instituição"
              />
            </Form.Group>
            &nbsp;&nbsp;
            <Form.Group>
              <InputMask
                value={this.obs.data}
                className="form-control"
                mask="9999"
                onChange={(el) => this.obs.data = el.target.value}
                placeholder="ano término"
              />
            </Form.Group>
            &nbsp;&nbsp;
            <Form.Group>
              <Button
                className="mb-2"
                intent="success"
                onClick={() => this.handleAddFormacao()}
                text="+"
              />
            </Form.Group>
          </Form.Row>
          <ListGroup variant="flush">
            {this.obs.formacao.map((el, index) => {
              return (
                <ListGroup.Item id={index + Math.random}>
                  {el.curso + " " + el.data}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Form.Group>

        <Form.Row>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

          <Form.Group>
            <Form.Check
              type="switch"
              id="ensinomedio"
              label="Ensimo médio completo ?"
              onChange={() =>
                this.curriculoForm.ensinomedio =
                  $("#ensinomedio").prop("checked").toString() === true
                    ? "Sim"
                    : "Não"}
            />
          </Form.Group>

          &nbsp;&nbsp;&nbsp;&nbsp;

          <Form.Group>
            <Form.File id="file_foto" style={{ display: "none" }} />

            <ThemeProvider theme={theme}>
              <Mui.Button
                size="small"
                variant="contained"
                color="secondary"
                endIcon={<CloudUploadIcon />}
                onClick={() => {
                  $("#file_foto").trigger("click");
                }}
              >
                Foto Currículo
              </Mui.Button>
            </ThemeProvider>
          </Form.Group>
        </Form.Row>

        {
          /* <Mui.Button className="mb-4" onClick={() => this.handleGetFoto()} variant="contained" color="primary">
                    Cadastrar
                </Mui.Button> */
        }

        <Button
          className="mb-4"
          loading={this.obs.isLoading.bol}
          intent="success"
          onClick={() => this.handleGetFoto()}
          text="Cadastrar curriculo"
        />
      </>
    );
  }
}

export default observer(CadastroNotPDF);
