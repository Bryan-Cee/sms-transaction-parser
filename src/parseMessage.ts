import {
  TransactionTypeWithRegex,
  ParsedMessage,
  ParsedMessageFailure,
  FailedParsing,
  transactionTypeWithPattern,
} from './types';
import { dateType, parseAmount, parseDateTimeString, timeType } from './utils';

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

  const _result = matched.groups as Record<string, string>;
  if (Object.keys(_result).length === 0) {
    return { type: FailedParsing.NoResult };
  }

  const { date, time, balance: _b, amount: _a, transactionCost: _tC, ...rest } = _result;
  const finalDate = parseDateTimeString(date as dateType, time as timeType);

  const balance = parseAmount(_b);
  const amount = parseAmount(_a);
  const transactionCost = parseAmount(_tC);

  const parsedResult = { ...rest, balance, amount, transactionCost, dateTime: finalDate.valueOf(), type: transactionType.type } as unknown as ParsedMessage;

  return parsedResult;
}
