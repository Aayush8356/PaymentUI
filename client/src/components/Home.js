import { Box, Container, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.jpg";
import img5 from "../assets/5.png";
import { useAuth } from "../store/auth";

const headingOptions = {
  pos: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%,-50%)",
  TextTransform: "upperCase",
  p: "4",
  size: "4xl",
};

const Home = () => {
  const { user, isLoggedIn } = useAuth();
  const { username } = user;
  const text = `Dear ${username},
  Welcome to our Contact Manager Web Application! We're delighted to have you join our community of users who are simplifying their contact management tasks with our intuitive platform. Our application is designed to streamline your contact organization, making it easier than ever to stay connected with your contacts, whether for personal or professional purposes. From categorizing contacts to setting reminders, our user-friendly interface empowers you to manage your contacts efficiently. Should you have any questions or need assistance, our dedicated support team is here to help. Thank you for choosing our Contact Manager Web Application—we're excited to support you in maintaining strong and meaningful connections.`;
  const message = isLoggedIn
    ? text
    : "Our Contact Manager website is a comprehensive online platform designed to simplify and enhance the way you manage your contacts. With intuitive features and user-friendly interface, our website offers a centralized hub for organizing, storing, and accessing all your contact information effortlessly. Whether you're an individual looking to streamline personal contacts or a business professional needing to maintain extensive client databases, our website caters to your needs.Key functionalities include the ability to categorize contacts, add custom fields for specific information, and tag contacts for easy retrieval. You can also set reminders for follow-ups, schedule meetings directly from the platform, and integrate communication tools for seamless interaction with your contacts.Moreover, our website ensures accessibility from any device with an internet connection, allowing you to stay connected on the go. Security and privacy are paramount, with robust encryption measures in place to safeguard your sensitive data.";

  return (
    <Box>
      <MyCarousel />
      <Container maxW={"container.xl"} minH={"100vh"} p={"16"}>
        <Heading
          textTransform={"uppercase"}
          py={"2"}
          w={"fit-content"}
          borderBottom={"2px solid"}
          m={"auto"}
        >
          Services
        </Heading>
        <Stack
          h="full"
          p={"4"}
          alignItems={"center"}
          direction={["column", "row", "row"]}
        >
          <Image src={img5} h={["40", "400"]} filter={"hue-rotate(-130deg)"} />
          <Text letterSpacing={"widest"} lineHeight={"190%"} p={["4", "16"]}>
            {message}
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};
const text1 = "Watch The Future";
const text2 = "Future Is Gaming";
const text3 = "Gaming On Console";
const text4 = "Night Life Is Cool";
const MyCarousel = () => (
  <Carousel
    autoPlay
    infiniteLoop
    interval={1000}
    showArrows={false}
    showThumbs={false}
    showStatus={false}
  >
    <Box w={"full"} h={"100vh"}>
      <Image src={img1} />
      <Heading bg={"blackAlpha.600"} color={"white"} {...headingOptions}>
        {text1}
      </Heading>
    </Box>

    <Box w={"full"} h={"100vh"}>
      <Image src={img2} />
      <Heading bg={"whiteAlpha.900"} color={"black"} {...headingOptions}>
        {text2}
      </Heading>
    </Box>

    <Box w={"full"} h={"100vh"}>
      <Image src={img3} />
      <Heading bg={"whiteAlpha.600"} color={"black"} {...headingOptions}>
        {text3}
      </Heading>
    </Box>

    <Box w={"full"} h={"100vh"}>
      <Image src={img4} />
      <Heading bg={"whiteAlpha.600"} color={"black"} {...headingOptions}>
        {text4}
      </Heading>
    </Box>
  </Carousel>
);

export default Home;
