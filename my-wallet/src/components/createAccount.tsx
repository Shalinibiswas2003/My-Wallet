




// Account.js
import React, { useState, useEffect, useCallback } from 'react';
import { generateEthereumKeys } from './AccountUtils';
import './Account.css';
import AccountDetails from './AccountDetails';
import { Account as AccountModel } from '../models/account';

const recoveryPhraseKeyName = 'recoveryPhrase';

const Account = () => {
  const [isRecoveryMode, setRecoveryMode] = useState(false);
  const [seedPhraseInput, setSeedPhraseInput] = useState('');
  const [account, setAccount] = useState<AccountModel | null>(null);

  const handleCreateAccount = async () => {
    try {
      const keys = await generateEthereumKeys();
      const newAccount = {
        seedPhraseInput: '', // Provide a default or leave it empty based on your needs
        address: keys.address,
        privateKey: keys.privateKey,
        balance: '', // You can set balance if you have it available at this point
      };

      // Set the new account
      setAccount(newAccount);

      // Store seed phrase in localStorage
      localStorage.setItem(recoveryPhraseKeyName, keys.seedPhrase);

      console.log(keys);
    } catch (error) {
      console.error('Error creating account:', error);
      // Handle the error as needed, e.g., show an error message to the user
    }
  };

  const handleRecoverAccount = () => {
    setRecoveryMode(true);
  };

  const handleSeedPhraseInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeedPhraseInput(event.target.value);
  };

  const handleSeedPhraseEnter = async () => {
    try {
      // Call generateEthereumKeys with the provided seed phrase
      const keys = await generateEthereumKeys(seedPhraseInput);
      console.log(keys);

      // Set the recovered account
      setAccount({
        seedPhraseInput: '', // Reset seedPhraseInput
        address: keys.address,
        privateKey: keys.privateKey,
        balance: '', // You can set balance if you have it available at this point
      });

      // Optionally, you can reset the input and exit recovery mode here
      setSeedPhraseInput('');
      setRecoveryMode(false);
    } catch (error) {
      console.error('Error recovering account:', error);
      // Handle the error as needed, e.g., show an error message to the user
    }
  };

  const handleSeedPhraseKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (isRecoveryMode) {
        handleSeedPhraseEnter(); // Trigger recovery on Enter key
      } else {
        handleCreateAccount(); // Trigger account creation on Enter key
      }
    }
  };

  const recoverAccount = useCallback(
    async (recoveryPhrase: string) => {
      const result = await generateEthereumKeys(recoveryPhrase);
      setAccount({
        seedPhraseInput: '', // Reset seedPhraseInput
        address: result.address,
        privateKey: result.privateKey,
        balance: '', // You can set balance if you have it available at this point
      });

      if (localStorage.getItem(recoveryPhraseKeyName) !== recoveryPhrase) {
        localStorage.setItem(recoveryPhraseKeyName, recoveryPhrase);
      }
    },
    []
  );

  useEffect(() => {
    const localStorageRecoveryPhrase = localStorage.getItem(recoveryPhraseKeyName);
    if (localStorageRecoveryPhrase) {
      setSeedPhraseInput(localStorageRecoveryPhrase);
      recoverAccount(localStorageRecoveryPhrase);
    }
  }, [recoverAccount]);

  return (
    <div className="account-container">
      <>
        <h2>My-Wallet</h2>
        <div className="buttons">
          <button className="create-account-button" onClick={handleCreateAccount}>
            Create Account
          </button>
          <button className="recover-account-button" onClick={handleRecoverAccount}>
            Recover Account
          </button>
        </div>

        {isRecoveryMode && (
          <div className="try">
            <input
              type="text"
              placeholder="Enter Seed Phrase"
              value={seedPhraseInput}
              onChange={handleSeedPhraseInputChange}
              onKeyDown={handleSeedPhraseKeyDown} 
            />
            <button className="recover-button" onClick={handleSeedPhraseEnter}>
              Recover
            </button>
          </div>
        )}

        {account && <AccountDetails account={account} />}
      </>
    </div>
  );
};

export default Account;
