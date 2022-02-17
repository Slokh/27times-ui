import {
  AuctionDetails,
  BidsTable,
  CountdownTimer,
} from "@27times/components/Auction";
import { Layout } from "@27times/components/Layout";
import { PoemImage } from "@27times/components/PoemImage";
import { fetchItemBids } from "@27times/utils/api";
import { isAuctionStarting } from "@27times/utils/constants";
import { allPoems } from "@27times/utils/metadata";
import {
  Flex,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Router from "next/router";
import { useEffect, useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const PoemDetails = ({ poem }: any) => (
  <Stack w="full" spacing={6}>
    <Heading textShadow="0 0 10px rgba(0,0,0,0.6)" fontFamily="Fake Receipt">
      {poem?.name}
    </Heading>
    <Text
      textShadow="0 0 10px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.6)"
      whiteSpace="pre-wrap"
    >
      {poem?.description}
    </Text>
  </Stack>
);

const Tabs = ({ options }: any) => {
  const [option, setOption] = useState(options[0]);

  return (
    <Stack w="full" spacing={6}>
      <Stack direction="row" justify="center" spacing={12}>
        {options.length > 1 &&
          options.map(({ label }: any, i: number) => (
            <Flex
              key={i}
              borderBottomColor="#E4B2BF"
              borderBottomWidth={
                options.findIndex((o: any) => o.label === option.label) === i
                  ? 2
                  : 0
              }
              textShadow="0 0 10px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.6)"
              onClick={() => setOption(options[i])}
              cursor="pointer"
              _hover={{
                borderBottomWidth: 2,
              }}
            >
              {label}
            </Flex>
          ))}
      </Stack>
      {option.value}
    </Stack>
  );
};

const Poem: NextPage = ({ poem }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bids, setBids]: any = useState([]);

  const isMobile = useBreakpointValue([true, true, true, false]);

  const refreshBids = async () => setBids(await fetchItemBids(poem.id));

  useEffect(() => {
    (async () => setBids(await fetchItemBids(poem.id)))();
  }, [poem.id]);

  let options = [{ label: "Poem", value: <PoemDetails poem={poem} /> }];
  if (!isAuctionStarting && bids?.length) {
    options.push({ label: "Top Bids", value: <BidsTable bids={bids} /> });
  }

  const right = isMobile ? undefined : (
    <PoemImage
      poem={allPoems.find(({ image }) => image === `/poems/${poem.name}.png`)}
      onClick={onOpen}
      maxW={96}
    />
  );

  return (
    <Layout right={right}>
      {isOpen && (
        <Lightbox
          mainSrc={poem.image}
          onCloseRequest={onClose}
          imagePadding={50}
        />
      )}
      <CountdownTimer bids={bids} />
      {!isAuctionStarting && (
        <AuctionDetails poem={poem} bids={bids} refreshBids={refreshBids} />
      )}
      <Tabs options={options} />
      {isMobile && (
        <PoemImage
          poem={allPoems.find(
            ({ image }) => image === `/poems/${poem.name}.png`
          )}
          maxW={[72, 96]}
        />
      )}
    </Layout>
  );
};

Poem.getInitialProps = async ({ res, query }) => {
  const poem = allPoems.find((poem: any) => poem.id === query.id);
  if (!poem) {
    if (res) {
      res.writeHead(302, {
        Location: "/",
      });
      res.end();
    } else {
      Router.push("/");
    }
  }
  return { poem };
};

export default Poem;
