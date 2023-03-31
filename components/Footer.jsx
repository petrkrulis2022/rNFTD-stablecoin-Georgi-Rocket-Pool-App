import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="pt-10">
      <div className="flex flex-row flex-wrap sm:flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap py-4 justify-between items-center shadow-inner pl-8 md:px-[90px]">
        <div className="flex flex-row justify-center items-center">
          <Link href="/">
            <Image
              className="inline-block"
              src="/stablecore-logo.jpg"
              alt="rNFTD Stablecore"
              width={70}
              height={10}
            />
          </Link>

          <span className="ml-16 text-xs font-normal">
            rNFTD Stablecoin 2023 - ALL rights reserved
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
