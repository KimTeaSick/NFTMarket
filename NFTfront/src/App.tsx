import React, { FC, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import Main from "./Page/Main";
import Market from "./Page/Market";
import Mypage from "./Page/Mypage";

const App: FC = () => {
  
  const [account, setAccount] = useState<string>("");

  const getAccount = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setAccount(accounts[0]);
        console.log(account);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAccount();
  }, [account]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Main account={account} />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/market" element={<Market />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;