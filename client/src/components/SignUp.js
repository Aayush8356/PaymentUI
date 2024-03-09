import {
  Avatar,
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const URL = "https://contactmanagerbackend-y53j.onrender.com";

  const navigate = useNavigate();

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);
    try {
      const response = await fetch(`${URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      console.log(response);
      alert("registered!");

      if (response.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.log("error from register", error);
    }
  };
  return (
    <Container maxW={["full", "container.xl"]} h={"100vh"} p={"16"}>
      <form onSubmit={handleSubmit}>
        <VStack
          alignItems={"stretch"}
          spacing={8}
          w={["full", "96"]}
          m={"auto"}
          my={"16"}
        >
          <Heading p={1} alignSelf={"center"} border={"1px solid blueviolet "}>
            Contact MNGR
          </Heading>
          <Avatar
            alignSelf={"center"}
            boxSize={32}
            border={"1px solid blueviolet "}
          />
          <Input
            placeholder="username"
            type="text"
            name="username"
            value={user.username}
            onChange={handleInput}
            autoComplete="off"
            required
            focusBorderColor="green.400"
          />
          <Input
            placeholder="email"
            type="email"
            name="email"
            value={user.email}
            onChange={handleInput}
            autoComplete="off"
            required
            focusBorderColor="green.400"
          />
          <Input
            type="password"
            placeholder="password"
            name="password"
            value={user.password}
            onChange={handleInput}
            autoComplete="off"
            required
            focusBorderColor="green.400"
          />
          {/* <Input
            type="password"
            placeholder="Re-Enter Password"
            required
            focusBorderColor="green.400"
          /> */}
          <Text textAlign={"center"}>
            Already Signed Up?{" "}
            <Button variant={"link"}>
              <Link to={"/login"}>Login</Link>
            </Button>
          </Text>
          <Button colorScheme={"green"} type="submit">
            SignUp
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default SignUp;
