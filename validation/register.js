const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = validateRegisterInput = data => {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.passwordConfirm = !isEmpty(data.passwordConfirm)
    ? data.passwordConfirm
    : '';

  if (!validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = 'User name must be between 2 and 30 characters';
  }

  if (validator.isEmpty(data.username)) {
    errors.username = 'User name is required';
  }

  if (data.email !== '' && !validator.isEmail(data.email)) {
    errors.email = 'Please use a valid email address';
  }

  if (!validator.isLength(data.password, { min: 8, max: 30 })) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  }

  if (!validator.equals(data.password, data.passwordConfirm)) {
    errors.passwordConfirm = 'Passwords do not match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
