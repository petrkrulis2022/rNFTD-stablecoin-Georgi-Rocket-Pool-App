import "tailwindcss/tailwind.css";

import {
  WagmiConfig,
  configureChains,
  createClient,
  defaultChains,
} from "wagmi";

import Footer from "../components/Footer";
import Head from "next/head";
import Header from "../components/Header";
import { SessionProvider } from "next-auth/react";
import { publicProvider } from "wagmi/providers/public";

const { provider, webSocketProvider } = configureChains(defaultChains, [
  publicProvider(),
]);

const client = createClient({ provider, webSocketProvider, autoConnect: true });

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <Head>
          <title>rNFTD Stablecoin</title>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="description" content="rNFTD Stablecoin" />
        </Head>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-grow">
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </SessionProvider>
    </WagmiConfig>
  );
}
