import { Flex, Image, Stack } from "@chakra-ui/react";
import { intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";

export const Polaroid = ({ item, bids, isFull, children }: any) => {
  const [duration, setDuration] = useState("");

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

  const highestBid = bids?.length ? bids[0].current_price / 1e18 : undefined;

  return (
    <Stack
      direction="column"
      bgImage="paper.jpg"
      bgSize="cover"
      justify="center"
      align="center"
      shadow="base"
      filter={isFull ? "" : "brightness(80%)"}
      _hover={
        isFull
          ? {}
          : {
              cursor: "pointer",
              filter: "brightness(100%)",
              transform: "rotate(-2deg)",
            }
      }
      transition="all 0.5s ease"
      spacing={1}
      textAlign="start"
      color="#000"
      p={3}
      m={6}
      h="full"
    >
      {children || (
        <>
          <Flex w="full" h="full" justify="center" align="center">
            <Image
              w="98%"
              h="97%"
              src={item?.image_url}
              alt={item?.name}
              objectFit="cover"
            />
          </Flex>
          <Flex pt={2} w="full">
            {item?.name}
          </Flex>
          <Flex w="full" justify="space-between" fontWeight="medium">
            {highestBid ? (
              <Flex>{`${highestBid.toFixed(2)} ETH`}</Flex>
            ) : (
              <Flex color="#E4B2BF">no bids</Flex>
            )}
            <Flex>{duration}</Flex>
          </Flex>
        </>
      )}
    </Stack>
  );
};
