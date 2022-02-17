import { Layout } from "@27times/components/Layout";
import { PoemImage } from "@27times/components/PoemImage";
import { getCountdown } from "@27times/utils";
import {
  END_DATE,
  isAuctionEnding,
  isAuctionStarting,
  START_DATE,
} from "@27times/utils/constants";
import { allPoems, leftPoems, rightPoems } from "@27times/utils/metadata";
import { Flex, Link, Stack, useBreakpointValue } from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useEffect, useState } from "react";

const Poem = ({ poem, onClick, isReversed }: any) => (
  <Stack
    pt={16}
    pb={[0, 0, isReversed ? 32 : 16]}
    w={[72, 72, 96, 96]}
    align={[
      "center",
      "center",
      "center",
      isReversed ? "flex-end" : "flex-start",
    ]}
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
  const [message, setMessage] = useState("");

  const _leftPoems = useBreakpointValue({
    base: [],
    md: leftPoems,
  });
  const _rightPoems = useBreakpointValue({
    base: allPoems,
    md: rightPoems,
  });

  useEffect(() => {
    let interval = setInterval(() => {
      const currentDate = new Date();
      if (isAuctionStarting) {
        setMessage(
          `Auctions starting in ${getCountdown(Date.now(), START_DATE)}`
        );
      } else if (isAuctionEnding) {
        setMessage(`Auctions ending in ${getCountdown(Date.now(), END_DATE)}`);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Layout message={message}>
      <Flex w="full" justify="center" pt={8}>
        <Stack align="flex-end">
          {_leftPoems?.map((poem, i) => (
            <Poem key={i} poem={poem} />
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
            <Poem key={i} poem={poem} isReversed />
          ))}
        </Stack>
      </Flex>
    </Layout>
  );
};

export default Home;
