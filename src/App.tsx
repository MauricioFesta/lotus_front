import React from "react";
import {
  BrowserRouter,
  Redirect,
  Route,
  Router,
  Switch,
} from "react-router-dom";
import Cadastro from "./components/curriculo/cadastro";
import Curriculo from "./components/curriculo/index";
import Home from "./components/home/index";
import {
  isAuthenticated,
  isAuthenticatedEmpresa,
  isAuthenticatedUser,
  isEmpresa,
} from "./components/login/auth";
import CadastroLogin from "./components/login/cadastro";
import Login from "./components/login/index";
import ResetPassword from "./components/login/password-reset";
import Navbar from "./components/navbar";
import NavbarEmpresa from "./components/navbar/index.empresa.js";
import Perfil from "./components/perfil";
import Politica from "./components/politica-privacidade";
import PostCreateEmpresa from "./components/postagens/create.empresa";
import PostEditEmpresa from "./components/postagens/edit.empresa";
import Postagens from "./components/postagens/index";
import PostagensEmpresa from "./components/postagens/index.empresa";
import UrlSupport from "./components/url-support";
import CandidatosEmpresa from "./components/vagas/candidatos.empresa";
import CreateEmpresa from "./components/vagas/create.empresa";
import Details from "./components/vagas/details";
import VagasEmpresaEditar from "./components/vagas/editar-cadastradas.empresa";
import Vagas from "./components/vagas/index";
import VagasFechadoEmpresa from "./components/vagas/index-fechado.empresa";
import VagasEmpresa from "./components/vagas/index.empresa";
import "./css/style.css";
import history from "./others/redirect";

const PrivateRouteUser = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticatedUser()
        ? (
          <>
            {isEmpresa()
              ? <NavbarEmpresa />
              : <Navbar />}

            <Component {...props} />
          </>
        )
        : <Redirect to={{ pathname: "/", state: { from: props.location } }} />}
  />
);

const PrivateRouteEmpresa = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticatedEmpresa()
        ? (
          <>
            {isEmpresa()
              ? <NavbarEmpresa />
              : <Navbar />}

            <Component {...props} />
          </>
        )
        : <Redirect to={{ pathname: "/", state: { from: props.location } }} />}
  />
);

const PrivateRouteAny = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated()
        ? (
          <>
            {isEmpresa()
              ? <NavbarEmpresa />
              : <Navbar />}

            <Component {...props} />
          </>
        )
        : <Redirect to={{ pathname: "/", state: { from: props.location } }} />}
  />
);

function App() {
  return (
    <>
      <BrowserRouter>
        <Router history={history}>
          <Switch>
            <Route path="/" component={Login} exact />
            <Route path="/login" component={Login} exact />
            <Route path="/cadastro" component={CadastroLogin} />
            <Route path="/redefinicao-senha" component={ResetPassword} />
            <Route path="/politica-privacidade" component={Politica} exact />
            <Route path="/url-support" component={UrlSupport} exact />
            <PrivateRouteAny path="/home" component={Home} />
            <PrivateRouteUser path="/vagas" exact component={Vagas} />
            <PrivateRouteEmpresa
              path="/vagas/cadastradas"
              exact
              component={VagasEmpresa}
            />
            <PrivateRouteEmpresa
              path="/vagas/cadastradas/fechado"
              component={VagasFechadoEmpresa}
            />
            <PrivateRouteEmpresa
              path="/vagas/cadastro"
              component={CreateEmpresa}
            />
            <PrivateRouteEmpresa
              path="/vagas/candidatos/:id"
              component={CandidatosEmpresa}
            />
            <PrivateRouteUser path="/curriculo" component={Curriculo} exact />
            <PrivateRouteUser path="/curriculo/cadastro" component={Cadastro} />
            <PrivateRouteUser path="/postagens" exact component={Postagens} />
            <PrivateRouteEmpresa
              path="/postagens/cadastro"
              component={PostCreateEmpresa}
            />
            <PrivateRouteEmpresa
              path="/postagens/editar"
              component={PostEditEmpresa}
            />
            <PrivateRouteEmpresa
              path="/postagens/view"
              component={PostagensEmpresa}
            />
            <PrivateRouteAny path="/perfil" exact component={Perfil} />
            <PrivateRouteAny path="/vaga-details" exact component={Details} />
            <PrivateRouteAny
              path="/vaga-edit"
              exact
              component={VagasEmpresaEditar}
            />
          </Switch>
        </Router>
      </BrowserRouter>
    </>
  );
}

export default App;
