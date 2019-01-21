import React from 'react';

import './Header.module.scss';

const header = props => (
  <header>
    <h1>{props.headline}</h1>
  </header>
);

export default header;
