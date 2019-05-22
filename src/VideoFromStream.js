import React from "react";

class VideoFromStream extends React.Component {
  constructor(props) {
    super(props);
    let ref = React.createRef();
    this.state = {
      ref: ref
    };
  }

  render() {
    return <video ref={this.state.ref} autoPlay />;
  }

  updateRef() {
    // eslint-disable-next-line
    this.state.ref.current.srcObject = this.props.stream;
  }
  componentDidMount = this.updateRef;
  componentDidUpdate = this.updateRef;
}

export default VideoFromStream;
