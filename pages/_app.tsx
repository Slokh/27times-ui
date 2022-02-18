import { BidsProvider } from "@27times/context/bids";
import { getLibrary } from "@27times/utils/web3";
import { ChakraProvider } from "@chakra-ui/react";
import { Web3ReactProvider } from "@web3-react/core";
import { AppProps } from "next/app";
import Head from "next/head";
import "./style.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <Head>
        <title>Inverse Finance</title>
        <title>27 Times</title>
        <meta
          name="description"
          content="27 Times is a collection of original poetry by Karsen Daily, set to be minted on the Ethereum blockchain and sold as 1/1 NFTs in a 24 hour, no-minimum, no-reserve auction on February 18th, 2022."
        />
        <link rel="canonical" href="https://27times.xyz/" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="27 Times" />
        <meta
          property="og:description"
          content="27 Times is a collection of original poetry by Karsen Daily, set to be minted on the Ethereum blockchain and sold as 1/1 NFTs in a 24 hour, no-minimum, no-reserve auction on February 18th, 2022."
        />
        <meta property="og:url" content="https://27times.xyz/" />
        <meta property="og:site_name" content="27 Times" />
        <meta
          property="article:modified_time"
          content="2022-02-09T16:10:44+00:00"
        />
        <meta
          property="og:image"
          content="https://27times.xyz/wp-content/uploads/2022/01/social.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://27times.xyz/wp-content/uploads/2022/01/social.jpg"
        />
        <link rel="shortlink" href="https://27times.xyz/" />
        <link
          rel="icon"
          href="https://27times.xyz/wp-content/uploads/2022/01/cropped-favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="https://27times.xyz/wp-content/uploads/2022/01/cropped-favicon-192x192.png"
          sizes="192x192"
        />
        <link
          rel="apple-touch-icon"
          href="https://27times.xyz/wp-content/uploads/2022/01/cropped-favicon-180x180.png"
        />
        <meta
          name="msapplication-TileImage"
          content="https://27times.xyz/wp-content/uploads/2022/01/cropped-favicon-270x270.png"
        />
      </Head>
      <Web3ReactProvider getLibrary={getLibrary}>
        <BidsProvider>
          <Component {...pageProps} />
        </BidsProvider>
      </Web3ReactProvider>
    </ChakraProvider>
  );
};

export default App;
