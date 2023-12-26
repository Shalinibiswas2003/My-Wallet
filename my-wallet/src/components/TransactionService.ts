import axios from 'axios';

export class TransactionService {
  static API_URL = 'https://api.etherscan.io';
  static API_KEY = 'CAGS2PGWRVHM9ZZH1J3AX44MC3BEPN6BAH'; // Replace with your Etherscan API key

  static async getTransactions(address: string) {
    try {
      const response = await axios.get(`${TransactionService.API_URL}/api`, {
        params: {
          module: 'account',
          action: 'txlist', // Change 'proxy' to 'account', and 'eth_getTransactionByHash' to 'txlist'
          address: address, // Assuming the address parameter is the Ethereum address
          startblock: 0,
          endblock: 9999999999,
          page: 1,
          offset: 1000,
          sort: 'desc',
          apikey: TransactionService.API_KEY,
        },
      });

      console.log('Full API Response:', response);

      console.log('Etherscan API Response:', response.data);

      if (response.data.status === '1') {
        return response.data.result || [];
      } else {
        throw new Error(`Etherscan API error: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      throw new Error('Error fetching transactions. Please try again.');
    }
  }
}

/*const addressWithTransactions = '0x8888f9E3a62af1903508102019f1AB8555D4e9B8';

try {
  const transactions = await TransactionService.getTransactions(addressWithTransactions);
  console.log('Transactions:', transactions);
} catch (error: any) {
  console.error('Error:', error instanceof Error ? error.message : error);
  throw new Error('Error fetching transactions. Please try again.');
}*/
