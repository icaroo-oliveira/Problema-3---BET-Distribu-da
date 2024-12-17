import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const AccountMenu = ({ accounts, selectedAccount, setSelectedAccount }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="account-menu">
      <div className="menu-header" onClick={toggleMenu}>
        {selectedAccount || "Selecione uma conta"} <FaChevronDown />
      </div>
      {isOpen && (
        <div className="menu-dropdown">
          {accounts.map((account, index) => (
            <div key={index} onClick={() => setSelectedAccount(account)}>
              {account}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
