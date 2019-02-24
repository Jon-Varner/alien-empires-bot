import React from 'react';
import PropTypes from 'prop-types';

import Aux from '../../hoc/Auxiliary';

const register = props => (
  <Aux>
    <p>Register a new user.</p>
  </Aux>
);

register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(register);
