import React, { useState } from 'react';
import { useAuth } from '../store/auth';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
const Login = () => {
  const [user, setUser] = useState({
    username: '',
    password: '',
  });
  const URL = 'http://localhost:5000';

  const { storeTokenInLS, userAuthentication } = useAuth();
  const navigate = useNavigate();
  const handleInput = e => {
    let name = e.target.name;
    let value = e.target.value;
    setUser({ ...user, [name]: value });
  }; // comment
  const [condition, setCondition] = useState(false);
  // function handleOneClick(e) {
  //   setCondition(true);
  // }
  const handleSubmit = async e => {
    e.preventDefault();
    setCondition(true);
    try {
      const response = await fetch(`${URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        const data = await response.json();
        storeTokenInLS(data.accessToken);
        // await userAuthentication();
        alert('Login successful');
        navigate('/');
      } else {
        console.log('Failed to get response');
      }
    } catch (error) {
      console.error(error);
      setCondition(false);
    }
  };
  return (
    <Container maxW={['full', 'container.xl']} h={'100vh'} p={'16'}>
      <form onSubmit={handleSubmit}>
        <VStack
          alignItems={'stretch'}
          spacing={'8'}
          w={['full', '96']}
          m={'auto'}
          my={16}
        >
          <Heading m={'auto'}>WelCome Back</Heading>
          <Input
            placeholder="Email"
            type="email"
            name="email"
            value={user.email}
            onChange={handleInput}
            required
            focusBorderColor="green.400"
          />
          <Input
            type="password"
            placeholder="Password"
            name="password"
            value={user.password}
            onChange={handleInput}
            required
            focusBorderColor="green.400"
          />
          <Button variant={'link'} alignSelf={'end'}>
            <Link to={'/forgetPassword'}>Forget Password?</Link>
          </Button>
          <Button
            colorScheme={'green'}
            type="submit"
            isLoading={condition}
            loadingText="Logging In"
          >
            Login
          </Button>
          <Text textAlign={'center'}>
            New User?{' '}
            <Button variant={'link'}>
              <Link to={'/signup'}>SignUp</Link>
            </Button>
          </Text>
        </VStack>
      </form>
    </Container>
  );
};

export default Login;
