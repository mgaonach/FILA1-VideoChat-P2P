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
        <img src={this.state.value ? this.props.imgOff : this.props.imgOn} alt="" width="50" height="50" />
      </button>
    );
  }
}

export default SwitchBtn;
