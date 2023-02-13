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

export const transactionTypeWithPattern: TransactionTypeWithRegex[] = [
  {
    type: TransactionType.MPesaSentTo,
    keyPhrase: 'sent to',
    regex: /(?<reference>[A-Z0-9]+)(?: Confirmed\.)? Ksh(?<amount>[\d,]+.\d{2}) (?<transactionType>sent) to (?<recipient>.+) on (?<date>\d{1,2}\/\d{1,2}\/\d{2}) at (?<time>\d{1,2}:\d{2} [AP]M).+M-PESA balance is Ksh(?<balance>[\d,]+.\d{2}).+ [Tt]ransaction cost, Ksh(?<transactionCost>[\d,]+.\d{2})/,
  },
  {
    type: TransactionType.MPesaPaidTo,
    keyPhrase: 'paid to',
    regex: /(?<reference>[A-Z0-9]+)(?: Confirmed\.)? Ksh(?<amount>[\d,]+.\d{2}) (?<transactionType>paid) to (?<recipient>.+) on (?<date>\d{1,2}\/\d{1,2}\/\d{2}) at (?<time>\d{1,2}:\d{2} [AP]M).+M-PESA balance is Ksh(?<balance>[\d,]+.\d{2}).+ [Tt]ransaction cost, Ksh(?<transactionCost>[\d,]+.\d{2})/,
  },
  {
    type: TransactionType.MPesaWithdraw,
    keyPhrase: 'Withdraw',
    regex: /(?<reference>[A-Z0-9]+)(?: Confirmed\.)on (?<date>\d{1,2}\/\d{1,2}\/\d{2}) at (?<time>\d{1,2}:\d{2} [AP]M)(?<transactionType>Withdraw) Ksh(?<amount>[\d,]+.\d{2}) from (?<agent>.+) New M-PESA balance is Ksh(?<balance>[\d,]+.\d{2}).+Transaction cost(?:, )?Ksh(?:\s|\S)(?<transactionCost>[\d,]+.\d{2})/,
  },
  {
    type: TransactionType.MShwariDeposit,
    keyPhrase: 'transferred to M-Shwari',
    regex: /(?<reference>[A-Z0-9]+)(?: Confirmed\.)Ksh(?<amount>[\d,]+.\d{2}) (?<transactionType>transferred) to (?<account>.+) on (?<date>\d{1,2}\/\d{1,2}\/\d{2}) at (?<time>\d{1,2}:\d{2} [AP]M).+M-PESA balance is Ksh(?<balance>[\d,]+.\d{2}).+ M-Shwari saving account balance is Ksh(?<mShwariBalance>[\d,]+.\d{2}).+Transaction cost Ksh(?:\s|\S)(?<transactionCost>[\d,]+.\d{2})/,
  },
  {
    type: TransactionType.MShwariWithdraw,
    keyPhrase: 'transferred from M-Shwari',
    regex: /(?<reference>[A-Z0-9]+)(?: Confirmed\.)Ksh(?<amount>[\d,]+.\d{2}) (?<transactionType>transferred) from (?<account>.+) on (?<date>\d{1,2}\/\d{1,2}\/\d{2}) at (?<time>\d{1,2}:\d{2} [AP]M). M-Shwari balance is Ksh(?<mShwariBalance>[\d,]+.\d{2}).+M-PESA balance is Ksh(?<balance>[\d,]+.\d{2}).+Transaction cost Ksh(?:\s|\S)(?<transactionCost>[\d,]+.\d{2})/,
  },
  {
    type: TransactionType.MPesaDeposit,
    keyPhrase: 'You have received',
    regex: /(?<reference>[A-Z0-9]+)(?: Confirmed\.)(?:.+) (?<transactionType>received)? Ksh(?<amount>[\d,]+.\d{2}) from (?<sender>.+) on (?<date>\d{1,2}\/\d{1,2}\/\d{2}) at (?<time>\d{1,2}:\d{2} [AP]M).+M-PESA balance is Ksh(?<balance>[\d,]+.\d{2}).+/,
  },
];

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
