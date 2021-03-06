import { Box, Image } from "@chakra-ui/react";

export const PoemImage = ({ poem, maxW, onClick }: any) => (
  <Box>
    <Image
      maxW={maxW || 80}
      src={poem.image}
      alt={poem.date}
      objectFit="cover"
      objectPosition="0 0"
      maxH="100%"
      onClick={onClick}
      cursor="pointer"
      shadow="base"
      transition="all 0.2s ease"
      _hover={{
        shadow: "0 0 10px #E4B2BF",
      }}
    />
  </Box>
);
