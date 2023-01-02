export const enum TransactionType {
  MPesaSentTo = 'M-PESA-SENT',
  MPesaPaidTo = 'M-PESA-PAID',
  MShwariDeposit = 'M-SHWARI-DEPOSIT',
  MShwariWithdraw = 'M-SHWARI-WITHDRAW',
  MPesaWithdraw = 'M-PESA-WITHDRAW',
  MPesaDeposit = 'M-PESA-DEPOSIT',
  NoMatch = 'NO-MATCH',
  NoTransactionType = 'NO-TRANSACTION-TYPE',
  NoResult = 'NO-RESULT',
}

export type TransactionTypeWithRegex = {
  type: TransactionType;
  keyPhrase: string;
  regex: RegExp;
};

export type MShwariTransferredToMPesa = {
  reference: string;
  amount: string;
  transactionType: 'transferred';
  account: string;
  date: string;
  time: string;
  mShwariBalance: string;
  balance: string;
  transactionCost: string;
};

export type MPeseSentTo = {
  reference: string;
  amount: string;
  transactionType: 'sent';
  recipient: string;
  date: string;
  time: string;
  balance: string;
  transactionCost: string;
};

export type MPesaPaidTo = {
  reference: string;
  amount: string;
  transactionType: 'paid';
  recipient: string;
  date: string;
  time: string;
  balance: string;
  transactionCost: string;
};

export type MPesaWithdraw = {
  reference: string;
  date: string;
  time: string;
  transactionType: 'Withdraw';
  amount: string;
  agent: string;
  balance: string;
  transactionCost: string;
};

export type ParsedMessage =
  | MShwariTransferredToMPesa
  | MPeseSentTo
  | MPesaWithdraw
  | MPesaPaidTo;
export type FailedParsing =
  | { type: TransactionType.NoMatch }
  | { type: TransactionType.NoResult }
  | { type: TransactionType.NoTransactionType };
