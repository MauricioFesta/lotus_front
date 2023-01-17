import React from "react";
import { Button, Card, Modal } from "react-bootstrap";
// import { getPostagensAll } from "../../stores/postagens/api"
import { Spinner } from "@blueprintjs/core";
import { observable } from "mobx";
import { observer } from "mobx-react";
import moment from "moment";
import init, { get_postagens_all } from "../../wasm/pkg/wasm";
import { tokenMain } from "../login/auth";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

require("./css/index.css");

class Postagens extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], open_spinner: false };

    this.obs = observable({
      dateNow: Date,
    });
  }

  async componentDidMount() {
    this.obs.dateNow = moment(new Date());

    this.setState({ open_spinner: true });

    await init();

    let token = tokenMain();

    // let res = await getPostagensAll()

    let res = await get_postagens_all(token);

    if (Array.isArray(res)) {
      this.setState({ data: res });
    } else {
      this.setState({ data: [] });
    }

    this.setState({ open_spinner: false });
  }

  render() {
    return (
      <div>
        <Modal show={this.state.open_spinner}>
          <Modal.Body>
            <Spinner size={80} value={null} />
          </Modal.Body>
        </Modal>
        <div className="ml-4 mr-4 mt-4 scroll-card">
          {this.state.data.map((el, index) => {
            let date = moment(new Date(el.inserted_at * 1000)).add(3, "hours")
              .format();

            var end = moment(date);
            var duration = moment.duration(this.obs.dateNow.diff(end));
            var days = duration.asDays();

            return (
              <>
                <Card className="text-center">
                  <Card.Header></Card.Header>
                  <Card.Body>
                    <Card.Title>{el.empresa_razao}</Card.Title>
                    <Card.Text>
                      {el.descricao}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="text-muted">
                    {Math.floor(days) === 0
                      ? Math.floor(duration.asMinutes()) < 60
                        ? Math.floor(duration.asMinutes()) + " min ago"
                        : Math.floor(duration.asHours()) + " hours ago"
                      : Math.floor(days) + " day ago"}
                  </Card.Footer>
                </Card>
                <br></br>
              </>
            );
          })}
        </div>
      </div>
    );
  }
}

export default observer(Postagens);
