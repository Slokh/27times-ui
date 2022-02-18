import { CountdownTimer } from "@27times/components/Auction";
import { Layout } from "@27times/components/Layout";
import { useBids } from "@27times/context/bids";
import { getCountdown } from "@27times/utils";
import {
  END_DATE,
  isAuctionEnding,
  isAuctionStarting,
  START_DATE,
} from "@27times/utils/constants";
import { allPoems } from "@27times/utils/metadata";
import { Flex, Image, Stack, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useEffect, useState } from "react";

const Poem = ({ poem }: any) => {
  const { getBidsForId } = useBids();
  const bids = getBidsForId(poem.id);

  const highestBid = bids?.length ? bids[0].bid_amount / 1e18 : 0;

  return (
    <Stack p={8}>
      <NextLink href={`/${poem.id}`}>
        <Image
          src={poem.image}
          alt={poem.name}
          h={64}
          w={64}
          objectFit="cover"
          objectPosition="0 0"
          cursor="pointer"
          shadow="base"
          transition="all 0.2s ease"
          _hover={{
            shadow: "0 0 10px #E4B2BF",
          }}
        />
      </NextLink>
      <Flex justify="space-between">
        <Text fontFamily="Fake Receipt" textShadow="0 0 10px rgba(0,0,0,0.6)">
          {`${highestBid.toFixed(3)} ETH`}
        </Text>
        <CountdownTimer bids={bids} rawDuration />
      </Flex>
    </Stack>
  );
};

const Home: NextPage = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    let interval = setInterval(() => {
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
      <Stack
        w="full"
        direction="row"
        spacing={0}
        wrap="wrap"
        justify="center"
        shouldWrapChildren
      >
        {allPoems.map((poem: any, i: number) => (
          <Poem key={i} poem={poem} />
        ))}
      </Stack>
    </Layout>
  );
};

export default Home;
