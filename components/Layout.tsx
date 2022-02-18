import { Flex, Image, Link, Stack, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import NextLink from "next/link";

export const Layout = ({ children, message, right }: any) => (
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
        justify={["center", "space-around"]}
        fontFamily="monospace"
        fontSize="md"
        fontWeight="semibold"
        color="#fff"
        position="relative"
        p={[0, 0, 8]}
      >
        <Flex
          bgImage="sidetext.png"
          left={0}
          minW={[0, 0, 16]}
          h="100vh"
          position="absolute"
          bgRepeat="no-repeat"
          bgAttachment="fixed"
        ></Flex>
        <Stack p={[4, 4, 8]} pt={[4, 4, 0]} align="center">
          <Stack maxW="2xl" align="center">
            <NextLink href="https://www.27times.xyz" passHref>
              <Link _hover={{ textDecoration: "none" }}>
                <Image src="header.png" alt="header" />
              </Link>
            </NextLink>
            <Stack
              key={message}
              w="full"
              pt={4}
              justify={["center", "center", "space-around"]}
              textAlign="center"
              align="center"
              direction={["column", "column", "row"]}
            >
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
              {message && (
                <Text
                  textShadow="0 0 10px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.6)"
                  color="#E4B2BF"
                  fontFamily="Fake Receipt"
                >
                  {message}
                </Text>
              )}
            </Stack>
          </Stack>
          <Stack w="full" p={[0, 0, 6]} align="center" spacing={6}>
            {children}
          </Stack>
        </Stack>
        {right && (
          <Flex justify="center" mt={16}>
            {right}
          </Flex>
        )}
      </Flex>
    </motion.div>
  </AnimatePresence>
);
