import { Layout } from "@27times/components/Layout";
import { poems } from "@27times/utils/metadata";
import { TriangleDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Image,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { addDays, format } from "date-fns";
import type { NextPage } from "next";
import { useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const PoemImage = ({ poem, onClick }: any) => (
  <Box
    w={64}
    h={64}
    position="relative"
    onClick={onClick}
    cursor="pointer"
    shadow="base"
    transition="all 0.2s ease"
    _hover={{
      shadow: "0 0 10px #E4B2BF",
    }}
  >
    <Image
      src={poem.image}
      alt={poem.date}
      objectFit="cover"
      objectPosition="0 0"
      maxH="100%"
      w="100%"
      zIndex={0}
    />
    <Flex
      zIndex={11}
      position="absolute"
      color="#E4B2BF"
      bottom={0}
      right={0}
      h="100%"
      w="100%"
      justify="center"
      align="flex-end"
      pb={1}
    >
      <TriangleDownIcon />
    </Flex>
    <Box
      zIndex={10}
      position="absolute"
      bgGradient="linear(to-t, #363435, transparent, transparent)"
      top={0}
      h="100%"
      w="100%"
    />
  </Box>
);

const Poem = ({ poem, onClick, isReversed }: any) => (
  <Stack
    pt={4}
    pb={4}
    h={[80, 80, 96, 96]}
    w={[80, 80, 96, 96]}
    align={isReversed ? "flex-end" : "flex-start"}
  >
    <Flex
      w="full"
      borderBottomColor="#E4B2BF"
      borderBottomWidth={1.5}
      fontSize="lg"
      fontFamily="monospace"
      textShadow="0 0 10px rgba(0,0,0,0.6)"
      whiteSpace="nowrap"
      justify={isReversed ? "flex-end" : "flex-start"}
    >
      {format(addDays(new Date(poem.date), 1), "MMM do, yyyy")}
    </Flex>
    <PoemImage poem={poem} onClick={onClick} />
  </Stack>
);

const Home: NextPage = () => {
  const [currentPoem, setCurrentPoem] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const leftPoems = useBreakpointValue({
    base: [],
    md: poems.filter((poem: any, i: number) => i % 2 === 0),
  });
  const rightPoems = useBreakpointValue({
    base: poems,
    md: poems.filter((poem: any, i: number) => i % 2 !== 0),
  });

  const handlePoemClick = (i: number) => {
    setCurrentPoem(i);
    onOpen();
  };

  return (
    <Layout>
      {isOpen && (
        <Lightbox
          mainSrc={poems[currentPoem].image}
          nextSrc={poems[(currentPoem + 1) % poems.length].image}
          prevSrc={poems[(currentPoem + poems.length - 1) % poems.length].image}
          onCloseRequest={onClose}
          onMovePrevRequest={() =>
            setCurrentPoem((currentPoem + poems.length - 1) % poems.length)
          }
          onMoveNextRequest={() =>
            setCurrentPoem((currentPoem + 1) % poems.length)
          }
          enableZoom={false}
          imagePadding={50}
        />
      )}
      <Flex w="full" justify="center" pt={8}>
        <Stack align="flex-end">
          {leftPoems?.map((poem, i) => (
            <Poem key={i} poem={poem} onClick={() => handlePoemClick(i)} />
          ))}
        </Stack>
        <Flex
          borderColor="#E4B2BF"
          borderWidth={1}
          borderRadius={64}
          borderStyle="dashed"
        />
        <Stack mt={[0, 0, 48]} align="flex-start">
          {rightPoems?.map((poem, i) => (
            <Poem
              key={i}
              poem={poem}
              onClick={() => handlePoemClick(i * 2 + 1)}
              isReversed
            />
          ))}
        </Stack>
      </Flex>
    </Layout>
  );
};

export default Home;
