import React, { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { HStack, VStack } from "@chakra-ui/react";
const Profile = () => {
  const { user, isLoggedIn } = useAuth();
  const [username, setusername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const navigate = useNavigate();
  const renderMe = () => {
    if (isLoggedIn) {
      setusername(user.username);
      setEmail(user.email);
    } else {
      console.log("not logged in");
      navigate("/logout");
    }
  };
  useEffect(() => {
    renderMe();
  });

  return (
    <>
      <VStack maxW={["full", "container.xl"]} h={"100vh"} p={"16"}>
        <HStack>
          <h1>Hello </h1>
          <p>{username}</p>
        </HStack>
        <HStack>
          <h1>Email: </h1>
          <p>{email}</p>
        </HStack>
      </VStack>
    </>
  );
};

export default Profile;
