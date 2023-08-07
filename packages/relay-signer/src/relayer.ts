import { IRelayer, RelayerGetResponse, RelayerParams } from './models/relayer';
import { JsonRpcResponse, SignMessagePayload, SignTypedDataPayload, SignedMessagePayload } from './models/rpc';
import { ListTransactionsRequest, RelayerTransaction, RelayerTransactionPayload } from './models/transactions';
import { isApiCredentials, isActionCredentials, validatePayload } from './ethers/utils';
import { RelaySignerClient } from './api';
import { DefenderRelayProvider, DefenderRelaySigner, DefenderRelaySignerOptions } from './ethers';
import { Provider } from '@ethersproject/abstract-provider';

export class Relayer implements IRelayer {
  private relayer: IRelayer;
  private credentials: RelayerParams;

  public constructor(credentials: RelayerParams) {
    this.credentials = credentials;
    if (isActionCredentials(credentials)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { ActionRelayer } = require('./action');
      this.relayer = new ActionRelayer(credentials);
    } else if (isApiCredentials(credentials)) {
      this.relayer = new RelaySignerClient(credentials);
    } else {
      throw new Error(
        `Missing credentials for creating a Relayer instance. If you are running this code in an Action, make sure you pass the "credentials" parameter from the handler to the Relayer constructor. If you are running this on your own process, then pass an object with the "apiKey" and "apiSecret" generated by the relayer.`,
      );
    }
  }

  public getRelayer(): Promise<RelayerGetResponse> {
    return this.relayer.getRelayer();
  }

  public getProvider(): DefenderRelayProvider {
    return new DefenderRelayProvider(this.credentials);
  }

  public getSigner(provider: Provider, options: DefenderRelaySignerOptions = {}): DefenderRelaySigner {
    return new DefenderRelaySigner(this.credentials, provider, options);
  }

  public sign(payload: SignMessagePayload): Promise<SignedMessagePayload> {
    return this.relayer.sign(payload);
  }

  public signTypedData(payload: SignTypedDataPayload): Promise<SignedMessagePayload> {
    return this.relayer.signTypedData(payload);
  }

  public sendTransaction(payload: RelayerTransactionPayload): Promise<RelayerTransaction> {
    validatePayload(payload);
    return this.relayer.sendTransaction(payload);
  }

  public replaceTransactionById({
    id,
    payload,
  }: {
    id: string;
    payload: RelayerTransactionPayload;
  }): Promise<RelayerTransaction> {
    validatePayload(payload);
    return this.relayer.replaceTransactionById({ id, payload });
  }

  public replaceTransactionByNonce({
    nonce,
    payload,
  }: {
    nonce: number;
    payload: RelayerTransactionPayload;
  }): Promise<RelayerTransaction> {
    validatePayload(payload);
    return this.relayer.replaceTransactionByNonce({ nonce, payload });
  }

  public getTransaction({ id }: { id: string }): Promise<RelayerTransaction> {
    return this.relayer.getTransaction({ id });
  }

  public listTransactions(criteria?: ListTransactionsRequest): Promise<RelayerTransaction[]> {
    return this.relayer.listTransactions(criteria);
  }

  public call({ method, params }: { method: string; params: string[] }): Promise<JsonRpcResponse> {
    return this.relayer.call({ method, params });
  }
}
