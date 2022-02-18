import { CountdownTimer } from "@27times/components/Auction";
import { Layout } from "@27times/components/Layout";
import { usePoems } from "@27times/context/bids";
import { Flex, Image, Stack, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";

const Poem = ({ poem }: any) => {
  const bids = poem.bids;

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
  const { poems } = usePoems();
  return (
    <Layout message={"Auctions Live!"}>
      <Stack
        w="full"
        direction="row"
        spacing={0}
        wrap="wrap"
        justify="center"
        shouldWrapChildren
      >
        {poems.map((poem: any, i: number) => (
          <Poem key={i} poem={poem} />
        ))}
      </Stack>
    </Layout>
  );
};

export default Home;
