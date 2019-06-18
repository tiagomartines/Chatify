import * as React from 'react';
import * as Apollo from 'react-apollo-hooks';
import gql from 'graphql-tag';
import idx from 'idx';
import styled from 'styled-components';
import SnackBar from 'react-material-snackbar';
import Input from '../components/Input';
import { RouterProps } from 'react-router';
import { TokenContext } from '../..';
import Loading from '../components/Loading';
import { Register, RegisterVariables } from './__generated__/Register';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  background-color: ${({ theme }) => theme.primary};
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  h1 {
    font-size: 43;
    color: white;
    font-weight: 500;
    text-align: center;
    width: 100%;
  }
  img {
    margin-top: -200px;
    height: 500px;
    width: auto;
    resize: vertical;
  }
  div {
    margin-top: -100px;
    width: 800px;
  }
  span {
    color: ${({ theme }) => theme.accent};
    font-weight: 500;
    font-size: 16px;
    margin-left: 10px;
    margin-right: 10px;
  }
  button {
    margin-right: 40px;
    min-width: 100px;
    height: 50px;
    background-color: ${({ theme }) => theme.accent};
    color: white;
    text-align: center;
    line-height: 50px;
    border-radius: 30px;
    font-size: 16px;
    border: none;
    outline: none;
  }
  li {
    margin-top: -40px;
    margin-bottom: 20px;
  }
  p {
    font-size: 18px;
    color: white;
    text-align: center;
    width: 100%;
  }
`;

const mutation = gql`
  mutation Register($email: String!, $name: String!, $password: String!) {
    register(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

interface Props extends RouterProps {}

const SignUp = (props: Props) => {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const registerMutation = Apollo.useMutation<Register>(mutation);
  const { setToken } = React.useContext(TokenContext);

  const mutate = async () => {
    setLoading(true);

    try {
      const loginRes = await registerMutation({
        variables: {
          email,
          password,
          name,
        } as RegisterVariables,
      });

      const token: string = idx(loginRes.data, _ => _.register.token) || '';

      setToken(token);
      setLoading(false);
    } catch (e) {
      // setLoading(false);
      const errorMessage = e.message.replace('GraphQL error: ', '');
      setErrorMessage(errorMessage);
      setLoading(false);
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }
  };

  const canRegister = email !== '' && password !== '' && errorMessage === '' && name !== '';

  return (
    <Wrapper>
      <img src="src/img/chatify.png" />
      <div>
        <li>
          <h1>Create an Account</h1>
          <p>Hey create your account to use the Chatify</p>
        </li>
        <Input onChange={e => setName(e.target.value)} value={name} placeholder="Name" type="text" />
        <Input onChange={e => setEmail(e.target.value)} value={email} placeholder="Email" type="email" />
        <Input onChange={e => setPassword(e.target.value)} value={password} placeholder="Password" type="password" />
        {loading ? (
          <Loading />
        ) : (
          <button
            disabled={!canRegister}
            style={
              canRegister
                ? {}
                : {
                    backgroundColor: 'grey',
                  }
            }
            onClick={() => mutate()}
          >
            Sign Up
          </button>
        )}
        <button onClick={() => props.history.push('/')}>Login</button>
        <SnackBar timer={2000} show={errorMessage !== ''}>
          <p>{errorMessage}</p>
        </SnackBar>
      </div>
    </Wrapper>
  );
};

export default SignUp;