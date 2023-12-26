import React, { useState } from 'react';
import { generateEthereumKeys } from './AccountUtils';
import './Account.css'

const Account: React.FC = () => {
  const [isAccountCreated, setAccountCreated] = useState(false);

  const handleCreateAccount = () => {
    setAccountCreated(true);
    const keys = generateEthereumKeys();
    console.log(keys);
  };

  return (
    <div className="account-container">
      {isAccountCreated ? (
        <p className="success-message">Account created successfully!</p>
      ) : (
        <button className="create-account-button" onClick={handleCreateAccount}>
          Create Account
        </button>
      )}
    </div>
  );
};

export default Account;
