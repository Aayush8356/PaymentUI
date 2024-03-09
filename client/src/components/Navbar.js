import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,
  Button,
  useDisclosure,
  DrawerContent,
  VStack,
  HStack,
} from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { BiMenuAltLeft } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useAuth } from "../store/auth";
const Navbar = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isLoggedIn, user } = useAuth();
  const { username } = user;
  return (
    <>
      <Button
        pos={"fixed"}
        top={4}
        left={4}
        colorScheme={"green"}
        p={"0"}
        w={"10"}
        h={"10"}
        borderRadius={"full"}
        onClick={onOpen}
        zIndex={"overlay"}
      >
        <BiMenuAltLeft />
      </Button>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader color={"green"}>Contact MNGR</DrawerHeader>
          <DrawerBody>
            <VStack alignItems={"flex-start"}>
              <Button onClick={onClose} variant={"ghost"} colorScheme={"green"}>
                <Link to={"/"}>Home</Link>
              </Button>
              <Button onClick={onClose} variant={"ghost"} colorScheme={"green"}>
                <Link
                  target={"blank"}
                  to={"https://movie-ticket-zeta.vercel.app/"}
                  onClick={onClose}
                >
                  Movie Zone
                </Link>
              </Button>
            </VStack>
            <HStack
              position={"absolute"}
              bottom={"10"}
              left={"0"}
              width={"full"}
              justifyContent={"space-evenly"}
              p={10}
            >
              {isLoggedIn ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    // onClick={onClose}
                    variant={"ghost"}
                    colorScheme={"green"}
                  >
                    Profile
                  </MenuButton>
                  <MenuList>
                    <MenuGroup title={username}>
                      <MenuItem onClick={onClose}>
                        <Link to={"/profile"}>My Account</Link>
                      </MenuItem>
                      <MenuItem onClick={onClose}>
                        <Link to={"/contact"}>All Contacts </Link>
                      </MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                    <MenuGroup title="Help">
                      <MenuItem>FAQ</MenuItem>
                    </MenuGroup>
                  </MenuList>
                </Menu>
              ) : (
                <Button
                  onClick={onClose}
                  colorScheme={"green"}
                  variant={"outline"}
                >
                  <Link to={"/signup"}>Sign Up</Link>
                </Button>
              )}
              {isLoggedIn ? (
                <Button
                  onClick={onClose}
                  colorScheme={"green"}
                  variant={"outline"}
                >
                  <Link to={"/logout"}>Log Out</Link>
                </Button>
              ) : (
                <Button onClick={onClose} colorScheme={"green"}>
                  <Link to={"/login"}>Log In</Link>
                </Button>
              )}
            </HStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
