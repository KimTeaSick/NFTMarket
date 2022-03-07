import React, { FC, useEffect, useState } from "react";
import Token from "../Components/Token";
import { NFTContract, saleNFTAddress } from "../Constracts";

interface MyPAgeProps {
  account: string;
}

const Mypage: FC<MyPAgeProps> = ({ account }) => {
  const [myTokens, setMyTokens] = useState<string[] | null>(null);
  const [saleStatus, setSaleStatus] = useState<boolean>(false);

  const getTokens = async () => {
    try {
      const balanceLenght = await NFTContract.methods.balanceOf(account).call();
      const getToken = await NFTContract.methods.getTokens(account).call();
      setMyTokens(getToken)

    } catch (e) {
      console.log(e);
    }
  }
  const getIsApprovedForAll = async () => {
    try {
      const response = await NFTContract.methods
        .isApprovedForAll(account, saleNFTAddress)
        .call();

      if (response) {
        setSaleStatus(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onClickApproveToggle = async () => {
    try {
      if (!account) return;

      const response = await NFTContract.methods
        .setApprovalForAll(saleNFTAddress, !saleStatus)
        .send({ from: account });

      if (response.status) {
        setSaleStatus(!saleStatus);
        console.log(saleStatus)
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!account) return;

    getTokens();
    getIsApprovedForAll();
  }, [account]);

  const show = () => {
    console.log(myTokens)
  }

  console.log(myTokens)


  return (
    <div>
      <p>{saleStatus}</p>
      <button onClick={show}>show</button>
      {
        myTokens && myTokens.map((v: any, i) => (
          <Token tokenNum = {v.tokenNum} /> 
        )
        )
      }

      <button
        onClick={onClickApproveToggle}
      >
        {saleStatus ? "Cancel" : "Approve"}
      </button>
    </div>
  )
}

export default Mypage;