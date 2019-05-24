import React from "react";

class SwitchBtn extends React.Component {
  constructor(props) {
    super(props);
    let value = true;
    if (props.value !== undefined) {
      value = props.value;
    }
    this.state = {
      value: value
    };
  }

  handle() {
    var func = this.state.value ? this.props.turnOff : this.props.turnOn;
    func();
    this.setState({
      value: !this.state.value
    });
  }

  render() {
    return (
      <button onClick={this.handle.bind(this)}>
        {"turn " + this.props.name + " " + (this.state.value ? "off" : "on")}
      </button>
    );
  }
}

export default SwitchBtn;
