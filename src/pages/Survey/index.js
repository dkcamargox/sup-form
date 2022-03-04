import React, { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";

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

function Survey() {

  const {state: locationState} = useLocation() 
  const navigate = useNavigate();
  
  const [clientCountage, setClientCountage] = useState(0);
  const [clientName, setClientName] = useState('');
  const [clientId, setClientId] = useState(0);
  const [clientVisited, setClientVisited] = useState('');
  const [loadingSend, setLoadingSend] = useState(false);
  const [frequency, setFrequency] = useState('');
  const [clientWithMix, setClientWithMix] = useState('');

  
  const [error, setError ] = useState("");
  const [cordy, setCordy ] = useState(0.0);
  const [cordx, setCordx ] = useState(0.0);
  
  // surveys states
  const [surveyRedcom, setSurveyRedcom] = useState({});
  const [surveySoda, setSurveySoda] = useState({});
  const [surveyWater, setSurveyWater] = useState({});
  const [surveyWines, setSurveyWines] = useState({});
  const [exhibition, setExhibition] = useState({});
  const [logisticsProblems, setLogisticsProblems] = useState('');
  const [logisicProblemComment, setLogisicProblemComment] = useState('');
  const [generalComments, setGeneralComments] = useState('');
  
  // lines states
  const [redcomLines, setRedcomLines] = useState(
    JSON.parse(window.localStorage.getItem("tableData")).redcom
  );
  const [waterLines, setWaterLines] = useState(
    JSON.parse(window.localStorage.getItem("tableData")).water
  );
  const [sodaLines, setSodaLines] = useState(
    JSON.parse(window.localStorage.getItem("tableData")).soda
    );
  const [winesLines, setWinesLines] = useState(
    JSON.parse(window.localStorage.getItem("tableData")).wine
  );


  const productsEvaluationColumns = [
    {
      label: "Sin Producto",
      value: "sin-producto",
      name: "noproduct"
    },
    {
      label: "Precificación",
      value: "precificacion",
      name: "pricing"
    },
    {
      label: "Afiche",
      value: "afiche",
      name: "poster"
    },
  ];
  
  const submit = async () => {
    /**
     * check for empty data => configure error
     * send data to api and
     * redirect to end pass the type by query
     *
     */
    
    const supervisor = window.localStorage.getItem("supervisor");
    const sucursal = window.localStorage.getItem("sucursal");
    const { seller, route } = locationState;

    const data = {
      sucursal,
      supervisor,
      seller,
      route,
      clientId,
      clientName,
      clientVisited,
      clientWithMix,
      frequency,
      generalComments,
      logisticsProblems,
      logisicProblemComment,
      surveyRedcom,
      surveySoda,
      surveyWater,
      surveyWines,
      exhibition,
      cordy,
      cordx
    };

    if (frequency === "" || clientName === "") {
      return renderError(
        `El campo de ${
          clientName === "" ? "nombre del cliente" : "frecuencia de visita"
        } no puede ser vacio`
      );
    }

    /**
     * request to api here!!
     */
    setLoadingSend(true);
    try {
      await api.post("/survey", data);
      return navigate('/fin', {state: locationState})

    } catch (error) {
      renderError(
        error.response !== undefined
          ? error.response.data.error
          : "Error no identificado al hacer el Relevamiento"
      );
    } finally {
      setLoadingSend(false);
    }
    
  };


  
  const handlePosibleChecks = (tag) => {
    /**
     * TODO
     * solve noproduct bug
     */
    if (tag.id.split("-")[1] === "noproduct") {
      if (tag.checked) {
        document
          .getElementById(`${tag.id.split("-")[0]}-pricing`)
          .setAttribute("disabled", true);
      } else {
        document
          .getElementById(`${tag.id.split("-")[0]}-pricing`)
          .removeAttribute("disabled");
      }
    } else if (
      tag.id.split("-")[1] === "pricing"
    ) {
      if (
          !tag.checked && (
            document
              .getElementById(`${tag.id.split("-")[0]}-pricing`).checked === false
          )
        ) {
          document
            .getElementById(`${tag.id.split("-")[0]}-noproduct`)
            .removeAttribute("disabled");
        } else {
        document
          .getElementById(`${tag.id.split("-")[0]}-noproduct`)
          .setAttribute("disabled", true);
      }
    }
  }

  const handleTableSelectByContainerId = (id) => {
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

  const handleTableCheckSelect = (e) => {
    handlePosibleChecks(e.target);
    const container = e.target.parentElement.parentElement.id;
    const updatedData = handleTableSelectByContainerId(container);

    if (container === "survey-redcom-products") {
      setSurveyRedcom(updatedData);
    } else if (container === "survey-soda-compentence-products") {
      setSurveySoda(updatedData);
    } else if (container === "survey-water-compentence-products") {
      setSurveyWater(updatedData);
    } else if (container === "survey-wines-compentence-products") {
      setSurveyWines(updatedData);
    } else if (container === "exhibition") {
      setExhibition(updatedData);
    }
  };

  // render error
  const renderError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => {
      setError('');
    }, 2500);
  };
  
  // get geolocation coords
  useEffect(() => {
    try {
      // request api
      navigator.geolocation.getCurrentPosition((position) => {
        setCordy(position.coords.latitude)
        setCordx(position.coords.longitude)
      },
      () => {
        this.renderError("Geolocalización no activada");
        return
      },
      {
        enableHighAccuracy: true
      });
    } catch (error) {
      // catch => render error
      renderError(
        error.response !== undefined
        ? error.response.data.error
        : "Error no identificado en al geoposición"
        );
      } 
      
  }, []);
  // componentDidMount
  useEffect(()=>{
    try {
      setClientCountage(locationState.clientCountage);
    } catch (error) {
      this.props.history.push("/");
    }
  }, [])
  
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
          
          {error !== "" ? (
            <div
              className="alert alert-danger"
              role="alert"
              style={{ marginBottom: "1.6rem" }}
            >
              {error}
            </div>
          ) : null}
          
          <Input
            label="Nombre del Cliente"
            type="text"
            name="client-name"
            id="client-name"
            onChange={(e) => setClientName(e.target.value)}
          />
          <CheckInput
            label="Codigo del Cliente"
            type="number"
            pattern="\d*"
            min="1"
            name="client-id"
            id="client-id"
            info="Al desactivar se entiende que el cliente o no sabe el código o es un cliente nuevo."
            onChange={(e) => setClientId(e.target.value)}
          />
          <Switch
            label="Cliente con Visita?"
            name="client-visited"
            id="client-visited"
            onChange={(e) => setClientVisited(e.target.checked ? true : false)}
          />
          <SwitchToggleButtons
            label="Frecuencia de visita por semana:"
            options={[
              { label: "Dos veces", value: "twice", name: "twice" },
              { label: "Una ves", value: "once", name: "once" },
              { label: "Menos que una ves", value: "no", name: "no" },
              { label: "Distancia", value: "distance", name: "distance" }
            ]}
            name="times-visited"
            onChange={(e) => setFrequency(e.target.value)}
          />
          
          <TableCheckToggleButtons
            label="Relevamiento productos REDCOM:"
            columns={productsEvaluationColumns}
            lines={redcomLines}
            onChange={handleTableCheckSelect}
            name="survey-redcom-products"
          />
          
          <Switch
            label="Cliente con Mix de productos?"
            name="client-mix"
            id="client-mix"
            onChange={(e) => setClientWithMix(e.target.checked ? true : false)}
          />

          <TableSwitches
            name="exhibition"
            label="Exhibición Marcas:"
            lines={redcomLines}
            onChange={handleTableCheckSelect}
          />

          

          <TableCheckToggleButtons
            label="Relevamiento Competencia de Gaseosas:"
            columns={productsEvaluationColumns}
            lines={sodaLines}
            onChange={handleTableCheckSelect}
            name="survey-soda-compentence-products"
          />

          <TableCheckToggleButtons
            label="Relevamiento Competencia de Aguas:"
            columns={productsEvaluationColumns}
            lines={waterLines}
            onChange={handleTableCheckSelect}
            name="survey-water-compentence-products"
          />

          <TableCheckToggleButtons
            label="Relevamiento Competencia de Vinos:"
            columns={productsEvaluationColumns}
            lines={winesLines}
            onChange={handleTableCheckSelect}
            name="survey-wines-compentence-products"
          />
          
          <Textarea
            label="Comentarios Generales:"
            name="general-comment"
            onChange={(e) => setGeneralComments(e.target.value)}
          />
          <Switch
            label="Reclamos Logistica?"
            name="logistics"
            id="logistics"
            value={true}
            onChange={(e) => setLogisticsProblems(e.target.checked)}
          />
        
          {logisticsProblems ? (
            <Textarea
              label="Comentarios Logistica:"
              name="logistics-comment"
              onChange={(e) => setLogisicProblemComment(e.target.value)}
            />
          ) : (
            <></>
          )}
          <button
            disabled={loadingSend}
            onClick={submit}
            id="survey-button"
            className="btn btn-primary btn-lg submit-button"
          >
            {loadingSend ? (
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

export default Survey;

// export default class Survey extends Component {
//   state = {
//     clientCountage: 0,
//     loadingSend: false,
//     clientId: 0,
//     error: "",
//     clientName: "",
//     clientVisited: "",
//     clientWithMix: "",
//     frequency: "",
//     generalComments: "",
//     logisticsProblems: "",
//     logisicProblemComment: "",
//     surveyRedcom: {},
//     surveySoda: {},
//     surveyWater: {},
//     surveyWines: {},
//     exhibition: {},
//     cordy: 0.0,
//     cordx: 0.0,
//     redcomLines: {},
//     waterLines: {},
//     sodaLines: {},
//     winesLines: {}
//   };

//   constructor(props) {
//     super(props);

//     this.state.redcomLines = JSON.parse(
//       window.localStorage.getItem("tableData")
//     ).redcom;
//     this.state.waterLines = JSON.parse(
//       window.localStorage.getItem("tableData")
//     ).water;
//     this.state.sodaLines = JSON.parse(
//       window.localStorage.getItem("tableData")
//     ).soda;
//     this.state.winesLines = JSON.parse(
//       window.localStorage.getItem("tableData")
//     ).wine;
//   }

//   renderError = (errorMessage) => {
//     this.setState({ error: errorMessage });
//     window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
//     setTimeout(() => {
//       this.setState({ error: "" });
//     }, 4000);
//   };

//   handlePosibleChecks(tag) {
//     /**
//      * TODO
//      * solve noproduct bug
//      */
//     if (tag.id.split("-")[1] === "noproduct") {
//       if (tag.checked) {
//         document
//           .getElementById(`${tag.id.split("-")[0]}-pricing`)
//           .setAttribute("disabled", true);
//       } else {
//         document
//           .getElementById(`${tag.id.split("-")[0]}-pricing`)
//           .removeAttribute("disabled");
//       }
//     } else if (
//       tag.id.split("-")[1] === "pricing"
//     ) {
//       if (
//           !tag.checked && (
//             document
//               .getElementById(`${tag.id.split("-")[0]}-pricing`).checked === false
//           )
//         ) {
//           document
//             .getElementById(`${tag.id.split("-")[0]}-noproduct`)
//             .removeAttribute("disabled");
//         } else {
//         document
//           .getElementById(`${tag.id.split("-")[0]}-noproduct`)
//           .setAttribute("disabled", true);
//       }
//     }
//   }

//   handleTableSelectByContainerId = (id) => {
//     // get inputs elements by container id
//     const productsElements = [
//       ...document.getElementById(id).getElementsByTagName("input")
//     ];

//     // store the needed data in string for converting to JSON
//     const productElementsStrings = productsElements.map((productElement) => {
//       return `"${CSStoObjectNotation(productElement.id)}": "${
//         productElement.checked
//       }"`;
//     });
//     // converting to json object all data in one object and return
//     return JSON.parse(
//       `{${productElementsStrings.map(
//         (productElementString) => productElementString
//       )}}`
//     );
//   };

//   handleTableCheckSelect = (e) => {
//     this.handlePosibleChecks(e.target);
//     const container = e.target.parentElement.parentElement.id;
//     const updatedData = this.handleTableSelectByContainerId(container);

//     if (container === "survey-redcom-products") {
//       this.setState({ surveyRedcom: updatedData });
//     } else if (container === "survey-soda-compentence-products") {
//       this.setState({ surveySoda: updatedData });
//     } else if (container === "survey-water-compentence-products") {
//       this.setState({ surveyWater: updatedData });
//     } else if (container === "survey-wines-compentence-products") {
//       this.setState({ surveyWines: updatedData });
//     } else if (container === "exhibition") {
//       this.setState({ exhibition: updatedData });
//     }
//   };

//   handleSurveySubmit = async () => {
//     /**
//      * check for empty data => configure error
//      * send data to api and
//      * redirect to end pass the type by query
//      *
//      */
//     const {
//       clientId,
//       clientName,
//       clientVisited,
//       clientWithMix,
//       frequency,
//       generalComments,
//       logisticsProblems,
//       logisicProblemComment,
//       surveyRedcom,
//       surveySoda,
//       surveyWater,
//       surveyWines,
//       exhibition,
//       cordy,
//       cordx
//     } = this.state;
//     const supervisor = window.localStorage.getItem("supervisor");
//     const sucursal = window.localStorage.getItem("sucursal");
//     const { seller, route } = this.props.location.state;

//     const data = {
//       sucursal,
//       supervisor,
//       seller,
//       route,
//       clientId,
//       clientName,
//       clientVisited,
//       clientWithMix,
//       frequency,
//       generalComments,
//       logisticsProblems,
//       logisicProblemComment,
//       surveyRedcom,
//       surveySoda,
//       surveyWater,
//       surveyWines,
//       exhibition,
//       cordy,
//       cordx
//     };

//     if (frequency === "" || clientName === "") {
//       return this.renderError(
//         `El campo de ${
//           clientName === "" ? "nombre del cliente" : "frecuencia de visita"
//         } no puede ser vacio`
//       );
//     }
//     /**
//      * request to api here!!
//      */
//     this.setState({ loadingSend: true });
//     try {
//       await api.post("/survey", data);
//       return this.props.history.push("/fin", this.props.location.state);
//     } catch (error) {
//       this.renderError(
//         error.response !== undefined
//           ? error.response.data.error
//           : "Error no identificado al hacer el Relevamiento"
//       );
//     } finally {
//       this.setState({
//         loadingLogIn: false
//       });
//     }
//   };

//   componentDidMount() {
//     try {
//       this.setState({
//         clientCountage: this.props.location.state.clientCountage
//       });
//     } catch (error) {
//       this.props.history.push("/");
//     }
//     this.setState({
//       surveyRedcom: this.handleTableSelectByContainerId(
//         "survey-redcom-products"
//       ),
//       surveySoda: this.handleTableSelectByContainerId(
//         "survey-soda-compentence-products"
//       ),
//       surveyWater: this.handleTableSelectByContainerId(
//         "survey-water-compentence-products"
//       ),
//       surveyWines: this.handleTableSelectByContainerId(
//         "survey-wines-compentence-products"
//       ),
//       exhibition: this.handleTableSelectByContainerId("exhibition")
//     });

//     navigator.geolocation.getCurrentPosition((position) => {
//       this.setState({
//         cordy: position.coords.latitude,
//         cordx: position.coords.longitude
//       });
//     });
//   }

//   render() {
//     const { clientCountage } = this.state;
//     return (
//       <>
//         <Header />
//         <Auth />
//         <FormContainer>
//           <main id="survey">
//             <h2>
//               Cliente Numero <strong>{clientCountage}</strong>
//             </h2>
//             <hr />
//             {this.state.error !== "" ? (
//               <div
//                 className="alert alert-danger"
//                 role="alert"
//                 style={{ marginBottom: "1.6rem" }}
//               >
//                 {this.state.error}
//               </div>
//             ) : null}
//             <Input
//               label="Nombre del Cliente"
//               type="text"
//               name="client-name"
//               id="client-name"
//               onChange={(e) => this.setState({ clientName: e.target.value })}
//             />
//             <CheckInput
//               label="Codigo del Cliente"
//               type="number"
//               pattern="\d*"
//               min="1"
//               name="client-id"
//               id="client-id"
//               info="Al desactivar se entiende que el cliente o no sabe el código o es un cliente nuevo."
//               onChange={(e) => this.setState({ clientId: e.target.value })}
//             />
//             <Switch
//               label="Cliente con Visita?"
//               name="client-visited"
//               id="client-visited"
//               onChange={(e) =>
//                 this.setState({
//                   clientVisited: e.target.checked ? true : false
//                 })
//               }
//             />
//             <SwitchToggleButtons
//               label="Frecuencia de visita por semana:"
//               options={[
//                 { label: "Dos veces", value: "twice", name: "twice" },
//                 { label: "Una ves", value: "once", name: "once" },
//                 { label: "Menos que una ves", value: "no", name: "no" },
//                 { label: "Distancia", value: "distance", name: "distance" }
//               ]}
//               name="times-visited"
//               onChange={(e) => {
//                 this.setState({ frequency: e.target.value });
//               }}
//             />
//             <TableCheckToggleButtons
//               label="Relevamiento productos REDCOM:"
//               columns={[
//                 {
//                   label: "Sin Producto",
//                   value: "sin-producto",
//                   name: "noproduct"
//                 },
//                 {
//                   label: "Precificación",
//                   value: "precificacion",
//                   name: "pricing"
//                 },
//                 {
//                   label: "Afiche",
//                   value: "afiche",
//                   name: "poster"
//                 },
//               ]}
//               lines={this.state.redcomLines}
//               onChange={this.handleTableCheckSelect}
//               name="survey-redcom-products"
//             />

//             <Switch
//               label="Cliente con Mix de productos?"
//               name="client-mix"
//               id="client-mix"
//               onChange={(e) =>
//                 this.setState({
//                   clientWithMix: e.target.checked ? true : false
//                 })
//               }
//             />

//             <TableSwitches
//               name="exhibition"
//               label="Exhibición Marcas:"
//               lines={this.state.redcomLines}
//               onChange={this.handleTableCheckSelect}
//             />

            

//             <TableCheckToggleButtons
//               label="Relevamiento Competencia de Gaseosas:"
//               columns={[
//                 {
//                   label: "Sin Producto",
//                   value: "sin-producto",
//                   name: "noproduct"
//                 },
//                 {
//                   label: "Precificación",
//                   value: "precificacion",
//                   name: "pricing"
//                 },
//                 {
//                   label: "Afiche",
//                   value: "afiche",
//                   name: "poster"
//                 },
//               ]}
//               lines={this.state.sodaLines}
//               onChange={this.handleTableCheckSelect}
//               name="survey-soda-compentence-products"
//             />

//             <TableCheckToggleButtons
//               label="Relevamiento Competencia de Aguas:"
//               columns={[
//                 {
//                   label: "Sin Producto",
//                   value: "sin-producto",
//                   name: "noproduct"
//                 },
//                 {
//                   label: "Precificación",
//                   value: "precificacion",
//                   name: "pricing"
//                 },
//                 {
//                   label: "Afiche",
//                   value: "afiche",
//                   name: "poster"
//                 },
//               ]}
//               lines={this.state.waterLines}
//               onChange={this.handleTableCheckSelect}
//               name="survey-water-compentence-products"
//             />

//             <TableCheckToggleButtons
//               label="Relevamiento Competencia de Vinos:"
//               columns={[
//                 {
//                   label: "Sin Producto",
//                   value: "sin-producto",
//                   name: "noproduct"
//                 },
//                 {
//                   label: "Precificación",
//                   value: "precificacion",
//                   name: "pricing"
//                 },
//                 {
//                   label: "Afiche",
//                   value: "afiche",
//                   name: "poster"
//                 },
//               ]}
//               lines={this.state.winesLines}
//               onChange={this.handleTableCheckSelect}
//               name="survey-wines-compentence-products"
//             />
//             <Textarea
//               label="Comentarios Generales:"
//               name="general-comment"
//               onChange={(e) => {
//                 this.setState({ generalComments: e.target.value });
//               }}
//             />
//             <Switch
//               label="Reclamos Logistica?"
//               name="logistics"
//               id="logistics"
//               value={true}
//               onChange={(e) => {
//                 this.setState({ logisticsProblems: e.target.checked });
//               }}
//             />
//             {this.state.logisticsProblems ? (
//               <Textarea
//                 label="Comentarios Logistica:"
//                 name="logistics-comment"
//                 onChange={(e) => {
//                   this.setState({ logisicProblemComment: e.target.value });
//                 }}
//               />
//             ) : (
//               <></>
//             )}
//             <button
//               disabled={this.state.loadingSend}
//               onClick={this.handleSurveySubmit}
//               id="survey-button"
//               className="btn btn-primary btn-lg submit-button"
//             >
//               {this.state.loadingSend ? (
//                 <AiOutlineLoading3Quarters className="icon-spin" />
//               ) : (
//                 <>Enviar Evaluación</>
//               )}
//             </button>
//           </main>
//         </FormContainer>
//       </>
//     );
//   }
// }
// 