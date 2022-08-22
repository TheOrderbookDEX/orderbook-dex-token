import { getProvider, Transaction } from '@theorderbookdex/abi2ts-lib';
import { ethers } from 'ethers';

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
