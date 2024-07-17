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
