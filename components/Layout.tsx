import { getCountdown } from "@27times/utils";
import { END_DATE, START_DATE } from "@27times/utils/constants";
import { Flex, Image, Link, Stack, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import NextLink from "next/link";
import { useEffect, useState } from "react";

export const Layout = ({ children, right }: any) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    let interval = setInterval(() => {
      const currentDate = new Date();
      if (currentDate < START_DATE) {
        setMessage(
          `Auctions starting in ${getCountdown(currentDate, START_DATE)}`
        );
      } else if (currentDate < END_DATE) {
        setMessage(`Auctions ending in ${getCountdown(currentDate, END_DATE)}`);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: 0.4,
            ease: [0.61, 1, 0.88, 1],
          },
        }}
      >
        <Flex
          w="full"
          bgImage="karsen.jpg"
          bgSize="cover"
          minH="100vh"
          bgAttachment="fixed"
          justify={["center", "flex-start"]}
          fontFamily="monospace"
          fontSize="md"
          fontWeight="semibold"
          color="#fff"
        >
          <Flex
            bgImage="sidetext.png"
            minW={[0, 0, 16]}
            h="100vh"
            position="fixed"
            bgRepeat="no-repeat"
            bgAttachment="fixed"
          ></Flex>
          <Stack
            w={right ? "50%" : "full"}
            p={4}
            pl={right ? 32 : 4}
            align="center"
          >
            <Stack maxW="2xl" align="center">
              <NextLink href="/" passHref>
                <Link _hover={{ textDecoration: "none" }}>
                  <Image src="header.png" alt="header" />
                </Link>
              </NextLink>
              <Flex w="full" pt={4} justify="space-around">
                <Stack direction="row">
                  <NextLink href="https://twitter.com/karsendaily" passHref>
                    <Link _hover={{ textDecoration: "none" }}>
                      <Image w={8} src="twitter.png" alt="twitter" />
                    </Link>
                  </NextLink>
                  <NextLink
                    href="https://opensea.io/collection/27-times-by-karsen-daily"
                    passHref
                  >
                    <Link _hover={{ textDecoration: "none" }}>
                      <Image w={8} src="opensea.svg" alt="opensea" />
                    </Link>
                  </NextLink>
                </Stack>
                <Text
                  display={["none", "none", "block"]}
                  textShadow="0 0 10px rgba(0,0,0,0.6)"
                  color="#E4B2BF"
                  fontFamily="Fake Receipt"
                >
                  {message}
                </Text>
              </Flex>
            </Stack>
            {children}
          </Stack>
          {right && (
            <Flex w="50%" justify="center" mt={16}>
              {right}
            </Flex>
          )}
        </Flex>
      </motion.div>
    </AnimatePresence>
  );
};
