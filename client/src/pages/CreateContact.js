import {
  VStack,
  Input,
  HStack,
  Text,
  Container,
  Button,
  Avatar,
  Heading,
} from '@chakra-ui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
const CreateContact = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const { token, isLoggedIn } = useAuth();
  const URL = 'http://localhost:5000';
  const navigate = useNavigate();

  const [condition, setCondition] = useState(false);

  const handleInput = e => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const regex = /[^0-9]/g;
    if (user.phone.length !== 10 || regex.test(user.phone)) {
      alert('Invalid phone number');
      return;
    }
    setCondition(true);
    try {
      const response = await fetch(`${URL}/contact/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      console.log({ data });
      if (response.status === 401) {
        console.log('token expired');
        navigate('/logout');
      }
      if (response.ok) {
        toast('New contact saved!');
        setTimeout(() => {
          navigate('/contact');
        }, 2000);
      }
    } catch (error) {
      console.log('error from createContact', error);
    }
  };
  return (
    <>
      <Container maxW={['full', 'container.xl']} h={'100vh'} p={'16'}>
        <form onSubmit={handleSubmit}>
          <VStack
            alignItems={'stretch'}
            spacing={8}
            w={['full', '96']}
            m={'auto'}
            my={'16'}
          >
            <Heading p={1} alignSelf={'center'}>
              Newbie
            </Heading>
            <Input
              placeholder="Enter The Name"
              type="text"
              name="name"
              value={user.name}
              onChange={handleInput}
              autoComplete="off"
              required
              focusBorderColor="green.400"
            />
            <Input
              placeholder="Enter The Email Address"
              type="email"
              name="email"
              value={user.email}
              onChange={handleInput}
              autoComplete="off"
              required
              focusBorderColor="green.400"
            />
            <Input
              type="text"
              placeholder="Enter The Phone Number"
              name="phone"
              value={user.phone}
              onChange={handleInput}
              autoComplete="off"
              required
              focusBorderColor="green.400"
            />
            <Button
              hidden={user.name && user.email && user.phone ? false : true}
              colorScheme={'green'}
              type="submit"
              isLoading={condition}
              loadingText="Saving"
            >
              Save
            </Button>
            <ToastContainer />
          </VStack>
        </form>
      </Container>
    </>
  );
};

export default CreateContact;
