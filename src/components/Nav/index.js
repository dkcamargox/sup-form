import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Nav extends Component {
  state = {
      isFormActive: false,
      isStatisticsActive: false
  }
  constructor(props) {
    super(props);

    this.state.isFormActive = this.props.active === "form"
    this.state.isStatisticsActive = this.props.active === "statistics"
  }
  render() {
    const isActive = this.state;
    return (
      <ul 
        class="nav nav-tabs justify-content-end"
        style={{marginBottom: '1.6rem'}}
      >
        <li class="nav-item">
          <Link id="form-link" class={`nav-link ${isActive.isFormActive?"active":null}`} to="preventista">Formularios</Link>
        </li>
        <li class="nav-item">
          <Link id="statistics-link" class={`nav-link ${isActive.isStatisticsActive?"active":null}`} to="estatisticas">Estatisticas</Link>
        </li>
      </ul>
    );
  }
};

