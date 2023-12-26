// AccountTransactions.tsx
import React, { useEffect, useState } from 'react';
import { TransactionService } from './TransactionService';
import { Account } from '../models/account';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  // Add other properties based on your actual data model
}

interface AccountTransactionsProps {
  account: Account;
}

const AccountTransactions: React.FC<AccountTransactionsProps> = ({ account }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [networkResponse, setNetworkResponse] = useState<{
    status: null | 'pending' | 'complete' | 'error';
    message: string | React.ReactElement;
  }>({
    status: null,
    message: '',
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setNetworkResponse({
          status: 'pending',
          message: 'Fetching transactions...',
        });

        // Assuming you have a TransactionService with a method to fetch transactions
        const response = await TransactionService.getTransactions(account.address);
        setTransactions(response.data.result);

        setNetworkResponse({
          status: 'complete',
          message: 'Transactions fetched successfully',
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);

        setNetworkResponse({
          status: 'error',
          message: 'Error fetching transactions. Please try again.',
        });
      }
    };

    fetchTransactions();
  }, [account.address]);


  return (
    <div>
      <h2>Account Transactions</h2>

      {networkResponse.status === 'pending' && <p>{networkResponse.message}</p>}
      {networkResponse.status === 'complete' && (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              {/* Display transaction details here */}
              Transaction ID: {transaction.id}, Amount: {transaction.amount}, Date: {transaction.date}
            </li>
          ))}
        </ul>
      )}
      {networkResponse.status === 'error' && <p>Error: {networkResponse.message}</p>}
    </div>
  );
};

export default AccountTransactions;
