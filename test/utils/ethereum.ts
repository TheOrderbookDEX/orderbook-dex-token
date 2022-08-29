import { getProvider, Transaction } from '@theorderbookdex/abi2ts-lib';
import { ethers } from 'ethers';
import { EthereumProvider } from 'ganache';

// TODO move this to abi2ts
export async function predictContractAddress(nonceOffset = 0) {
    const provider = getProvider();
    const [ from ] = await provider.listAccounts();
    const nonce = await provider.getTransactionCount(from) + nonceOffset;
    return ethers.utils.getContractAddress({ from, nonce });
}

// TODO move this to abi2ts
export function transactionCost(tx: Transaction) {
    const receipt = tx['_receipt'] as ethers.providers.TransactionReceipt;
    const gasUsed = receipt.gasUsed.toBigInt();
    const effectiveGasPrice = receipt.effectiveGasPrice.toBigInt();
    return gasUsed * effectiveGasPrice;
}

// TODO move this to contract-test-helper
export async function setChainTime(timestamp: number) {
    const { ethereum } = globalThis as unknown as { ethereum: EthereumProvider };
    await ethereum.send('evm_setTime', [ timestamp * 1000 ]);
    await ethereum.send('evm_mine');
}
