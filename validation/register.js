const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  if (!Validator.isLength(data.name, { min: 8, max: 16 })) {
    errors.name = "Name must be between 8 and 16 characters";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
