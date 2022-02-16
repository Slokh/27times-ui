import { ViewIcon } from "@chakra-ui/icons";
import { Box, Image } from "@chakra-ui/react";

export const PoemImage = ({ poem, onClick }: any) => (
  <Box
    w={64}
    onClick={onClick}
    cursor="pointer"
    shadow="base"
    transition="all 0.2s ease"
    _hover={{
      shadow: "0 0 10px #E4B2BF",
    }}
  >
    <Image
      src={poem.image}
      alt={poem.date}
      objectFit="cover"
      objectPosition="0 0"
      maxH="100%"
      w="100%"
      zIndex={0}
      loading="lazy"
    />
  </Box>
);
