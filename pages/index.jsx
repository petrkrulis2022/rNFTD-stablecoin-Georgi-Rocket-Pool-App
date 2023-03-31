import {
  DAI_ADDRESS,
  RNFDT_DEPOSIT_ADDRESS,
  USDC_ADDRESS,
  USDT_ADDRESS,
} from "../constants/index";

import ERC20Json from "../contractsData/ERC20ABI.json";
import { FaAngleDown } from "react-icons/fa";
import RNFTDollarDepositJson from "../contractsData/RNFTDollarDepositABI.json";
import { ethers } from "ethers";
import { useSigner } from "wagmi";
import { useState } from "react";

export default function Home() {
  const { data: signer } = useSigner();
  const [amountValue, setAmountValue] = useState("");
  const [selectedStablecoin, setSelectedStablecoin] = useState("");

  const handleAmountValueChange = (event) => {
    setAmountValue(event.target.value);
  };

  const handleStablecoinChange = (event) => {
    setSelectedStablecoin(event.target.value);
  };

  const handleMintRNFTDClick = async () => {
    const selectedStablecoinContract = new ethers.Contract(
      selectedStablecoin,
      ERC20Json.abi,
      signer
    );

    const decimals = Number(await selectedStablecoinContract.decimals());

    await (
      await selectedStablecoinContract.approve(
        RNFDT_DEPOSIT_ADDRESS,
        ethers.utils.parseUnits(amountValue, decimals)
      )
    ).wait();

    const eNFTDollarDepositContract = new ethers.Contract(
      RNFDT_DEPOSIT_ADDRESS,
      RNFTDollarDepositJson.abi,
      signer
    );

    await (
      await eNFTDollarDepositContract.depositRPAndMintRNFTD(
        selectedStablecoin,
        ethers.utils.parseUnits(amountValue, decimals),
        decimals
      )
    ).wait();
  };

  return (
    <div className="max-w-7xl mx-auto px-8">
      <h1 className="text-4xl font-black mt-32">
        Mint rNFTD with a stablecoin of your choice
      </h1>

      <div className="grid mt-20 bg-[#eaf9ff] rounded-xl p-6">
        <div className="bg-[#eaf9ff] lg:flex gap-[50px] mb-10 grid">
          <input
            type="number"
            className="border-blue-700 text-sm shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter amount"
            onChange={handleAmountValueChange}
          />

          <div className="relative text-gray-800 bg-white w-full">
            <select
              id="stablecoin"
              className="border-blue-700 text-sm shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedStablecoin}
              onChange={handleStablecoinChange}
            >
              <option value="">Stablecoin</option>
              <option value={USDT_ADDRESS}>USDT</option>
              <option value={USDC_ADDRESS}>USDC</option>
              <option value={DAI_ADDRESS}>DAI</option>
            </select>
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700">
              <FaAngleDown />
            </div>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-center">
          <input
            type="number"
            disabled
            value={amountValue}
            className="border-blue-700 lg:w-2/4 w-full text-sm shadow appearance-none border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="rNFTD Received"
          />
        </div>

        <div className="mt-10 flex items-center justify-center">
          <button
            className="p-2 bg-blue-700 lg:w-1/4 w-full text-white w-24 rounded-lg font-medium"
            onClick={handleMintRNFTDClick}
            disabled={
              selectedStablecoin === "" || amountValue === "" ? true : false
            }
          >
            Mint
          </button>
        </div>
      </div>
    </div>
  );
}
