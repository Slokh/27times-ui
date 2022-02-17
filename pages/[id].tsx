import { Layout } from "@27times/components/Layout";
import { PoemImage } from "@27times/components/PoemImage";
import { allPoems } from "@27times/utils/metadata";
import {
  Heading,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Router from "next/router";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const PoemDetails = ({ poem }: any) => (
  <Stack w="full" spacing={6} p={6}>
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

const Poem: NextPage = ({ poem }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue([true, true, false]);

  return (
    <Layout
      right={
        poem &&
        !isMobile && (
          <PoemImage
            poem={allPoems.find(
              ({ image }) => image === `/poems/${poem.name}.png`
            )}
            onClick={onOpen}
          />
        )
      }
    >
      {isOpen && (
        <Lightbox
          mainSrc={poem.image}
          onCloseRequest={onClose}
          imagePadding={50}
        />
      )}
      {poem && <PoemDetails poem={poem} />}
      {poem && isMobile && (
        <PoemImage
          poem={allPoems.find(
            ({ image }) => image === `/poems/${poem.name}.png`
          )}
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
