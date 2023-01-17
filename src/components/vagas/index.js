import { Spinner } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import * as Mui from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import DeleteIcon from "@material-ui/icons/Delete";
import SendIcon from "@material-ui/icons/Send";
import Alert from "@material-ui/lab/Alert";
import "bootstrap/dist/css/bootstrap.min.css";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { CardDeck, Form, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
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
import { v4 as uuidv4 } from "uuid";
import { vagaView } from "../../actions";
import history from "../../others/redirect";
import { AppToaster } from "../../others/toaster";
import { getCurriculo } from "../../stores/curriculo/api";
import { insert_message } from "../../stores/nav/api";
import { NotificacoesStore } from "../../stores/notificacoes";
import { VagasStore } from "../../stores/vagas";
import { listVagas, listVagasAprovadas } from "../../stores/vagas/api";
import {
  deleteCandidatarseVaga,
  postCandidatarseVaga,
} from "../../stores/vagas/api";
import { allEmpresas } from "../../stores/vagas/api";
import init, {
  get_curriculos,
  get_length_vagas,
  get_perfil,
  get_vagas,
} from "../../wasm/pkg/wasm";
import { idMaster, tokenMain } from "../login/auth";
import socket from "../socket";
import Empresa from "./filters/empresa";
import Ramo from "./filters/ramo";
// import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Pagination from "@material-ui/lab/Pagination";
import {
  addResponseMessage,
  addUserMessage,
  deleteMessages,
  setBadgeCount,
  Widget,
} from "react-chat-widget";
import "react-chat-widget/lib/styles.css";

const id_master = idMaster();

require("./css/index.css");

class Vagas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vagas: [],
      qtdline: 0,
      variant: "primary",
      text: "null",
      activePage: 15,
    };
    this.teste = 10;

    this.obs = observable({
      candidato_vagas: [],
      is_curriculo: false,
      data_empresas: [],
      open_spinner: false,
      principal_curriculo: false,
      vagas: [],
      total_vagas: 0,
      open_chat: false,
      logo: "",
      channel_chat: null,
      empresa_id: "",
      perfil: { nome: "", foto_base64: "" },
    });
  }

  async componentDidMount() {
    if (tokenMain()) {
      let channel_chat_open = socket.channel("chat:open");

      channel_chat_open.join()
        .receive("ok", resp => {
          console.log("Bem vindo ao Chat", resp);
        })
        .receive("error", resp => {
          console.log("Error Chat", resp);
        });

      channel_chat_open.on("chat_send:" + idMaster(), payload => {
        addResponseMessage(payload.body.text);
      });

      this.obs.channel_chat = channel_chat_open;
    }

    let token = tokenMain();

    await init();

    let total = await get_length_vagas(token);

    this.obs.total_vagas = Math.floor(total.count / 10);

    this.getVagas();
    let res = await allEmpresas();

    this.obs.data_empresas = res.data;

    let resp = await get_perfil(token);

    this.obs.perfil = resp[0];
  }

  handleRedirect(path, vaga) {
    this.props.vagaView({ ...vaga });
    history.push(path);
  }

  async handleChat(id) {
    this.obs.empresa_id = id;

    console.log(
      this.obs.empresa_id == "d508e1d5-c12d-4bb7-81f2-4ee3b97cacc3",
      "sssssss",
    );

    deleteMessages();
    await VagasStore.handleGetChat(id, idMaster());

    this.obs.open_chat = true;

    if (VagasStore.obs.chat_msg.length) {
      this.obs.logo = VagasStore.obs.chat_msg[0].user.avatar;
      console.log(VagasStore.obs.chat_msg, "Mensagens");

      VagasStore.obs.chat_msg.map(el => {
        if (el.user._id == 1) {
          addUserMessage(el.text);
        } else {
          addResponseMessage(el.text);
        }
      });

      setBadgeCount(0);
    }
  }

  getVagas = async (new_data) => {
    this.obs.open_spinner = true;

    let token = tokenMain();

    // let res = await listVagas()
    await init();
    let res = await get_vagas(token, 10, 0);

    // await VagasStore.handleGetVagas()

    // let res = VagasStore.obs.vagas

    listVagasAprovadas().then(result => {
      if (Array.isArray(result.data)) {
        this.obs.candidato_vagas = [...result.data[0].vagas_aprovadas];
      }
    });

    get_curriculos(token).then(result => {
      this.obs.principal_curriculo = false;

      if (result.length > 0) {
        this.obs.is_curriculo = true;
      }

      for (let i = 0; i < result.length; i++) {
        if (result[i].principal) {
          this.obs.principal_curriculo = true;
          break;
        }
      }
    });

    // getCurriculo().then(result => {

    //     this.obs.principal_curriculo = false

    //     if (result.data.length > 0) {
    //         this.obs.is_curriculo = true
    //     }

    //     for (let i = 0; i < result.data.length; i++) {

    //         if (result.data[i].principal) {

    //             this.obs.principal_curriculo = true
    //             break

    //         }

    //     }

    // })

    if (new_data) {
      res = new_data;
    }

    this.handleSetVagas(res);
  };

  handleSetVagas(res) {
    let tmp = 0, array = [], array2 = [];

    if (Array.isArray(res)) {
      this.obs.vagas = res;

      res.map(el => {
        if (tmp === 5) {
          array2.push(array);
          array = [];
          tmp = 0;
        }
        array.push(el);
        tmp++;
      });

      if (res.length < 5) {
        array2.push(array);
      }

      this.setState({ vagas: array2 });
    }

    this.obs.open_spinner = false;
  }

  async candidatarSeVaga(id, empresa_id) {
    if (!this.obs.is_curriculo) {
      AppToaster.show({
        message: "Você precia ter um currículo cadastrado para se candidatar",
        intent: "warning",
      });
      return;
    }

    if (!this.obs.principal_curriculo) {
      AppToaster.show({
        message:
          "Você precia por um curriculo como principal, para se candidatar",
        intent: "warning",
      });
      return;
    }

    let channel = socket.channel("notify:open");

    channel.join()
      .receive("ok", resp => {
        console.log("Bem vindo", resp);
      })
      .receive("error", resp => {
        console.log("Error", resp);
      });

    let data = {
      id,
      empresa_id,
    };

    let res = await postCandidatarseVaga(data);

    if (res.data.Ok) {
      channel.push("notify_send:" + empresa_id, {
        body: "Candidado se cadastrou na vaga, verifique...",
      });

      AppToaster.show({
        message: "Candidatura enviada com sucesso",
        intent: "success",
      });
      this.componentDidMount();
    } else if (res.data.erro) {
      AppToaster.show({
        message: `Não foi possível, error: ${res.data.erro}`,
        intent: "warning",
      });
    } else {
      AppToaster.show({
        message: "Error, tente novamente mais tarde",
        intent: "danger",
      });
    }
  }

  async excluirCandidaturaVaga(id_vaga) {
    let res = await deleteCandidatarseVaga(id_vaga);
    if (res.data.Ok) {
      AppToaster.show({
        message: "Candidatura retirada com sucesso",
        intent: "success",
      });
      this.componentDidMount();
    } else {
      AppToaster.show({
        message: "Error, tente novamente mais tarde",
        intent: "danger",
      });
    }
  }

  handleValidaCandidato(arrCandidatos) {
    return arrCandidatos.indexOf(id_master) === -1;
  }

  handleCandidatoAprovado(id) {
    return this.obs.candidato_vagas.indexOf(id) === -1;
  }

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({ activePage: pageNumber });
  }
  handleNewUserMessage = async (msg) => {
    const message = {
      "message": {
        "_id": uuidv4(),
        "createdAt": new Date(),
        "text": msg,
        "user": { "_id": 1 },
      },
      "user_id": idMaster(),
      "empresa_id": this.obs.empresa_id,
    };

    let message_send = {
      _id: uuidv4(),
      text: msg,
      createdAt: new Date(),
      user: {
        _id: uuidv4(),
        name: "Teste",
        avatar: "data:image/png;base64," + this.state.foto_base64,
      },
    };

    insert_message(message).then(res => {
    }).catch(err => {
      console.log(err);
    });

    this.obs.channel_chat.push("chat_send:" + this.obs.empresa_id, {
      body: msg,
      id: idMaster(),
      avatar: this.obs.perfil.foto_base64,
      nome: this.obs.perfil.nome,
      empresa_id: this.obs.empresa_id,
    });
  };

  async handleChangePagination(page) {
    this.obs.open_spinner = true;

    let token = tokenMain();

    let res = await get_vagas(token, 10, page);

    this.handleSetVagas(res);
  }

  render() {
    return (
      <>
        {this.obs.open_chat &&
          (
            <Widget
              profileAvatar={this.obs.logo}
              title="Chat Empresas"
              subtitle="Esclarecimentos de dúvidas"
              handleNewUserMessage={this.handleNewUserMessage}
              emojis={true}
              id={1}
            />
          )}

        <Modal show={this.obs.open_spinner}>
          <Modal.Body>
            <Spinner size={80} value={null} />
          </Modal.Body>
        </Modal>

        <Form className="mt-4">
          <Form.Row>
            {
              /* <Col>
                                <Form.Group as={Col} controlId="formSetor">

                                    <Ramo empresas={this.obs.data_empresas} getVagas={this.getVagas} />

                                </Form.Group>
                            </Col> */
            }
            <Col>
              <Form.Group as={Col} controlId="formSetor">
                <Empresa
                  empresas={this.obs.data_empresas}
                  getVagas={this.getVagas}
                />
              </Form.Group>
            </Col>
            {
              /* <Col>
                                <Form.Group as={Col} controlId="formLocation">

                                    <Form.Label>Endereço</Form.Label>

                                    <FilterLocation size="small" />
                                    <Form.Text className="text-muted">
                                        Selecione estado ou cidade para o filtro.
                                    </Form.Text>

                                </Form.Group>
                            </Col> */
            }
          </Form.Row>
        </Form>

        <Container fluid className="main-content-container px-4">
          <Row>
            {this.state.vagas.map((el, index) => {
              return (
                <>
                  <Row noGutters className="page-header py-4">
                    {/* <PageTitle sm="4" title="Blog Posts" subtitle="Components" className="text-sm-left" /> */}
                  </Row>

                  {this.obs.vagas.map((post, idx) => (
                    <Col lg="3" md="6" sm="12" className="mb-4" key={post._id}>
                      <Card small className="card-post card-post--1">
                        {!this.handleCandidatoAprovado(post._id) &&
                          (
                            <Alert
                              variant="filled"
                              className="mt-2 mb-2 ml-2 mr-2"
                              severity="success"
                            >
                              Parabéns você foi selecionado para esta vaga,
                              aguarde o contato da empresa. E boa sorte :)
                            </Alert>
                          )}
                        <div
                          className={this.handleValidaCandidato(post.candidatos)
                            ? "card-post__image"
                            : "card-post__image candidatura-enviada"}
                          style={{
                            backgroundImage: `url(${
                              "data:image/png;base64," + post.imagem_base64
                            })`,
                          }}
                        >
                          <Badge
                            pill
                            className={`card-post__category bg-${"post.categoryTheme"}`}
                          >
                            {post.ramo}
                          </Badge>
                          <div className="card-post__author d-flex">
                            <a
                              href="#"
                              className="card-post__author-avatar card-post__author-avatar--small"
                              style={{
                                backgroundImage: `url('${post.authorAvatar}')`,
                              }}
                            >
                              Written by {"post.author"}
                            </a>
                          </div>
                        </div>
                        <CardBody>
                          <h5 className="card-title">
                            <a href="#" className="text-fiord-blue">
                              {post.titulo}
                            </a>
                          </h5>
                          <p className="card-text d-inline-block mb-3">
                            {post.descricao.slice(0, 180) + "..."}
                          </p>
                          {this.handleValidaCandidato(post.candidatos)
                            ? (
                              <Mui.Button
                                size="small"
                                variant="contained"
                                color="primary"
                                endIcon={<SendIcon />}
                                onClick={() =>
                                  this.candidatarSeVaga(
                                    post._id,
                                    post.empresa_id,
                                  )}
                              >
                                Candidatar-se
                              </Mui.Button>
                            )
                            : this.handleCandidatoAprovado(post.id) &&
                              (
                                <Mui.Button
                                  size="small"
                                  variant="contained"
                                  color="secondary"
                                  endIcon={<DeleteIcon />}
                                  onClick={() =>
                                    this.excluirCandidaturaVaga(post._id)}
                                >
                                  Excluir
                                </Mui.Button>
                              )}

                          &nbsp;
                          <Mui.Button
                            size="small"
                            variant="contained"
                            color="primary"
                            endIcon={<ChatIcon />}
                            onClick={() =>
                              this.handleChat(post.empresa_id)}
                          >
                            Chat
                          </Mui.Button>

                          &nbsp;
                          <Mui.IconButton
                            size="small"
                            onClick={() =>
                              this.handleRedirect("/vaga-details", post)}
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                          >
                            Mais
                          </Mui.IconButton>

                          {
                            /* <Mui.Button
                                                        size="small"
                                                        variant="contained"
                                                        color="primary"
                                                        endIcon={<SendIcon />}

                                                    >
                                                        Teste
                                                    </Mui.Button> */
                          }
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </>
              );
            })}
          </Row>

          <Form className="footer-pagination">
            <Form.Group>
              <Pagination
                count={this.obs.total_vagas}
                onChange={(event, value) =>
                  this.handleChangePagination(value - 1)}
                variant="outlined"
                color="primary"
              />
            </Form.Group>
          </Form>
        </Container>
      </>
    );
  }
}

const mapStateToProps = store => ({
  vaga_one: store.vagasState.vaga_one,
});
const mapDispatchToProps = dispatch =>
  bindActionCreators({ vagaView }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(observer(Vagas));
