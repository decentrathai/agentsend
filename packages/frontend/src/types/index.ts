export interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: number;
  txHash?: string;
  ipfsHash?: string;
  encrypted: boolean;
}

export interface TongoAccount {
  address: string;
  balance: {
    current: bigint;
    pending: bigint;
  };
}

export interface EncryptedMessage {
  content: string;
  sender: string;
  recipient: string;
  timestamp: number;
  nonce: string;
}

export interface IPFSUploadResult {
  cid: string;
  size: number;
}

export interface WalletConnection {
  address: string;
  chainId: string;
  connected: boolean;
}
