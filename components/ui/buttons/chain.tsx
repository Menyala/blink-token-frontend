"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import useWallet from "@/hooks/wallet/useWallet";

import { Button } from "./button";

import config from "@/uiconfig.json";
import { chains } from "@/constants/common";

const ChainButton = () => {
  const [currentChainId, setCurrentChainId] = useState<number>(0);
  const { switchChain } = useWallet();
  const chainInfo = chains[currentChainId as keyof typeof chains];

  const onSwitchChain = async () => {
    try {
      await switchChain(config.chain.id.toString(16));
      setCurrentChainId(config.chain.id);
    } catch (error) {
      console.log({ error });
    }
  };

  if (typeof window !== "undefined") {
    window.ethereum.on("chainChanged", (chainId: string) => {
      setCurrentChainId(parseInt(chainId, 16));
    });
  }

  useEffect(() => {
    setCurrentChainId(parseInt(window.ethereum.chainId, 16));
  }, [typeof window]);

  return (
    <Button
      className="flex gap-2 items-center px-4 py-2 rounded-md"
      onClick={onSwitchChain}
    >
      {currentChainId === config.chain.id ? (
        <>
          <Image
            src={chainInfo.logoUrl}
            width={24}
            height={24}
            alt="chain-logo"
            className="rounded-full"
          />
          <p className={"font-semibold"}>{chainInfo.name}</p>
        </>
      ) : (
        <p className={"font-semibold"}>Switch Chain</p>
      )}
    </Button>
  );
};

export default ChainButton;
