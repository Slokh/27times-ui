import { Box, Image } from "@chakra-ui/react";

export const PoemImage = ({ poem, onClick }: any) => (
  <Box>
    <Image
      w={64}
      src={poem.image}
      alt={poem.date}
      objectFit="cover"
      objectPosition="0 0"
      maxH="100%"
      zIndex={0}
      loading="lazy"
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
