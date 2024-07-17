import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({
  allErrors: true,
  $data: true,
});
addFormats(ajv);

export const stepOneSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    confirmPassword: { type: 'string', const: { $data: '1/password' } },
  },
  required: ['email', 'password', 'confirmPassword'],
  additionalProperties: false,
};

export const validateStepOne = ajv.compile(stepOneSchema);

export const stepTwoSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      pattern: "^[A-Za-z']+$", // Regex to allow only letters and apostrophe
    },
    lastName: {
      type: 'string',
      pattern: "^[A-Za-z']+$", // Regex to allow only letters and apostrophe
    },
  },
  required: ['firstName', 'lastName'],
  additionalProperties: false,
};

export const validateStepTwo = ajv.compile(stepTwoSchema);
