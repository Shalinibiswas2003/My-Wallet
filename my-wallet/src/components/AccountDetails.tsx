// AccountDetails.js
import React, { useEffect, useState, FC } from 'react';
import { ethers } from 'ethers';
import { goerli } from '../models/chain';
import { toFixedIfNecessary } from './AccountUtils';
import { sendToken } from './TransactionUtils';
import { Account } from '../models/account';
import AccountTransactions from './AccountTransactions';
interface AccountDetailsProps {
  account: Account;
}

const AccountDetails: FC<AccountDetailsProps> = ({ account }) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [networkResponse, setNetworkResponse] = useState<{
    status: null | 'pending' | 'complete' | 'error';
    message: string | React.ReactElement;
  }>({
    status: null,
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(goerli.rpcUrl);
        const accountBalance = await provider.getBalance(account.address);
        setBalance(String(toFixedIfNecessary(ethers.utils.formatEther(accountBalance))));
      } catch (error) {
        console.error('Error fetching account balance:', error);
        // Handle the error as needed
      }
    };

    fetchData();
  }, [account]);

  function handleDestinationAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDestinationAddress(event.target.value);
  }

  function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAmount(Number.parseFloat(event.target.value));
  }

  async function transfer() {
    // Set the network response status to "pending"
    setNetworkResponse({
      status: 'pending',
      message: '',
    });

    try {
      // Assuming you have destinationAddress and amount as state variables
      const { receipt } = await sendToken(amount, account.address, destinationAddress, account.privateKey); // Update with your state variables

      if (receipt.status === 1) {
        // Set the network response status to "complete" and the message to the transaction hash
        setNetworkResponse({
          status: 'complete',
          message: (
            <p>
              Transfer complete!{' '}
              <a href={`${goerli.blockExplorerUrl}/tx/${receipt.transactionHash}`} target="_blank" rel="noreferrer">
                View transaction
              </a>
            </p>
          ),
        });
        return receipt;
      } else {
        // Transaction failed
        console.log(`Failed to send ${receipt}`);
        // Set the network response status to "error" and the message to the receipt
        setNetworkResponse({
          status: 'error',
          message: JSON.stringify(receipt),
        });
        return { receipt };
      }
    } catch (error: any) {
      // An error occurred while sending the transaction
      console.error({ error });
      // Set the network response status to "error" and the message to the error
      setNetworkResponse({
        status: 'error',
        message: error.reason || JSON.stringify(error),
      });
    }
  }

  return (
    <div>
      <h2>Account Details</h2>
      <p>
        Address:{' '}
        <a href={`${goerli.blockExplorerUrl}/address/${account.address}`} target="_blank" rel="noopener noreferrer">
          {account.address}
        </a>
      </p>
      <p>Balance: {balance} ETH</p>

      <div>
        <label>Destination Address:</label>
        <input type="text" value={destinationAddress} onChange={handleDestinationAddressChange} />
      </div>

      <div>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={handleAmountChange} />
      </div>

      <button type="button" onClick={transfer}>
        Send {amount} ETH
      </button>

      {networkResponse.status && (
        <>
          {networkResponse.status === 'pending' && <p>Transfer is pending...</p>}
          {networkResponse.status === 'complete' && <p>{networkResponse.message}</p>}
          {networkResponse.status === 'error' && <p>Error occurred while transferring tokens: {networkResponse.message}</p>}
        </>
      )}
       
    </div>
  );
};

export default AccountDetails;
