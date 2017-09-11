import React, { Component } from 'react';

import { render as blockies} from 'blockies-identicon';

class Blockies extends Component {
  getOpts () {
    return {
      seed: this.props.opts.seed || "foo",
      color: this.props.opts.color || "#dfe",
      bgcolor: this.props.opts.bgcolor || "#a71",
      size: this.props.opts.size || 15,
      scale: this.props.opts.scale || 3,
      spotcolor: this.props.opts.spotcolor || "#000"
    };
  }

  componentDidMount() {
    this.draw();
  }

  draw() {
    blockies(this.getOpts(), this.canvas);
  }

  render() {
    const { style } = this.props;
    return <canvas style={style} ref={canvas => this.canvas = canvas}/>;
  }
}

export default Blockies;
