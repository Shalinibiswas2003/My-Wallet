const { Wallet } = require('ethers');

export const generateEthereumKeys = async (seedPhrase?: string) => {
  // If seedPhrase is not provided, generate a new random mnemonic
  const generatedSeedPhrase = seedPhrase || Wallet.createRandom().mnemonic.phrase;

  // Create a wallet from the generated mnemonic
  const wallet = Wallet.fromMnemonic(generatedSeedPhrase);

  // Connect to the Ethereum network
  await wallet.connect(wallet.provider);

  // Extract necessary information
  const privateKey: string = wallet.privateKey;
  const address: string = wallet.address;

  // Return the Ethereum keys
  return { seedPhrase: generatedSeedPhrase, privateKey, address };
};

export function toFixedIfNecessary( value: string, decimalPlaces: number = 2 ){
  return +parseFloat(value).toFixed( decimalPlaces );
}
export function shortenAddress(str: string, numChars: number=4) {
  return `${str.substring(0, numChars)}...${str.substring(str.length - numChars)}`;//...: This is a literal ellipsis, separating the first and last parts of the shortened address.
}
