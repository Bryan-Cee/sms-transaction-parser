import {
  TransactionTypeWithRegex,
  TransactionType,
  ParsedMessage,
  ParsedMessageFailure,
  FailedParsing,
} from './types';

export const transactionTypeWithPattern: TransactionTypeWithRegex[] = [
  {
    type: TransactionType.MPesaSentTo,
    keyPhrase: 'sent to',
    regex: /(?<reference>[A-Z0-9]+)(?: Confirmed\.)? Ksh(?<amount>[\d,]+.\d{2}) (?<transactionType>sent) to (?<recipient>.+) on (?<date>\d{2}\/\d{2}\/\d{2}) at (?<time>\d{1,2}:\d{2} [AP]M).+M-PESA balance is Ksh(?<balance>[\d,]+.\d{2}).+ [Tt]ransaction cost, Ksh(?<transactionCost>[\d,]+.\d{2})/,
  },
  {
    type: TransactionType.MPesaPaidTo,
    keyPhrase: 'paid to',
    regex: /(?<reference>[A-Z0-9]+)(?: Confirmed\.)? Ksh(?<amount>[\d,]+.\d{2}) (?<transactionType>paid) to (?<recipient>.+) on (?<date>\d{2}\/\d{2}\/\d{2}) at (?<time>\d{1,2}:\d{2} [AP]M).+M-PESA balance is Ksh(?<balance>[\d,]+.\d{2}).+ [Tt]ransaction cost, Ksh(?<transactionCost>[\d,]+.\d{2})/,
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

export function parseMessage(message: string): ParsedMessage | ParsedMessageFailure {
  const transactionType = getTransactionType(message);
  if (!transactionType) return { type: FailedParsing.NoTransactionType };

  const matched = transactionType.regex.exec(message);
  if (!matched) return { type: FailedParsing.NoMatch };

  const result = matched.groups as ParsedMessage;
  if (Object.keys(result).length === 0) {
    return { type: FailedParsing.NoResult };
  }

  const parsedResult = { ...result, type: transactionType.type } as ParsedMessage;
  return parsedResult;
}
