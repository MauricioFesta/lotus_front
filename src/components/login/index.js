import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import MuiAlert from "@material-ui/lab/Alert";
import $ from "jquery";
import React from "react";
import Cookies from "universal-cookie";
import history from "../../others/redirect";
import { AppToaster } from "../../others/toaster";
import { getUser } from "../../stores/login/api";

const cookies = new Cookies();
var jwt = require("jsonwebtoken");

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="lotus">
        Lotus
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(images/logo-back.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundColor: theme.palette.type === "light"
      ? theme.palette.grey[50]
      : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login_view(props) {
  const classes = useStyles();
  const [type_password, onChangeType] = React.useState("password");

  function handleVisualizarSenha(e) {
    onChangeType(type_password == "text" ? "password" : "text");
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Entrar
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type={type_password}
              id="senha"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  onChange={(e) => handleVisualizarSenha(e)}
                  color="primary"
                />
              }
              label="Visualizar senha"
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              id="btnLogin"
              className={classes.submit}
              onClick={props.validaLogin}
            >
              Entrar
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/redefinicao-senha" variant="body2">
                  Esqueceu a senha?
                </Link>
              </Grid>
              <Grid item>
                <Link href="cadastro" variant="body2">
                  {"Não tenho conta ainda ? Cadastre-se"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.validaLogin = this.validaLogin = this.validaLogin.bind(this);
  }

  componentDidMount() {
    $(document.body).on("keypress", function(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        $("#btnLogin").trigger("click");
      }
    });
  }

  async validaLogin() {
    let data = {
      email: $("#email").val(),
      senha: $("#senha").val(),
    };

    let res = await getUser(data);

    if (res.data.Ok) {
      if (!res.data.verificado) {
        AppToaster.show({
          message:
            "Email não foi confirmado, se não tiver mais o código podera gerar outro cadastro somente daqui 2 horas",
          intent: "danger",
        });

        return;
      }

      const secret = "nSU&RSwGk3Yq@hM2g%LeU@1lFvSc1fnyG$l1Keqf8&W&xZKl&H";

      var token = jwt.sign(
        { logged: true, id: res.data.id, is_empresa: res.data.is_empresa },
        secret,
        { expiresIn: "1h" },
      );

      cookies.set("_A-T", res.data.token);
      cookies.set("_A-T-T_L", token);

      if (!res.data.is_empresa) {
        // history.push("/vagas")
        window.location.href = "/vagas";
      } else {
        // history.push("/vagas/cadastradas")
        window.location.href = "/vagas/cadastradas";
      }
    } else {
      this.setState({ isOpen: true });
    }
  }

  render() {
    function Alert(props) {
      return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    return (
      <>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={this.state.isOpen}
          autoHideDuration={6000}
          onClose={() => this.setState({ isOpen: false })}
        >
          <Alert
            onClose={() => this.setState({ isOpen: false })}
            severity="warning"
          >
            Email ou senha incorretos
          </Alert>
        </Snackbar>
        <Login_view validaLogin={this.validaLogin} />
      </>
    );
  }
}
