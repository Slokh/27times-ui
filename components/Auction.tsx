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
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
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
  subMinutes,
} from "date-fns";
import { isAddress } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import "react-image-lightbox/style.css";

const getDate = (timestamp: number) =>
  new Date(timestamp).getTime() -
  new Date(timestamp).getTimezoneOffset() * 60000;

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
  const { activate } = useWeb3React<Web3Provider>();

  const connectMetamask = () => {
    setTimeout(() => {
      activate(injectedConnector);
    }, 100);
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
            href={`https://opensea.io/${bid.from_account.address}`}
            target="_blank"
            textShadow="0 0 10px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.6)"
          >
            <ENSWrapper address={bid.from_account.address} />
          </Link>
          <Text
            color="#E4B2BF"
            textShadow="0 0 10px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.6)"
          >
            {formatDistanceStrict(getDate(bid.created_date), new Date(), {
              addSuffix: true,
            })}
          </Text>
        </Flex>
        <Text
          fontFamily="Fake Receipt"
          textShadow="0 0 10px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.6)"
        >{`${(bid.bid_amount / 1e18).toFixed(3)} WETH`}</Text>
      </Flex>
    ))}
  </Stack>
);

export const CountdownTimer = ({ bids, rawDuration }: any) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    let interval = setInterval(() => {
      if (isAuctionStarting) {
        setMessage(
          rawDuration
            ? ""
            : `Auction starting in ${getCountdown(Date.now(), START_DATE)}`
        );
      } else {
        let endDate = END_DATE;
        const lastBid = bids?.[0];

        // no winner
        if (!isAuctionEnding && !lastBid) {
          setMessage(rawDuration ? "Ended" : "Auction ended");
          return;
        }

        // winner, no extension
        const lastBidTime = getDate(lastBid.created_date);
        const latestDefaultBidTime = subMinutes(
          endDate,
          EXTENSION_AMOUNT
        ).getTime();
        if (!isAuctionEnding && lastBidTime < latestDefaultBidTime) {
          setMessage(rawDuration ? "Ended" : "Auction ended");
          return;
        }

        // winner, extension
        const latestBidTime = addMinutes(
          lastBidTime,
          EXTENSION_AMOUNT
        ).getTime();
        if (!isAuctionEnding && Date.now() > latestBidTime) {
          setMessage(rawDuration ? "Ended" : "Auction ended");
          return;
        }

        if (lastBidTime > latestDefaultBidTime) {
          endDate = latestBidTime;
        }

        setMessage(
          rawDuration
            ? getCountdown(Date.now(), endDate)
            : `Auction ending in ${getCountdown(Date.now(), endDate)}`
        );
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [bids, rawDuration]);

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

export const AuctionDetails = ({ poem }: any) => {
  const [input, setInput] = useState("");
  const { active, library, account } = useWeb3React<Web3Provider>();
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const bids = poem.bids;

  const highestBid = bids?.length ? bids[0].bid_amount / 1e18 : 0;

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
      setWarning("May take up to a minute to update");
    }
  };

  let isOver = false;
  if (bids && !isAuctionStarting) {
    let endDate = END_DATE;
    const lastBid = bids?.[0];

    // no winner
    if (!isAuctionEnding && !lastBid) {
      isOver = true;
    }

    // winner, no extension
    const lastBidTime = getDate(lastBid.created_date);
    const latestDefaultBidTime = subMinutes(
      endDate,
      EXTENSION_AMOUNT
    ).getTime();
    if (!isAuctionEnding && lastBidTime < latestDefaultBidTime) {
      isOver = true;
    }

    // winner, extension
    const latestBidTime = addMinutes(lastBidTime, EXTENSION_AMOUNT).getTime();
    if (!isAuctionEnding && Date.now() > latestBidTime) {
      isOver = true;
    }
  }

  return (
    <Stack w="full" align="center" spacing={6}>
      <Stack w="full" direction={["column", "row"]} justify="space-around">
        <Flex direction="column" align="center">
          <Text
            fontSize="3xl"
            fontFamily="Fake Receipt"
            textShadow="0 0 10px rgba(0,0,0,0.6)"
          >
            {`${highestBid.toFixed(3)} WETH`}
          </Text>
          <Text color="#E4B2BF" textShadow="0 0 10px rgba(0,0,0,0.6)">
            {highestBid ? (
              <ENSWrapper address={bids[0].from_account.address} />
            ) : (
              "no bids yet"
            )}
          </Text>
        </Flex>
        {!isOver && (
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
                      isDisabled={!!warning}
                    />
                    <Button
                      bgColor="#E4B2BF"
                      w={36}
                      _hover={{ bgColor: "#fff", color: "#E4B2BF" }}
                      isDisabled={
                        !input ||
                        isNaN(+input) ||
                        parseFloat(input) <= highestBid ||
                        !!warning
                      }
                      onClick={handleBid}
                    >
                      Bid WETH
                    </Button>
                  </Stack>
                  {!error ? (
                    <FormHelperText color="#fff">{warning}</FormHelperText>
                  ) : (
                    <FormErrorMessage>{error}</FormErrorMessage>
                  )}
                </FormControl>
              </>
            ) : (
              <ConnectButton />
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
