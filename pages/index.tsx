import { Layout } from "@27times/components/Layout";
import { Polaroid } from "@27times/components/Polaroid";
import { fetchItems, fetchTopBids } from "@27times/utils/api";
import { Box, Stack } from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [items, setItems] = useState([]);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    (async () => setItems(await fetchItems()))();
    (async () => setBids(await fetchTopBids()))();
  }, []);

  return (
    <Layout>
      <Stack
        direction="row"
        p={8}
        spacing={0}
        wrap="wrap"
        shouldWrapChildren
        justify="center"
      >
        {items?.map((item: any, i: number) => (
          <NextLink key={i} href={`/${item.token_id}`}>
            <Box w={64}>
              <Polaroid
                item={item}
                bids={bids.filter(
                  ({ asset }: any) => asset.token_id === item.token_id
                )}
              />
            </Box>
          </NextLink>
        ))}
      </Stack>
    </Layout>
  );
};

export default Home;
