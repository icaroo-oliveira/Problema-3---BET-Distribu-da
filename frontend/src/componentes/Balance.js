import React from "react";

const Balance = ({ balance, balance_wallet }) => {
  return (
    <div className="balance">
      <h1>{balance} ETH</h1>
      <h1>{balance_wallet} walletETH</h1>
    </div>
  );
};

export default Balance;
