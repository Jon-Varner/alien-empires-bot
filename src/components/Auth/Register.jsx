import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Aux from '../../hoc/Auxiliary';

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    errors: {}
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <Aux>
        <p>
          If you want to be able to save and load games, you need to register.
          Email is not required, but if you don't enter one, you won't be able
          to recover a lost password.
        </p>
        <form>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={this.state.name}
            onChange={this.onChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.onChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.onChange}
            required
          />
          <input
            type="password"
            name="passwordMatch"
            placeholder="Confirm Password"
            value={this.state.passwordConfirm}
            onChange={this.onChange}
            required
          />
          <input type="submit" />
        </form>
      </Aux>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  registerFormUpdated: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(register);
