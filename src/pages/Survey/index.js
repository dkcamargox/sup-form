import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Input from "../../components/Input";
import CheckInput from "../../components/CheckInput";
import Textarea from "../../components/Textarea";
import Switch from "../../components/Switch";
import SwitchToggleButtons from "../../components/SwitchToggleButtons";
import TableCheckToggleButtons from "../../components/TableCheckToggleButtons";
import TableSwitches from "../../components/TableSwitches";
import Header from "../../components/Header";
import Auth from "../../components/Auth";
import CSStoObjectNotation from "../../utils/notation";
import api from "../../services/api";

import "./survey.css";
import FormContainer from "../../components/FormContainer";

export default class Survey extends Component {
  state = {
    clientCountage: 0,
    loadingSend: false,
    clientId: 0,
    error: "",
    clientName: "",
    clientVisited: "",
    frequency: "",
    generalComments: "",
    logisticsProblems: "",
    logisicProblemComment: "",
    surveyRedcom: {},
    surveySoda: {},
    surveyWater: {},
    exhibition: {}
  };

  renderError = (errorMessage) => {
    this.setState({ error: errorMessage });
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setTimeout(() => {
      this.setState({ error: "" });
    }, 4000);
  };

  handlePosibleChecks(tag) {
    /**
     * TODO
     * solve noproduct bug
     */
    if (tag.id.split("-")[1] === "noproduct") {
      if (tag.checked) {
        document
          .getElementById(`${tag.id.split("-")[0]}-gondola`)
          .setAttribute("disabled", true);
        document
          .getElementById(`${tag.id.split("-")[0]}-pricing`)
          .setAttribute("disabled", true);
      } else {
        document
          .getElementById(`${tag.id.split("-")[0]}-gondola`)
          .removeAttribute("disabled");
        document
          .getElementById(`${tag.id.split("-")[0]}-pricing`)
          .removeAttribute("disabled");
      }
    } else if (
      tag.id.split("-")[1] === "gondola" ||
      tag.id.split("-")[1] === "pricing"
    ) {
      if (tag.checked) {
        document
          .getElementById(`${tag.id.split("-")[0]}-noproduct`)
          .setAttribute("disabled", true);
      } else {
        document
          .getElementById(`${tag.id.split("-")[0]}-noproduct`)
          .removeAttribute("disabled");
      }
    }
  }

  handleTableSelectByContainerId = (id) => {
    // get inputs elements by container id
    const productsElements = [
      ...document.getElementById(id).getElementsByTagName("input")
    ];

    // store the needed data in string for converting to JSON
    const productElementsStrings = productsElements.map((productElement) => {
      return `"${CSStoObjectNotation(productElement.id)}": "${
        productElement.checked
      }"`;
    });
    // converting to json object all data in one object and return
    return JSON.parse(
      `{${productElementsStrings.map(
        (productElementString) => productElementString
      )}}`
    );
  };

  handleTableCheckSelect = (e) => {
    this.handlePosibleChecks(e.target);
    const container = e.target.parentElement.parentElement.id;
    const updatedData = this.handleTableSelectByContainerId(container);

    if (container === "survey-redcom-products") {
      this.setState({ surveyRedcom: updatedData });
    } else if (container === "survey-soda-compentence-products") {
      this.setState({ surveySoda: updatedData });
    } else if (container === "survey-water-compentence-products") {
      this.setState({ surveyWater: updatedData });
    } else if (container === "exhibition") {
      this.setState({ exhibition: updatedData });
    }
  };

  handleSurveySubmit = () => {
    /**
     * check for empty data => configure error
     * send data to api and
     * redirect to end pass the type by query
     *
     */
    const {
      clientId,
      clientName,
      clientVisited,
      frequency,
      generalComments,
      logisticsProblems,
      logisicProblemComment,
      surveyRedcom,
      surveySoda,
      surveyWater,
      exhibition
    } = this.state;
    const supervisor = window.localStorage.getItem("supervisor");
    const sucursal = window.localStorage.getItem("sucursal");
    const { seller, route } = this.props.location.state;

    const data = {
      sucursal,
      supervisor,
      seller,
      route,
      clientId,
      clientName,
      clientVisited,
      frequency,
      generalComments,
      logisticsProblems,
      logisicProblemComment,
      surveyRedcom,
      surveySoda,
      surveyWater,
      exhibition
    };

    if (frequency === "" || clientName === "") {
      this.renderError(
        `El campo de ${
          clientName === "" ? "nombre del cliente" : "frecuencia de visita"
        } no puede ser vacio`
      );
    }
    /**
     * request to api here!!
     */
    api.post("/survey", data);

    return this.props.history.push("/fin", this.props.location.state);
  };

  componentDidMount() {
    try {
      this.setState({
        clientCountage: this.props.location.state.clientCountage
      });
    } catch (error) {
      this.props.history.push("/preventista");
    }

    this.setState({
      surveyRedcom: this.handleTableSelectByContainerId(
        "survey-redcom-products"
      )
    });
    this.setState({
      surveySoda: this.handleTableSelectByContainerId(
        "survey-soda-compentence-products"
      )
    });
    this.setState({
      surveyWater: this.handleTableSelectByContainerId(
        "survey-water-compentence-products"
      )
    });
    this.setState({
      exhibition: this.handleTableSelectByContainerId("exhibition")
    });
  }

