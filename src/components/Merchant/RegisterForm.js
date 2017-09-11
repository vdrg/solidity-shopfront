import React from 'react';
import { Form } from 'semantic-ui-react';

const RegisterForm = ({ registerName, onChange, onSubmit }) => (
  <div>
    <p>You are not registered as a merchant!</p>
    <Form onSubmit={onSubmit}>
      <Form.Input label='Name' name='registerName' value={registerName} onChange={onChange} />
      <Form.Button>Register</Form.Button>
    </Form>
  </div>
);

export default RegisterForm;

