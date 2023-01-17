import { Spinner } from "@blueprintjs/core";
import * as Mui from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import GetAppIcon from "@material-ui/icons/GetApp";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Modal } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Image } from "semantic-ui-react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Row,
} from "shards-react";
import { AppToaster } from "../../others/toaster";
import { SocketStore } from "../../stores/socket";
import {
  candidatoAprovar,
  candidatoDesaprovar,
  downloadCurriculoCandidato,
  listVagasEmpresaId,
} from "../../stores/vagas/api";
import init, { list_candidatos_vagas } from "../../wasm/pkg/wasm";
import { tokenMain } from "../login/auth";

const styleButomPrincipal = {
  color: "#32CD32",
};

class CandidatosEmpresa extends React.Component {
  constructor(props) {
    super(props);
    this.state = { candidatos: false };

    this.obs = observable({
      id_vaga: 0,
      open_spinner: false,
    });
  }

  async componentDidMount() {
    if (!SocketStore.obs.is_load) {
      SocketStore.load();
    }

    let url = window.location.pathname.split("/");

    this.obs.open_spinner = true;

    let token = tokenMain();

    await init();

    // let res = await listVagasEmpresaId(url[3])

    let res = await list_candidatos_vagas(url[3], token);

    this.obs.id_vaga = url[3];

    this.setState({ candidatos: res });

    this.obs.open_spinner = false;
  }

  render() {
    const confirmNotSelecionado = (id) => {
      confirmAlert({
        title: "Alerta",
        message: "Deseja remover este candidato ?",
        buttons: [
          {
            label: "Sim",
            onClick: () => {
              desaProvar(id);
            },
          },
          {
            label: "Não",
            onClick: () => {},
          },
        ],
      });
    };

    const confirmSelecionado = (id) => {
      confirmAlert({
        title: "Alerta",
        message: "Deseja selecionar este candidato",
        buttons: [
          {
            label: "Sim",
            onClick: () => {
              aprovar(id, true);
            },
          },
          {
            label: "Não",
            onClick: () => {},
          },
        ],
      });
    };

    async function download_Pdf(el) {
      let response = await downloadCurriculoCandidato(el);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "curriculo.pdf"); // or any other extension
      document.body.appendChild(link);
      link.click();
    }

    const validaSelecionado = (arr_vagas) => {
      return arr_vagas.indexOf(this.obs.id_vaga) === -1;
    };

    function tornarSelecionado(id) {
      return (
        <Mui.IconButton
          onClick={() => confirmSelecionado(id)}
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <CheckIcon />
        </Mui.IconButton>
      );
    }

    function candidatoSelecionado(id) {
      return (
        <Mui.IconButton
          style={styleButomPrincipal}
          onClick={() => confirmNotSelecionado(id)}
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <DoneAllIcon />
        </Mui.IconButton>
      );
    }

    const desaProvar = async (id) => {
      let data = {
        id_vaga: this.obs.id_vaga,
      };

      let res = await candidatoDesaprovar(id, data);

      if (res.data.Ok) {
        SocketStore.obs.channel_notfy.push("notify_send:" + id, {
          body:
            "Você foi desaprovado em uma vaga que estava apovada, :(, mas não fique triste melhores oportunidades virão!",
        });
        SocketStore.obs.channel_vagas.push("vagas_send:", {});
        this.componentDidMount();

        AppToaster.show({
          message: "Candidato desaprovado com sucesso",
          intent: "success",
        });
      } else {
        AppToaster.show({
          message: "Erro, tente novamente mais tarde",
          intent: "danger",
        });
      }
    };

    const aprovar = async (id, bol) => {
      let data = {
        boolean: bol,
        id_vaga: this.obs.id_vaga,
        id_user: id,
      };

      let res = await candidatoAprovar(id, data);

      if (res.data.Ok) {
        SocketStore.obs.channel_notfy.push("notify_send:" + id, {
          body:
            "Parabéns você foi aprovado em uma vaga, verifique na aba VAGA e filtre por aprovadas.",
        });
        SocketStore.obs.channel_vagas.push("vagas_send:", {});
        this.componentDidMount();

        AppToaster.show({
          message: "Candidato aprovado com sucesso",
          intent: "success",
        });
      } else {
        AppToaster.show({
          message: "Candidato já selecionado",
          intent: "warning",
        });
      }
    };

    function downloadFormatter(id) {
      return (
        <Mui.IconButton
          onClick={() => {
            download_Pdf(id);
          }}
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <GetAppIcon />
        </Mui.IconButton>
      );
    }

    return (
      <>
        <Modal show={this.obs.open_spinner}>
          <Modal.Body>
            <Spinner size={80} value={null} />
          </Modal.Body>
        </Modal>

        <div className="mt-4 ml-4 mr-4">
          <Container fluid className="main-content-container px-4">
            <Row>
              {this.state.candidatos &&
                this.state.candidatos.map((el, idx) => {
                  return (
                    <>
                      <Col lg="3" md="6" sm="12" className="mb-4" key={idx}>
                        <Card small className="card-post card-post--1">
                          <div
                            className={"card-post__image"}
                            style={{
                              backgroundImage: `url(${
                                "data:image/png;base64," + el.foto_base64
                              })`,
                            }}
                          >
                            <Badge
                              pill
                              className={`card-post__category bg-${"post.categoryTheme"}`}
                            >
                              {/* {post.ramo} */}
                            </Badge>
                            <div className="card-post__author d-flex">
                            </div>
                          </div>
                          <CardBody>
                            <h5 className="card-title">
                              <a href="#" className="text-fiord-blue">
                                {el.nome}
                              </a>
                            </h5>

                            {downloadFormatter(el.id)}
                            {validaSelecionado(el.vagas_aprovadas)
                              ? tornarSelecionado(el.id)
                              : candidatoSelecionado(el.id)}
                          </CardBody>
                        </Card>
                      </Col>
                    </>
                  );
                })}
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default observer(CandidatosEmpresa);
