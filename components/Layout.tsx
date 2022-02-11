import { Flex, Image, Link, Stack } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import NextLink from "next/link";

export const Layout = ({ children, right }: any) => (
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
          minHeight="100%"
          h="100vh"
          position="fixed"
          bgRepeat="no-repeat"
          bgAttachment="fixed"
        ></Flex>
        <Stack w={right ? "50%" : ""} p={8} pl={24} pr={8} align="center">
          <Stack maxW="2xl" align="center">
            <Image src="header.png" alt="header" />
            <Stack direction="row" pt={4}>
              <NextLink href="https://twitter.com/karsendaily" passHref>
                <Link _hover={{ textDecoration: "none" }}>
                  <Image w={8} src="twitter.png" alt="twitter" />
                </Link>
              </NextLink>
              <NextLink href="https://opensea.io" passHref>
                <Link _hover={{ textDecoration: "none" }}>
                  <Image w={8} src="opensea.svg" alt="opensea" />
                </Link>
              </NextLink>
            </Stack>
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
