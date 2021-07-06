import React, { Component } from "react";

import Select from "../../components/Select";
import Auth from "../../components/Auth";
import Input from "../../components/Input";
import Header from "../../components/Header";
import FormContainer from "../../components/FormContainer";
import api from "../../services/api";

import "./continue.css";

export default class Seller extends Component {
  state = {
    error: "",
    progresses: []
  };
  handleContinue = (progressId) => {
    // send all info as parameters creating a recurtion
    const { progresses } = this.state;
    // get the info of the selected progress
    const {
      formType,
      clientCountage,
      seller,
      route,
      id,
      sellerName
    } = progresses.find((progress) => progress.id === progressId);
    // redirect to the next client form
    return this.props.history.push(`/${formType}`, {
      formType: formType,
      clientCountage: Number(clientCountage) + 1,
      seller: seller,
      route: route,
      id: id,
      sellerName
    });
  };

  handleGoBack = () => {
    return this.props.history.push("/preventista");
  };
  componentDidMount() {
    // get the data from lstorage set array on state
    this.setState({
      progresses: JSON.parse(window.localStorage.getItem("progress"))
    });
  }
  // render a list of buttons redirect to the selected route in the number it lasted
  render() {
    const { progresses } = this.state;
    return (
      <>
        <Header />
        {/* <Auth /> */}
        <FormContainer>
          <main className="continue">
            {progresses !== null && progresses.length !== 0 ? (
              <>
                <h2>Elegí la ruta que querés continuar:</h2>
                <hr />
                <div className="progresses">
                  {progresses.map((progress, index) => (
                    <div className="card">
                      <div className="card-header">
                        Ruta: <strong>{progress.route}</strong>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          Vendedor: <strong>{progress.sellerName}</strong>
                        </p>
                        <p className="card-text">
                          Ultimo Cliente:{" "}
                          <strong>{progress.clientCountage}</strong>
                        </p>
                        <p className="card-text">
                          Tipo de Formulario:{" "}
                          {progress.formType.charAt(0).toUpperCase() +
                            progress.formType.slice(1)}
                        </p>
                        <div className="d-grid gap-2">
                          <button
                            onClick={() => this.handleContinue(progress.id)}
                            className="btn btn-primary btn-lg"
                          >
                            Continuar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2>No hay ninguna ruta para continuar!</h2>
              </>
            )}

            {this.state.error !== "" ? (
              <div className="alert alert-danger" role="alert">
                {this.state.error}
              </div>
            ) : null}

            <button
              onClick={this.handleGoBack}
              id="back-button"
              className="btn btn-danger  btn-lg submit-button"
            >
              Volver
            </button>
          </main>
        </FormContainer>
      </>
    );
  }
}