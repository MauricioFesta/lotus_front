import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import * as Mui from "@material-ui/core";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Figure } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { perfilForm } from "../../actions";
import { Store } from "../../store";

const useStyles = Mui.makeStyles((theme) => ({
  large: {
    width: theme.spacing(26),
    height: theme.spacing(26),
  },
}));

export function ImagePerfil(props) {
  const classes = useStyles();

  return (
    <Mui.Avatar alt="Remy Sharp" src={props.image} className={classes.large} />
  );
}

class PerfilFoto extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Figure>
          <ImagePerfil
            image={Store.getState().perfilState.query.foto_base64
              ? "data:image/png;base64," +
                Store.getState().perfilState.query.foto_base64
              : "images/perfil-avatar.jpg"}
          />
          <Figure.Caption>
            <Form.File
              onChange={(e) => this.props.perfilForm(e.target.files)}
              id="file"
              label="Alterar foto"
            />
          </Figure.Caption>
        </Figure>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  form: store.perfilState.form,
  query: store.perfilState.query,
});
const mapDispatchToProps = dispatch =>
  bindActionCreators({ perfilForm }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PerfilFoto);
