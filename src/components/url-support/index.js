import React from "react";
import { Container, Figure,FloatingLabel, Form, Jumbotron, Row } from "react-bootstrap";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import LoadingButton from '@mui/lab/LoadingButton';
import { observable } from "mobx";
import { observer } from "mobx-react";
import {UrlSupportStore} from "../../stores/url-support"

class UrlSupport extends React.Component {
  constructor(props) {
    super(props);
    this.obs = observable({
  
      is_loading: false,
      message: "",
      email: "",
      entrar: false
    })
    
  }


 async handleSendEmail(){

    this.obs.is_loading = true

   await UrlSupportStore.handleSendEmail(this.obs)
   if(UrlSupportStore.is_ok){

   }else{

   }

    this.obs.is_loading = false
  }

  render() {
    return (
      <div>
        <Jumbotron className="ml-4 mr-4 mt-4">
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Entre com seu email</Form.Label>
              <Form.Control type="email" onChange={(e) => this.obs.email = e.target.value} placeholder="examplo@teste.com" />
              <Form.Text className="text-muted">
                Digite um email válido.

              </Form.Text>
            </Form.Group>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={3}
              placeholder="dúvida/problema..."
                onChange={(e) => this.obs.message = e.target.value}
              style={{ width: 900 }}
            />
            <br/>  <br/>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                onClick={() => this.obs.entrar = !this.obs.entrar}
                label="Deseja que nós Lotus Vagas de Emprego entremos em contato com você ?"
              />
            </Form.Group>
            
        <LoadingButton onClick={() => this.handleSendEmail()} loading={this.obs.is_loading} variant="contained" color="success">
            Enviar
        </LoadingButton>
          </Form>
        </Jumbotron>
      </div>
    );
  }
}

export default observer(UrlSupport)
