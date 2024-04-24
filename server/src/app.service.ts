import { Injectable } from '@nestjs/common';
import {
  EP_ADDRESS,
  FA_ADDRESS,
  INFURA_SEPOLOA_RPC,
  PAYMASTER_PK,
  SUPPORTED_NETWORKS,
} from './constants';
import { JsonRpcProvider, Wallet, ethers } from 'ethers';
import { abi as FA_ABI } from '../../contracts/out/FactoryAccount.sol/FactoryAccount.json';
import { abi as EP_ABI } from '../../contracts/out/IEntrypoint.sol/IEntryPoint.json';

@Injectable()
export class AppService {
  pong(): string {
    return 'Playing Ping-Pong';
  }

  async deploySw(owner: string, network: SUPPORTED_NETWORKS): Promise<string> {
    let rpc = '';
    switch (network) {
      case SUPPORTED_NETWORKS.SEPOLIA:
        rpc = INFURA_SEPOLOA_RPC;
    }
    const provider = new JsonRpcProvider(rpc);
    const signer = new Wallet(PAYMASTER_PK).connect(provider);

    const ep = new ethers.Contract(EP_ADDRESS, EP_ABI, signer);
    const fa = new ethers.Contract(FA_ADDRESS, FA_ABI, signer);

    const initCode =
      FA_ADDRESS +
      fa.interface.encodeFunctionData('createAccount', [owner]).slice(2);

    return await ep.getSenderAddress(initCode).catch((err) => {
      return '0x' + err.data.slice(-40);
    });
  }
}
