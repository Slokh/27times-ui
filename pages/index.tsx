import { Layout } from "@27times/components/Layout";
import { PoemImage } from "@27times/components/PoemImage";
import { fetchItems } from "@27times/utils/api";
import { allPoems, leftPoems, rightPoems } from "@27times/utils/metadata";
import { Flex, Link, Stack, useBreakpointValue } from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import "react-image-lightbox/style.css";

const Poem = ({ poem, onClick, isReversed }: any) => (
  <Stack
    pt={16}
    pb={[0, 0, isReversed ? 32 : 16]}
    w={[80, 80, 96, 96]}
    align={["center", "center", isReversed ? "flex-end" : "flex-start"]}
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
    <NextLink href={`/${poem.id}`} passHref>
      <Link>
        <PoemImage poem={poem} onClick={onClick} />
      </Link>
    </NextLink>
  </Stack>
);

const Home: NextPage = () => {
  // const [currentPoem, setCurrentPoem] = useState(0);
  // const { isOpen, onOpen, onClose } = useDisclosure();

  const _leftPoems = useBreakpointValue({
    base: [],
    md: leftPoems,
  });
  const _rightPoems = useBreakpointValue({
    base: allPoems,
    md: rightPoems,
  });

  // const [items, setItems] = useState([]);

  // useEffect(() => {
  //   (async () => setItems(await fetchItems()))();
  // }, []);

  // if (items?.length) {
  //   console.log(items);
  //   console.log(
  //     leftPoems.map((poem) => {
  //       const id = poem.image.split("/")[2].split(".png")[0];

  //       const item = items.find((i) => i.name === id);
  //       return {
  //         ...poem,
  //         id: item?.token_id,
  //         description: item?.description,
  //         name: item?.name,
  //       };
  //     })
  //   );
  //   console.log(
  //     rightPoems.map((poem) => {
  //       const id = poem.image.split("/")[2].split(".png")[0];

  //       const item = items.find((i) => i.name === id);
  //       return {
  //         ...poem,
  //         id: item?.token_id,
  //         description: item?.description,
  //         name: item?.name,
  //       };
  //     })
  //   );
  // }

  // const handlePoemClick = (clicked: string) => {
  //   setCurrentPoem(allPoems.findIndex(({ date }) => date === clicked));
  //   onOpen();
  // };

  return (
    <Layout>
      {/* {isOpen && (
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
      )} */}
      <Flex w="full" justify="center" pt={8}>
        <Stack align="flex-end">
          {_leftPoems?.map((poem, i) => (
            <Poem
              key={i}
              poem={poem}
              // onClick={() => handlePoemClick(poem.date)}
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
              // onClick={() => handlePoemClick(poem.date)}
              isReversed
            />
          ))}
        </Stack>
      </Flex>
    </Layout>
  );
};

export default Home;