  render() {
    const { clientCountage } = this.state;
    return (
      <>
        <Header />
        <Auth />
        <FormContainer>
          <main id="survey">
            <h2>
              Cliente Numero <strong>{clientCountage}</strong>
            </h2>
            <hr />
            {this.state.error !== "" ? (
              <div
                className="alert alert-danger"
                role="alert"
                style={{ marginBottom: "1.6rem" }}
              >
                {this.state.error}
              </div>
            ) : null}
            <Input
              label="Nombre del Cliente"
              type="text"
              name="client-name"
              id="client-name"
              onChange={(e) => this.setState({ clientName: e.target.value })}
            />
            <CheckInput
              label="Codigo del Cliente"
              type="number"
              pattern="\d*"
              min="1"
              name="client-id"
              id="client-id"
              info="Al desactivar se entiende que el cliente o no sabe el código o es un cliente nuevo."
              onChange={(e) => this.setState({ clientId: e.target.value })}
            />
            <Switch
              label="Cliente con Visita?"
              name="client-visited"
              id="client-visited"
              onChange={(e) =>
                this.setState({
                  clientVisited: e.target.checked ? true : false
                })
              }
            />
            <SwitchToggleButtons
              label="Frecuencia de visita:"
              options={[
                { label: "Dos veces", value: "twice", name: "twice" },
                { label: "Una vez", value: "once", name: "once" },
                { label: "No visita", value: "no", name: "no" },
                { label: "Distancia", value: "distance", name: "distance" }
              ]}
              name="times-visited"
              onChange={(e) => {
                this.setState({ frequency: e.target.value });
              }}
            />
            <TableCheckToggleButtons
              label="Relevamiento productos REDCOM:"
              columns={[
                {
                  label: "Sin Producto",
                  value: "sin-producto",
                  name: "noproduct",
                  disabled: "false"
                },
                {
                  label: "Gondola",
                  value: "gondola",
                  name: "gondola",
                  disabled: "false"
                },
                {
                  label: "Afiche",
                  value: "afiche",
                  name: "poster",
                  disabled: "false"
                },
                {
                  label: "Precificación",
                  value: "precificacion",
                  name: "pricing",
                  disabled: "false"
                }
              ]}
              lines={[
                { name: "secco", label: "Secco" },
                { name: "sdlp", label: "Sierra de Los Padres" },
                { name: "nevares", label: "Nevares" },
                { name: "vitalissima", label: "Vitalissima" },
                { name: "quento", label: "Snacks Quento" },
                { name: "papel", label: "Linea Papel" }
              ]}
              onChange={this.handleTableCheckSelect}
              name="survey-redcom-products"
            />

            <TableSwitches
              name="exhibition"
              label="Exhibición Marcas:"
              lines={[
                { name: "secco", label: "Secco" },
                { name: "sdlp", label: "Sierra de Los Padres" },
                { name: "nevares", label: "Nevares" },
                { name: "vitalissima", label: "Vitalissima" },
                { name: "quento", label: "Snacks Quento" },
                { name: "papel", label: "Linea Papel" }
              ]}
              onChange={this.handleTableCheckSelect}
            />

            <TableCheckToggleButtons
              label="Relevamiento Competencia Gaseosas:"
              columns={[
                {
                  label: "Sin Producto",
                  value: "sin-producto",
                  name: "noproduct"
                },
                { label: "Gondola", value: "gondola", name: "gondola" },
                { label: "Afiche", value: "afiche", name: "poster" },
                {
                  label: "Precificación",
                  value: "precificacion",
                  name: "pricing"
                }
              ]}
              lines={[
                { name: "cabalgata", label: "Cabalgata" },
                { name: "manaos", label: "Manaos" },
                { name: "caribe", label: "Caribe" },
                { name: "cunnington", label: "Cunnington" },
                { name: "axis", label: "Axis" }
              ]}
              onChange={this.handleTableCheckSelect}
              name="survey-soda-compentence-products"
            />

            <TableCheckToggleButtons
              label="Relevamiento Competencia Gaseosas:"
              columns={[
                {
                  label: "Sin Producto",
                  value: "sin-producto",
                  name: "noproduct"
                },
                { label: "Gondola", value: "gondola", name: "gondola" },
                { label: "Afiche", value: "afiche", name: "poster" },
                {
                  label: "Precificación",
                  value: "precificacion",
                  name: "pricing"
                }
              ]}
              lines={[
                { name: "levite", label: "Levite" },
                { name: "aquarius", label: "Aquarius" },
                { name: "awafruit", label: "Awafruit" },
                { name: "baggio-fresh", label: "Baggio Fresh" }
              ]}
              onChange={this.handleTableCheckSelect}
              name="survey-water-compentence-products"
            />
            <Textarea
              label="Comentarios Generales:"
              name="general-comment"
              onChange={(e) => {
                this.setState({ generalComments: e.target.value });
              }}
            />
            <Switch
              label="Reclamos Logistica?"
              name="logistics"
              id="logistics"
              value={true}
              onChange={(e) => {
                this.setState({ logisticsProblems: e.target.checked });
              }}
            />
            {this.state.logisticsProblems ? (
              <Textarea
                label="Comentarios Logistica:"
                name="logistics-comment"
                onChange={(e) => {
                  this.setState({ logisicProblemComment: e.target.value });
                }}
              />
            ) : (
              <></>
            )}
            <button
              disabled={this.state.loadingSend}
              onClick={this.handleSurveySubmit}
              id="survey-button"
              className="btn btn-primary btn-lg submit-button"
            >
              {this.state.loadingSend ? (
                <AiOutlineLoading3Quarters className="icon-spin" />
              ) : (
                <>Enviar Evaluación</>
              )}
            </button>
          </main>
        </FormContainer>
      </>
    );
  }
}
