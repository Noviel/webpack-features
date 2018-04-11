import React, { Component } from 'react';
import styled from 'react-emotion';

const getMainColor = props => props.theme && props.theme.mainColor;

const ButtonStyle = styled.button`
  color: ${getMainColor};
  background-color: white;
  border: 1px solid ${getMainColor};

  :hover {
    border: 1px solid blue;
  }
`;

class Button extends Component {
  static defaultProps = {
    caption: 'BUTTON',
  };

  render() {
    return <ButtonStyle>{this.props.caption}</ButtonStyle>;
  }
}

export default Button;
