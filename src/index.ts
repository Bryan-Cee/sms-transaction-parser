const enum TransactionType {
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

type TransactionTypeWithRegex = {
  type: TransactionType;
  keyPhrase: string;
  regex: RegExp;
};

export type TransferredMShwari = {
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

export type SentTo = {
  reference: string;
  amount: string;
  transactionType: 'sent';
  recipient: string;
  date: string;
  time: string;
  balance: string;
  transactionCost: string;
};

export type PaidTo = {
  reference: string;
  amount: string;
  transactionType: 'paid';
  recipient: string;
  date: string;
  time: string;
  balance: string;
  transactionCost: string;
};

export type Withdraw = {
  reference: string;
  date: string;
  time: string;
  transactionType: 'Withdraw';
  amount: string;
  agent: string;
  balance: string;
  transactionCost: string;
};

export type ParsedMessage = TransferredMShwari | SentTo | Withdraw | PaidTo;
export type FailedParsing =
  | { type: TransactionType.NoMatch }
  | { type: TransactionType.NoResult }
  | { type: TransactionType.NoTransactionType };

export const transactionTypeWithPattern: TransactionTypeWithRegex[] = [
  {
    type: TransactionType.MPesaSentTo,
    keyPhrase: 'sent to',
    regex: /(?<reference>[A-Z0-9]+)(?: Confirmed\.)? Ksh(?<amount>[\d,]+.\d{2}) (?<transactionType>sent|paid) to (?<recipient>.+) on (?<date>\d{2}\/\d{2}\/\d{2}) at (?<time>\d{1,2}:\d{2} [AP]M).+M-PESA balance is Ksh(?<balance>[\d,]+.\d{2}).+ [Tt]ransaction cost, Ksh(?<transactionCost>[\d,]+.\d{2})/,
  },
  {
    type: TransactionType.MPesaPaidTo,
    keyPhrase: 'paid to',
    regex: /(?<reference>[A-Z0-9]+)(?: Confirmed\.)? Ksh(?<amount>[\d,]+.\d{2}) (?<transactionType>sent|paid) to (?<recipient>.+) on (?<date>\d{2}\/\d{2}\/\d{2}) at (?<time>\d{1,2}:\d{2} [AP]M).+M-PESA balance is Ksh(?<balance>[\d,]+.\d{2}).+ [Tt]ransaction cost, Ksh(?<transactionCost>[\d,]+.\d{2})/,
  },
  {
    type: TransactionType.MPesaWithdraw,
    keyPhrase: 'Withdraw',
    regex: /(?<reference>[A-Z0-9]+)(?: Confirmed\.)on (?<date>\d{2}\/\d{2}\/\d{2}) at (?<time>\d{1,2}:\d{2} [AP]M)(?<transactionType>Withdraw) Ksh(?<amount>[\d,]+.\d{2}) from (?<agent>.+) New M-PESA balance is Ksh(?<balance>[\d,]+.\d{2}).+Transaction cost(?:, )?Ksh(?:\s|\S)(?<transactionCost>[\d,]+.\d{2})/,
  },
  {
    type: TransactionType.MShwariDeposit,
    keyPhrase: 'transferred to M-Shwari',
    regex: /(?<reference>[A-Z0-9]+)(?: Confirmed\.)Ksh(?<amount>[\d,]+.\d{2}) (?<transactionType>transferred) to (?<account>.+) on (?<date>\d{2}\/\d{2}\/\d{2}) at (?<time>\d{1,2}:\d{2} [AP]M).+M-PESA balance is Ksh(?<balance>[\d,]+.\d{2}).+ M-Shwari saving account balance is Ksh(?<mShwariBalance>[\d,]+.\d{2}).+Transaction cost Ksh(?:\s|\S)(?<transactionCost>[\d,]+.\d{2})/,
  },
  {
    type: TransactionType.MShwariWithdraw,
    keyPhrase: 'transferred from M-Shwari',
    regex: /(?<reference>[A-Z0-9]+)(?: Confirmed\.)Ksh(?<amount>[\d,]+.\d{2}) (?<transactionType>transferred) from (?<account>.+) on (?<date>\d{2}\/\d{2}\/\d{2}) at (?<time>\d{1,2}:\d{2} [AP]M). M-Shwari balance is Ksh(?<mShwariBalance>[\d,]+.\d{2}).+M-PESA balance is Ksh(?<balance>[\d,]+.\d{2}).+Transaction cost Ksh(?:\s|\S)(?<transactionCost>[\d,]+.\d{2})/,
  },
  {
    type: TransactionType.MPesaDeposit,
    keyPhrase: 'You have received',
    regex: /(?<reference>[A-Z0-9]+)(?: Confirmed\.)(?:.+) (?<transactionType>received)? Ksh(?<amount>[\d,]+.\d{2}) from (?<sender>.+) on (?<date>\d{2}\/\d{2}\/\d{2}) at (?<time>\d{1,2}:\d{2} [AP]M).+M-PESA balance is Ksh(?<balance>[\d,]+.\d{2}).+/,
  },
];

export function getTransactionType(
  message: string
): TransactionTypeWithRegex | null {
  for (let index = 0; index < transactionTypeWithPattern.length; index++) {
    const transactionWithRegex = transactionTypeWithPattern[index];
    const found = message.indexOf(transactionWithRegex.keyPhrase);

    if (found > -1) {
      return transactionWithRegex;
    }
  }
  return null;
}

export function parseMessage(message: string): ParsedMessage | FailedParsing {
  const transactionType = getTransactionType(message);
  if (!transactionType) return { type: TransactionType.NoTransactionType };

  const matched = transactionType.regex.exec(message);
  if (!matched) return { type: TransactionType.NoMatch };

  const result = matched.groups as ParsedMessage;
  if (Object.keys(result).length === 0) {
    return { type: TransactionType.NoResult };
  }

  const parsedResult = { ...result, type: transactionType.type };
  return parsedResult;
}
