import { Spinner } from "@blueprintjs/core";
import * as Mui from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import GetAppIcon from "@material-ui/icons/GetApp";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Alert, Jumbotron, Modal } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Link } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
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
import { perfil_image_default } from "../../others/global_values";
import { AppToaster } from "../../others/toaster";
import {
  getCurriculo,
  getDownload,
  postExcluir,
  setPrincipal,
} from "../../stores/curriculo/api";
import init, { get_curriculos } from "../../wasm/pkg/wasm";
import { tokenMain } from "../login/auth";

require("./css/style.scss");

const styleButomDelete = {
  color: "#ff5252",
};

const styleButomPrincipal = {
  color: "#32CD32",
};

export default class Curriculo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showItems: false,
      dataCurriculo: [],
      variant: "primary",
      msg_text: "",
      msg_title: "",
      close_msg: false,
      open_spinner: false,
    };
  }

  async componentDidMount() {
    this.setState({ open_spinner: true });

    await init();

    let token = tokenMain();

    let res = await get_curriculos(token);

    if (res.length > 0) {
      this.setState({ showItems: true, dataCurriculo: res });
    }

    this.setState({ open_spinner: false });
  }

  render() {
    const confirmExcluirCurriculo = (id) => {
      confirmAlert({
        title: "Alerta",
        message: "Deseja excluir este Currículo ?",
        buttons: [
          {
            label: "Sim",
            onClick: () => excluir_Pdf(id),
          },
          {
            label: "Não",
            onClick: () => {},
          },
        ],
      });
    };

    const confirmPrincipal = (id) => {
      confirmAlert({
        title: "Currículo",
        message: "Deseja tornar este como principal ?",
        buttons: [
          {
            label: "Sim",
            onClick: () => tornar_principal(id, true),
          },
          {
            label: "Não",
            onClick: () => console.log("No"),
          },
        ],
      });
    };

    const confirmNotPrincipal = (id) => {
      confirmAlert({
        title: "Currículo",
        message: "Deseja remover este como principal ?",
        buttons: [
          {
            label: "Sim",
            onClick: () => tornar_principal(id, false),
          },
          {
            label: "Não",
            onClick: () => console.log("No"),
          },
        ],
      });
    };

    const excluir_Pdf = async (el) => {
      let res = await postExcluir(el);

      if (res.data === "Ok") {
        AppToaster.show({
          message: "Curriculo deletado com sucesso",
          intent: "success",
        });
        this.componentDidMount();
      }
    };
    async function download_Pdf(el) {
      let response = await getDownload(el);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "curriculo.pdf"); // or any other extension
      document.body.appendChild(link);
      link.click();
    }

    const tornar_principal = async (id, bol) => {
      let data = {
        boolean: bol,
      };

      let res = await setPrincipal(id, data);

      if (res.data === "Ok") {
        AppToaster.show({
          message: "Prioridade alterada com sucesso",
          intent: "success",
        });
        this.componentDidMount();
      } else {
        AppToaster.show({
          message: "Não foi possível alterar a prioridade",
          intent: "warning",
        });
      }
    };

    function tornarPrincipal(id) {
      return (
        <Mui.IconButton
          onClick={() => confirmPrincipal(id)}
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <CheckIcon />
        </Mui.IconButton>
      );
    }

    function curriculoPrincipal(id) {
      return (
        <Mui.IconButton
          style={styleButomPrincipal}
          onClick={() => confirmNotPrincipal(id)}
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <DoneAllIcon />
        </Mui.IconButton>
      );
    }

    function excluirFormatter(id) {
      return (
        <Mui.IconButton
          style={styleButomDelete}
          onClick={() => {
            confirmExcluirCurriculo(id);
          }}
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <DeleteIcon />
        </Mui.IconButton>
      );
    }

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
        <Modal show={this.state.open_spinner}>
          <Modal.Body>
            <Spinner size={80} value={null} />
          </Modal.Body>
        </Modal>

        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4">
            <Link className="mb-6" to="curriculo/cadastro">
              Cadastrar Currículo
            </Link>
          </Row>

          <Row>
            {this.state.dataCurriculo.map((el, idx) => {
              return (
                <Col lg="3" md="6" sm="12" className="mb-4" key={idx}>
                  <Card small className="card-post card-post--1">
                    <div
                      className={"card-post__image"}
                      style={{
                        backgroundImage: `url(${
                          el.image_base64 === "" || !el.image_base64
                            ? perfil_image_default
                            : "data:image/jpeg;base64," + el.image_base64
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
                          {/* {post.titulo} */}
                        </a>
                      </h5>
                      <p className="card-text d-inline-block mb-3">
                        {el.descricao && el.descricao.slice(0, 180) + "..."}
                      </p>
                      <br />
                      {downloadFormatter(el.id)}
                      {excluirFormatter(el.id)}
                      {el.principal
                        ? curriculoPrincipal(el.id)
                        : tornarPrincipal(el.id)}
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </>
    );
  }
}
