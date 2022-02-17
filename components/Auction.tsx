import { getCountdown } from "@27times/utils";
import { makeBid } from "@27times/utils/api";
import { injectedConnector } from "@27times/utils/connectors";
import {
  END_DATE,
  EXTENSION_AMOUNT,
  isAuctionEnding,
  isAuctionStarting,
  START_DATE,
} from "@27times/utils/constants";
import { setIsPreviouslyConnected } from "@27times/utils/web3";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import {
  addMinutes,
  differenceInMinutes,
  formatDistanceStrict,
} from "date-fns";
import { isAddress } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import "react-image-lightbox/style.css";

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

export const BidsTable = ({ bids }: any) => (
  <Stack w="full" spacing={6} textShadow="0 0 10px rgba(0,0,0,0.6)">
    {bids?.slice(0, 5).map((bid: any, i: number) => (
      <Flex key={i} justify="space-between" align="center">
        <Flex direction="column">
          <Link
            _hover={{ color: "#fff" }}
            href={`https://opensea.io/${bid.maker.address}`}
            target="_blank"
            textShadow="0 0 10px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.6)"
          >
            <ENSWrapper address={bid.maker.address} />
          </Link>
          <Text
            color="#E4B2BF"
            textShadow="0 0 10px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.6)"
          >
            {formatDistanceStrict(
              new Date(bid.listing_time * 1000),
              new Date(),
              { addSuffix: true }
            )}
          </Text>
        </Flex>
        <Text
          fontFamily="Fake Receipt"
          textShadow="0 0 10px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.6)"
        >{`${(bid.base_price / 1e18).toFixed(3)} ETH`}</Text>
      </Flex>
    ))}
  </Stack>
);

export const CountdownTimer = ({ bids }: any) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    let interval = setInterval(() => {
      if (isAuctionStarting) {
        setMessage(
          `Auction starting in ${getCountdown(Date.now(), START_DATE)}`
        );
      } else {
        let endDate = END_DATE;
        const lastBid = bids?.[0];
        const previousBid = bids?.[1];
        if (!isAuctionEnding) {
          if (!lastBid) {
            setMessage("Auction ended without winner");
            return;
          } else if (
            !previousBid ||
            previousBid.listing_time * 1000 <= endDate
          ) {
            setMessage("Auction ended");
            return;
          } else {
            endDate = previousBid.listing_time * 1000;
          }
        }

        if (lastBid) {
          const lastBidDate = lastBid.listing_time * 1000;
          const minutes = Math.abs(differenceInMinutes(endDate, lastBidDate));

          if (endDate < lastBidDate && minutes > EXTENSION_AMOUNT) {
            setMessage("Auction ended");
            return;
          }

          if (lastBidDate < endDate && minutes < EXTENSION_AMOUNT) {
            endDate = addMinutes(
              lastBid.listing_time * 1000,
              EXTENSION_AMOUNT
            ).getTime();
          }
        }

        setMessage(`Auction ending in ${getCountdown(Date.now(), endDate)}`);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [bids]);

  return (
    <Text
      textShadow="0 0 10px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.6)"
      color="#E4B2BF"
      fontFamily="Fake Receipt"
      textAlign="center"
    >
      {message}
    </Text>
  );
};

export const AuctionDetails = ({ poem, bids, refreshBids }: any) => {
  const [input, setInput] = useState("");
  const { active, library, account } = useWeb3React<Web3Provider>();
  const [error, setError] = useState("");

  const highestBid = bids?.length ? bids[0].base_price / 1e18 : 0;

  const handleBid = async () => {
    const error = await makeBid(
      library?.provider,
      account,
      poem.id,
      parseFloat(input)
    );
    if (error) {
      setError(error);
    } else {
      refreshBids(account, parseFloat(input), new Date().getTime() / 1000);
    }
  };

  return (
    <Stack w="full" align="center" spacing={6}>
      <Stack w="full" direction={["column", "row"]} justify="space-between">
        <Flex direction="column" align="center">
          <Text
            fontSize="3xl"
            fontFamily="Fake Receipt"
            textShadow="0 0 10px rgba(0,0,0,0.6)"
          >
            {`${highestBid.toFixed(3)} ETH`}
          </Text>
          <Text color="#E4B2BF" textShadow="0 0 10px rgba(0,0,0,0.6)">
            {highestBid ? (
              <ENSWrapper address={bids[0].maker.address} />
            ) : (
              "no bids yet"
            )}
          </Text>
        </Flex>
        <Stack direction="row" justify="center" align="center">
          {active && account ? (
            <>
              <FormControl w={64} isInvalid={!!error}>
                <Stack direction="row" justify="center" align="center">
                  <Input
                    _focus={{ outlineColor: "#E4B2BF" }}
                    fontWeight="bold"
                    fontSize="lg"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    textAlign="right"
                  />
                  <Button
                    bgColor="#E4B2BF"
                    w={24}
                    _hover={{ bgColor: "#fff", color: "#E4B2BF" }}
                    isDisabled={
                      !input || isNaN(+input) || parseFloat(input) <= highestBid
                    }
                    onClick={handleBid}
                  >
                    Bid
                  </Button>
                </Stack>
                <FormErrorMessage>{error}</FormErrorMessage>
              </FormControl>
            </>
          ) : (
            <ConnectButton />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
