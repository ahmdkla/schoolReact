import React, { Component } from "react";

export default class ComponentUnmount extends Component {
  componentWillUnmount = () => {
    alert("The Component Unmount");
  };
  render() {
    return <div>Hello</div>;
  }
}
