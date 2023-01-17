import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import NotificationsIcon from "@material-ui/icons/Notifications";
import PageviewIcon from "@material-ui/icons/Pageview";
import SpeakerNotesIcon from "@material-ui/icons/SpeakerNotes";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import { Modal } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import Cookies from "universal-cookie";
import history from "../../others/redirect";
import { NotificacoesStore } from "../../stores/notificacoes";
import { VagasStore } from "../../stores/vagas";
import { idMaster } from "../login/auth";
import { tokenMain } from "../login/auth";
import socket from "../socket";
import "./css/index.css";
import Notificacoes from "./notificacoes/index";

const cookies = new Cookies();
require("./css/index.css");

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open_modal: false,
      vagas_length: 0,
      auth: true,
      anchorEl: null,
    };
  }

  async componentDidMount() {
    let channel = socket.channel("notify:open");

    channel.join()
      .receive("ok", resp => {
        console.log("Bem vindo", resp);
      })
      .receive("error", resp => {
        console.log("Error", resp);
      });

    channel.on("notify_send:" + idMaster(), payload => {
      console.log("Chegouuu das empresa");
      alert(payload.body);
    });
  }

  handleRedirect(path) {
    history.push(path);
  }

  handleSair() {
    cookies.remove("_A-T");
    cookies.remove("_A-T-T_L");
    cookies.remove("_lotus_key");
    window.token_lotus = "";

    this.handleRedirect("/");
  }

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    return (
      <>
        <Modal
          show={this.state.open_modal}
          onHide={() => this.setState({ open_modal: false })}
        >
          <Modal.Body>
            <Notificacoes />
          </Modal.Body>
        </Modal>

        <nav class="navbar navbar-icon-top navbar-expand-sm navbar-dark bg-color">
          <a class="navbar-brand" href="#">Lotus</a>

          {isMobile &&
            (
              <>
                <Tooltip title="Vagas navbar-toggler" aria-label="Vagas">
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    color="#F4F4F4"
                    onClick={this.handleMenu}
                  >
                    <MenuIcon style={{ color: "#F4F4F4" }} />
                  </IconButton>
                </Tooltip>

                <Menu
                  id="menu-appbar"
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(this.state.anchorEl)}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={() => this.handleRedirect("/vagas")}>
                    Vagas
                  </MenuItem>
                  <MenuItem onClick={() => this.handleRedirect("/curriculo")}>
                    Curriculo
                  </MenuItem>
                  <MenuItem onClick={() => this.handleRedirect("/postagens")}>
                    Postagens
                  </MenuItem>
                  <MenuItem onClick={() => this.handleRedirect("/perfil")}>
                    Perfil
                  </MenuItem>
                  {/* <MenuItem onClick={() => this.setState({ open_modal: true })}>Notificações</MenuItem> */}
                  <MenuItem onClick={() => this.handleSair()}>Sair</MenuItem>
                </Menu>
              </>
            )}

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
            </ul>

            <ul class="navbar-nav ">
              <Tooltip title="Vagas em Aberto" aria-label="Vagas em Aberto">
                <IconButton
                  onClick={() => this.handleRedirect("/vagas")}
                  color="#F4F4F4"
                >
                  <Badge
                    badgeContent={VagasStore.obs.vagas.length}
                    color="secondary"
                  >
                    <span className="name-navs-itens">
                      Vagas <PageviewIcon style={{ color: "#F4F4F4" }} />
                    </span>
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Meus Curriculos" aria-label="Meus Curriculos">
                <IconButton
                  onClick={() => this.handleRedirect("/curriculo")}
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="#F4F4F4"
                >
                  <span className="name-navs-itens">
                    Curriculos{" "}
                    <InsertDriveFileIcon style={{ color: "#F4F4F4" }} />
                  </span>
                </IconButton>
              </Tooltip>

              <Tooltip title="Ver Postagens" aria-label="Ver Postagens">
                <IconButton
                  onClick={() => this.handleRedirect("/postagens")}
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="#F4F4F4"
                >
                  <span className="name-navs-itens">
                    Posts <SpeakerNotesIcon style={{ color: "#F4F4F4" }} />
                  </span>
                </IconButton>
              </Tooltip>

              <Tooltip title="Ver Notificações" aria-label="Ver Notificações">
                <IconButton
                  onClick={() => this.setState({ open_modal: true })}
                  aria-label="show 11 new notifications"
                  color="inherit"
                >
                  <Badge
                    badgeContent={NotificacoesStore.obs.notificacoes.length}
                    color="secondary"
                  >
                    <span className="name-navs-itens">
                      Notificaçoes<NotificationsIcon
                        style={{ color: "#F4F4F4" }}
                      />
                    </span>
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Meu Perfil" aria-label="Meu Perfil">
                <IconButton
                  onClick={() => this.handleRedirect("/perfil")}
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="#F4F4F4"
                >
                  <span className="name-navs-itens">
                    Perfil <AccountCircle style={{ color: "#F4F4F4" }} />
                  </span>
                </IconButton>
              </Tooltip>

              <Tooltip title="Sair" aria-label="Sair">
                <IconButton
                  onClick={() => this.handleSair()}
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="#F4F4F4"
                >
                  <span className="name-navs-itens">
                    Sair <ExitToAppIcon style={{ color: "#F4F4F4" }} />
                  </span>
                </IconButton>
              </Tooltip>
            </ul>
          </div>
        </nav>
      </>
    );
  }
}
