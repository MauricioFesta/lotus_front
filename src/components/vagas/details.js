import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import { observable } from "mobx";
import React from "react";
import { Button, Card, CardDeck, Col, Form, Modal, Row } from "react-bootstrap";
import history from "../../others/redirect";
import { Store } from "../../store";

export default class Details extends React.Component {
  constructor(props) {
    super(props);

    this.obs = observable({
      vagas: Store.getState().vagasState.vaga_one,
    });
  }

  componentDidMount() {
    if (!Store.getState().vagasState.vaga_one._id) {
      history.push("/vagas");
    }
  }

  validTrueOrFalse(bol) {
    if (bol) {
      return "Sim";
    } else {
      return "Não";
    }
  }

  render() {
    return (
      <>
        <CardDeck className="mt-4 detail ml-4 mr-41" key={this.obs.vagas.id}>
          <Card className="vagas-cards" key={this.obs.vagas.id}>
            <Card.Img
              className="img-view-detail"
              variant="top"
              src={"data:image/png;base64," + this.obs.vagas.imagem_base64}
            />
            <Card.Body>
              <Card.Text>Valor: {this.obs.vagas.valor}</Card.Text>
              <Card.Text>Cidade: {this.obs.vagas.cidade}</Card.Text>
              <Card.Text>Estado: {this.obs.vagas.estado}</Card.Text>
              <Card.Text>Turno: {this.obs.vagas.turno}</Card.Text>
              <Card.Text>Ramo: {this.obs.vagas.ramo}</Card.Text>
              <Card.Text>
                Disponibilidade Viajar:{" "}
                {this.validTrueOrFalse(this.obs.vagas.disponibilidade_viajar)}
              </Card.Text>
              <Card.Text>
                Planejamento Futuro:{" "}
                {this.validTrueOrFalse(this.obs.vagas.planejamento_futuro)}
              </Card.Text>
              <Card.Text>Descrição: {this.obs.vagas.descricao}</Card.Text>
            </Card.Body>

            <Card.Footer>
              <small className="text-muted">Atualizado em 3 mins agora</small>
            </Card.Footer>
          </Card>
        </CardDeck>
      </>
    );
  }
}
