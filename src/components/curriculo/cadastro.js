import * as Mui from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Button, Col, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { AppToaster } from "../../others/toaster";
import { postCurriculo, postCurriculoForm } from "../../stores/curriculo/api";
import init, { get_curriculos } from "../../wasm/pkg/wasm";
import { idMaster } from "../login/auth";
import Navbar from "../navbar/index";
import socket from "../socket";
import CadastroNotPDF from "./cadastro_not_pdf";

class Cadastro extends React.Component {
  constructor(props) {
    super(props);

    this.obs = observable({
      isLoading: { bol: false },
    });

    this.cadastrar = this.cadastrar.bind(this);
  }

  cadastrar = async (form) => {
    let res;

    let formData = new FormData();

    let file = document.querySelector("#file");

    if (file.files.length > 0) {
      formData.append("id", uuidv4());
      formData.append("principal", true);
      formData.append("file", file.files[0]);
      formData.append("descricao", $("#curriculotext").val());

      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      let json = {
        formData,
        config,
      };

      res = await postCurriculo(json);
    } else {
      res = await postCurriculoForm(form);
    }

    if (res.status === 200) {
      AppToaster.show({
        message: "Currículo cadastrada com sucesso!",
        intent: "success",
      });

      let channel = socket.channel("curriculo:open");

      channel.join()
        .receive("ok", resp => {
          console.log("Socket curriculo", resp);
        })
        .receive("error", resp => {
          console.log("Error Socket curriculo", resp);
        });

      channel.push("curriculo_send:" + idMaster(), {});

      channel.on("curriculo_send:" + idMaster(), payload => {
        console.log(idMaster(), "id master");
        console.log("Curriculo socket");
      });
    } else {
      AppToaster.show({
        message: "Não foi possível cadastrar o currículo",
        intent: "danger",
      });
    }

    this.obs.isLoading.bol = false;
  };

  getMin() {
    let date = new Date();

    return date.getMinutes();
  }

  render() {
    return (
      <>
        <Form id="form-curriculo" className="container mt-4 mb-4">
          <Form.Group>
            <Form.File
              id="file"
              label="Curriculo"
              style={{ display: "none" }}
            />
          </Form.Group>

          <Form.Group>
            <Mui.Button
              size="small"
              variant="contained"
              color="primary"
              endIcon={<CloudUploadIcon />}
              onClick={() => {
                $("#file").trigger("click");
              }}
            >
              Currículo (ex: pdf, doc, docx)
            </Mui.Button>
          </Form.Group>

          <CadastroNotPDF
            loading={this.obs.isLoading}
            cadastrar={this.cadastrar}
          />
        </Form>
      </>
    );
  }
}

export default observer(Cadastro);
