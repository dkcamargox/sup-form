import React, { Component } from "react";

import Header from "../../components/Header";
import FormContainer from "../../components/FormContainer";

import "./end.css";

export default class Seller extends Component {
  state = {
    lastOne: false,
    surveyClientCountage: 30,
    coachingClientCountage: 12
  };

  handleSameRoute = (e) => {
    // send all info as parameters creating a recurtion
    const {
      formType,
      clientCountage,
      seller,
      route,
      id,
      sellerName
    } = this.props.location.state;
    return this.props.history.push(`/${formType}`, {
      formType: formType,
      clientCountage: Number(clientCountage) + 1,
      seller: seller,
      route: route,
      id: id,
      sellerName: sellerName
    });
  };

  handleBackToRouteSelection = (e) => {
    // go back to the seller selection leaving the lstorage as it is
    return this.props.history.push("/preventista");
  };

  saveProgressInLocalStorage = () => {
    const {
      id,
      seller,
      route,
      clientCountage,
      formType,
      sellerName
    } = this.props.location.state;

    console.log("/fin location.state:");
    console.log(this.props.location.state);

    // get progresses from lstorage
    const storedProgresses = JSON.parse(
      window.localStorage.getItem("progress")
    );

    var progresses;
    if (storedProgresses !== null && storedProgresses.length !== 0) {
      // if its not empty try to find this progress
      const popedProgress = storedProgresses.filter(
        (progress) => progress.id !== id
      );
      // set the progresses without the old data
      progresses = popedProgress;
    } else {
      progresses = [];
    }

    const { surveyClientCountage, coachingClientCountage } = this.state;
    // if its survey change the limit of submitions to 30
    if (formType === "relevamiento") {
      // if its not the max number of submitions
      if (clientCountage !== surveyClientCountage) {
        // append the new data to the progresses array of data
        progresses.push({
          id,
          formType,
          clientCountage,
          route,
          seller,
          sellerName
        });
      }
    }
    if (formType === "coaching") {
      //if its coaching limit of sumitions 12
      if (clientCountage !== coachingClientCountage) {
        // append the new data to the progresses array of data
        progresses.push({
          id,
          formType,
          clientCountage,
          route,
          seller,
          sellerName
        });
      }
    }
    // set it all to the local storage
    window.localStorage.setItem("progress", JSON.stringify(progresses));
    return;
  };

  componentDidMount() {
    try {
      const { clientCountage, formType } = this.props.location.state;
      const { surveyClientCountage, coachingClientCountage } = this.state;

      if (formType === "relevamiento") {
        if (clientCountage === surveyClientCountage) {
          this.setState({ lastOne: true });
        }
      } else if (formType === "coaching") {
        if (clientCountage === coachingClientCountage) {
          this.setState({ lastOne: true });
        }
      }

      this.saveProgressInLocalStorage();
    } catch (error) {
      console.log(error);
      this.props.history.push("/preventista");
      return;
    }
  }
  // recovers actual client from localStorage if 30(survey) or 12(coaching)
  // conditional rendering the NextClient btn
  render() {
    const { lastOne } = this.state;
    return (
      <>
        <Header />
        {/* <Auth /> */}
        <FormContainer>
          <main className="end">
            <h2>Fin</h2>
            <hr />
            <div
              className={
                !lastOne
                  ? "end-button-wrap"
                  : "end-button-wrap end-button-wrap-ended"
              }
            >
              <button
                disabled={this.state.loadingLogIn}
                onClick={this.handleBackToRouteSelection}
                id="continue-button"
                className={
                  !lastOne
                    ? "btn btn-danger  btn-lg end-button"
                    : "btn btn-danger  btn-lg end-button end-button-ended"
                }
              >
                Selección de ruta
              </button>
              {!lastOne ? (
                <button
                  disabled={this.state.loadingLogIn}
                  onClick={this.handleSameRoute}
                  id="begin-button"
                  className="btn btn-primary  btn-lg end-button"
                >
                  Proximo cliente
                </button>
              ) : null}
            </div>
          </main>
        </FormContainer>
      </>
    );
  }
}