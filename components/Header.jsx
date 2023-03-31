import { FaBars, FaWallet } from "react-icons/fa";
import { signIn, signOut, useSession } from "next-auth/react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";

import Image from "next/image";
import Link from "next/link";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import { useRouter } from "next/router";
import { useState } from "react";

const Header = () => {
  const { data: session } = useSession();
  const { push } = useRouter();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();
  const [isVisibleMobileMenu, setIsVisibleMobileMenu] = useState(false);

  const renderWalletAddress = () => {
    const firstSixSymbols = session.user.address.slice(0, 6);
    const lastFourSymbols = session.user.address.slice(38, 42);

    return `${firstSixSymbols}...${lastFourSymbols}`;
  };

  const handleFaBarsBtnClick = () => {
    setIsVisibleMobileMenu(!isVisibleMobileMenu);
  };

  const handleOptionClick = () => {
    if (isVisibleMobileMenu) setIsVisibleMobileMenu(false);
  };

  const handleSignOutSessionClick = () => {
    handleOptionClick();
    signOut();
  };

  const handleAuthClick = async () => {
    if (isConnected) await disconnectAsync();

    const { account, chain } = await connectAsync({
      connector: new MetaMaskConnector(),
    });

    const { message } = await requestChallengeAsync({
      address: account,
      chainId: chain.id,
    });

    const signature = await signMessageAsync({ message });

    const { url } = await signIn("moralis-auth", {
      message,
      signature,
      redirect: false,
      callbackUrl: "/",
    });

    push(url);
  };

  return (
    <div className="z-[9999] w-full dark-mode:text-gray-200 dark-mode:bg-gray-800 py-2 fixed top-0 bg-white shadow-lg">
      <div className="flex xl:flex-row flex-col flex-wrap xl:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap px-4 justify-between xl:items-center xl:pl-8 xl:px-[90px] xl:ml-14">
        <div className="flex flex-row items-center justify-between">
          <Link href="/" className="mr-16">
            <Image
              src="/rNFTD-logo.jpg"
              alt="rNFTD Stablecoin"
              width={56}
              height={28}
            />
          </Link>
          <button
            className="xl:hidden rounded-lg focus:outline-none focus:shadow-outline"
            onClick={handleFaBarsBtnClick}
          >
            <FaBars />
          </button>
        </div>
        <nav
          className={`${
            isVisibleMobileMenu ? "" : "hidden"
          } xl:ml-20 flex-col flex-grow pb-4 xl:pb-0 xl:flex xl:justify-start xl:flex-row xl:space-x-6 sm:items-start xl:items-center lg:items-center xl:items-center 2xl:items-center`}
        >
          <div className="flex flex-row w-full sm:justify-start xl:justify-end">
            {session ? (
              <button
                onClick={handleSignOutSessionClick}
                className="flex items-center justify-between gap-2 xl:ml-2 whitespace-nowrap rounded-lg bg-indigo-800 text-md py-1 px-4 font-semibold text-white shadow-sm"
              >
                <span className="px-2">{renderWalletAddress()}</span>
                <span className="px-2">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={handleAuthClick}
                className="flex items-center justify-between gap-2 xl:ml-2 ml-3 whitespace-nowrap rounded-lg bg-indigo-800 text-md py-1 px-4 font-semibold text-white shadow-sm"
              >
                <FaWallet />
                Connect
              </button>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
