import { Layout } from "@27times/components/Layout";
import { Polaroid } from "@27times/components/Polaroid";
import { fetchItem, fetchItemBids } from "@27times/utils/api";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { formatDistanceStrict, intervalToDuration } from "date-fns";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { setIsPreviouslyConnected } from "@27times/utils/web3";
import { injectedConnector } from "@27times/utils/connectors";
import { isAddress } from "ethers/lib/utils";
import Router from "next/router";

const ENSWrapper = ({ address }: any) => {
  const [name, setName] = useState(address);
  const { active, library } = useWeb3React<Web3Provider>();

  useEffect(() => {
    const fetchName = async () => {
      const lookup = await library?.lookupAddress(address);
      if (lookup) {
        setName(lookup);
      }
    };

    if (active && library) {
      fetchName();
    }
  }, [active, address, library]);

  return (
    <>{isAddress(name) ? `${name.slice(0, 5)}...${name.slice(-4)}` : name}</>
  );
};

const ConnectButton = () => {
  const { activate, deactivate, chainId } = useWeb3React<Web3Provider>();

  const isWrongNetwork = chainId && chainId !== 1;

  const disconnect = () => {
    close();
    setTimeout(() => {
      setIsPreviouslyConnected(false);
      deactivate();
      window.location.reload();
    }, 100);
  };

  const connectMetamask = () => {
    if (isWrongNetwork) {
      disconnect();
    } else {
      close();
      setTimeout(() => {
        activate(injectedConnector);
      }, 100);
    }
  };

  return (
    <Button
      bgColor="#E4B2BF"
      onClick={connectMetamask}
      _hover={{ bgColor: "#fff", color: "#E4B2BF" }}
    >
      Connect Wallet
    </Button>
  );
};

const Bids = ({ bids }: any) => (
  <Flex direction="column" w="full" p={8}>
    <Flex w="full" pb={4} textShadow="0 0 10px rgba(0,0,0,0.6)">
      <Text borderBottomColor="#E4B2BF" borderBottomWidth={2}>
        Top Bids
      </Text>
    </Flex>
    <Stack w="full" spacing={6} textShadow="0 0 10px rgba(0,0,0,0.6)">
      {bids?.slice(0, 5).map((bid: any, i: number) => (
        <Flex key={i} justify="space-between" align="center">
          <Flex direction="column">
            <Link
              color="#E4B2BF"
              _hover={{ color: "#fff" }}
              href={`https://opensea.io/${bid.maker.address}`}
              target="_blank"
            >
              <ENSWrapper address={bid.maker.address} />
            </Link>
            <Text>
              {formatDistanceStrict(
                new Date(bid.listing_time * 1000),
                new Date(),
                { addSuffix: true }
              )}
            </Text>
          </Flex>
          <Text fontSize="2xl">{`${(bid.base_price / 1e18).toFixed(
            3
          )} ETH`}</Text>
        </Flex>
      ))}
    </Stack>
  </Flex>
);

const ItemDetails = ({ item, highestBid }: any) => {
  const [duration, setDuration] = useState("0:00:00");
  const [input, setInput] = useState("");
  const { active, library } = useWeb3React<Web3Provider>();

  useEffect(() => {
    if (item?.sell_orders?.length) {
      let interval = setInterval(() => {
        let currentDate = new Date();
        let endDate = new Date(item?.sell_orders[0].closing_date);

        const { days, hours, minutes, seconds } = intervalToDuration({
          start: currentDate,
          end: endDate,
        });

        setDuration(
          `${(days || 0) * 24 + (hours || 0)}:${
            !minutes || minutes < 10 ? "0" : ""
          }${minutes}:${!seconds || seconds < 10 ? "0" : ""}${seconds}`
        );
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [item?.sell_orders]);

  const highestBidPrice = highestBid ? highestBid.base_price / 1e18 : undefined;

  return (
    <Stack w="full" spacing={6} p={6}>
      <Stack>
        <Heading fontFamily="monospace" textShadow="0 0 10px rgba(0,0,0,0.6)">
          {item?.name}
        </Heading>
        <Text textShadow="0 0 10px rgba(0,0,0,0.6)">{item?.description}</Text>
      </Stack>
      <Stack direction="row" justify="space-around">
        <Flex direction="column" align="center">
          <Heading fontFamily="monospace" textShadow="0 0 10px rgba(0,0,0,0.6)">
            {highestBidPrice ? (
              <Flex>{`${highestBidPrice.toFixed(3)} ETH`}</Flex>
            ) : (
              <Flex>-</Flex>
            )}
          </Heading>
          <Text color="#E4B2BF" textShadow="0 0 10px rgba(0,0,0,0.6)">
            Highest Bid
          </Text>
        </Flex>
        <Flex direction="column" align="center">
          <Heading fontFamily="monospace" textShadow="0 0 10px rgba(0,0,0,0.6)">
            {duration}
          </Heading>
          <Text color="#E4B2BF" textShadow="0 0 10px rgba(0,0,0,0.6)">
            Time Left
          </Text>
        </Flex>
      </Stack>
      <Stack direction="row" justify="center" align="center">
        {active ? (
          <>
            <Input
              w={64}
              _focus={{ outlineColor: "#E4B2BF" }}
              fontWeight="bold"
              fontSize="lg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              bgColor="#E4B2BF"
              w={24}
              _hover={{ bgColor: "#fff", color: "#E4B2BF" }}
              isDisabled={!input || isNaN(+input)}
            >
              Bid
            </Button>
          </>
        ) : (
          // <ConnectButton />
          <></>
        )}
      </Stack>
    </Stack>
  );
};

const Item: NextPage = ({ id }: any) => {
  const [item, setItem]: any = useState();
  const [bids, setBids]: any = useState([]);

  useEffect(() => {
    (async () => setItem(await fetchItem(id)))();
    (async () => setBids(await fetchItemBids(id)))();
  }, [id]);

  return (
    <Layout
      right={
        item && (
          <Box position="fixed" className="flip-card" w="xl" h="xl">
            <Box className="flip-card-inner">
              <Box className="flip-card-front">
                <Polaroid item={item} bids={bids} isFull />
              </Box>
              <Box className="flip-card-back">
                <Polaroid bids={bids} isFull>
                  <Text>{item.description}</Text>
                </Polaroid>
              </Box>
            </Box>
          </Box>
        )
      }
    >
      {item && <ItemDetails item={item} highestBid={bids?.[0]} />}
      {bids && <Bids bids={bids} />}
    </Layout>
  );
};

Item.getInitialProps = async ({ res, query }) => {
  if (res) {
    // server
    res.writeHead(302, {
      Location: "/",
    });

    res.end();
  } else {
    // client
    Router.push("/");
  }

  return { id: query.id };
};

export default Item;
