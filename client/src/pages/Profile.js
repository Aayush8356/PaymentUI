import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/auth';
import { HStack, VStack } from '@chakra-ui/react';
import SpinnerComp from '../components/SpinnerComp';
const Profile = () => {
  const { user, token } = useAuth();
  const [username, setusername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(true);
  const URL = 'http://localhost:5000';
  const userAuthentication = async () => {
    try {
      const response = await fetch(`${URL}/user/current`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (user.username && user.password) {
        const data = await response.json();
        console.log('response', data);
        setusername(data.username);
        setEmail(data.email);
        setLoading(false);
      }
    } catch (error) {
      console.error(error, 'Authentication failed');
    }
  };
  useEffect(() => {
    userAuthentication();
  }, []);
  return (
    <>
      <VStack maxW={['full', 'container.xl']} h={'100vh'} p={'16'}>
        {loading ? (
          <SpinnerComp />
        ) : (
          <>
            <HStack>
              <h1>Hello </h1>
              <p>{username}</p>
            </HStack>
            <HStack>
              <h1>Email: </h1>
              <p>{email}</p>
            </HStack>
          </>
        )}
      </VStack>
    </>
  );
};

export default Profile;
