import { Layout } from "@27times/components/Layout";
import { leftPoems, rightPoems } from "@27times/utils/metadata";
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
  </Box>
);

const Poem = ({ poem, onClick, isReversed }: any) => (
  <Stack
    pt={16}
    pb={isReversed ? 32 : 16}
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
    />
    <PoemImage poem={poem} onClick={onClick} />
  </Stack>
);

const Home: NextPage = () => {
  const [currentPoem, setCurrentPoem] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const allPoems = leftPoems
    .concat(rightPoems)
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  const _leftPoems = useBreakpointValue({
    base: [],
    md: leftPoems,
  });
  const _rightPoems = useBreakpointValue({
    base: allPoems,
    md: rightPoems,
  });

  const handlePoemClick = (clicked: string) => {
    setCurrentPoem(allPoems.findIndex(({ date }) => date === clicked));
    onOpen();
  };

  return (
    <Layout>
      {isOpen && (
        <Lightbox
          mainSrc={allPoems[currentPoem].image}
          nextSrc={allPoems[(currentPoem + 1) % allPoems.length].image}
          prevSrc={
            allPoems[(currentPoem + allPoems.length - 1) % allPoems.length]
              .image
          }
          onCloseRequest={onClose}
          onMovePrevRequest={() =>
            setCurrentPoem(
              (currentPoem + allPoems.length - 1) % allPoems.length
            )
          }
          onMoveNextRequest={() =>
            setCurrentPoem((currentPoem + 1) % allPoems.length)
          }
          enableZoom={false}
          imagePadding={50}
        />
      )}
      <Flex w="full" justify="center" pt={8}>
        <Stack align="flex-end">
          {_leftPoems?.map((poem, i) => (
            <Poem
              key={i}
              poem={poem}
              onClick={() => handlePoemClick(poem.date)}
            />
          ))}
        </Stack>
        <Flex
          borderColor="#E4B2BF"
          borderWidth={1}
          borderRadius={64}
          borderStyle="dashed"
        />
        <Stack mt={[0, 0, 64]} align="flex-start">
          {_rightPoems?.map((poem, i) => (
            <Poem
              key={i}
              poem={poem}
              onClick={() => handlePoemClick(poem.date)}
              isReversed
            />
          ))}
        </Stack>
      </Flex>
    </Layout>
  );
};

export default Home;
