export const TransactionType = {
  MPesaSentTo: 'M-PESA-SENT',
  MPesaPaidTo: 'M-PESA-PAID',
  MShwariDeposit: 'M-SHWARI-DEPOSIT',
  MShwariWithdraw: 'M-SHWARI-WITHDRAW',
  MPesaWithdraw: 'M-PESA-WITHDRAW',
  MPesaDeposit: 'M-PESA-DEPOSIT',
} as const;

export const FailedParsing = {
  NoMatch: 'NO-MATCH',
  NoTransactionType: 'NO-TRANSACTION-TYPE',
  NoResult: 'NO-RESULT',
} as const

export type TransactionTypeWithRegex = {
  type: typeof TransactionType[keyof typeof TransactionType];
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
  type: typeof TransactionType;
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
  type: typeof TransactionType.MPesaSentTo;
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
  type: typeof TransactionType.MPesaPaidTo;
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
  type: typeof TransactionType.MPesaWithdraw;
};

export type MPesaDeposit = {
  reference: string;
  date: string;
  time: string;
  transactionType: 'received';
  amount: string;
  balance: string;
  sender: string;
  type: typeof TransactionType.MPesaDeposit;
};

export type ParsedMessage =
  | MShwariTransferredToMPesa
  | MPeseSentTo
  | MPesaWithdraw
  | MPesaPaidTo
  | MPesaDeposit;

export type ParsedMessageFailure =
  | { type: typeof FailedParsing.NoMatch }
  | { type: typeof FailedParsing.NoResult }
  | { type: typeof FailedParsing.NoTransactionType };
