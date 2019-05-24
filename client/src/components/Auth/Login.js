import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Login extends Component {
  state = {
    username: '',
    password: '',
    errors: {}
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <form>
        <input
          type="text"
          name="name"
          placeholder="Username"
          value={this.state.username}
          onChange={this.onChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={this.state.password}
          onChange={this.onChange}
          required
        />
        <input type="submit" />
      </form>
    );
  }
}

/*
Login.propTypes = {
  login: PropTypes.func.isRequired,
  loginFormUpdated: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
*/

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(Login);
