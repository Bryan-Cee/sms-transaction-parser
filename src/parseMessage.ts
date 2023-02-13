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

  const { date, time, balance: _b, amount: _a, ...rest } = _result;
  const finalDate = parseDateTimeString(date as dateType, time as timeType);

  let balance = parseAmount(_b);
  let amount = parseAmount(_a);

  const parsedResult = {
    ...rest, balance, amount, dateTime: finalDate.valueOf(), type: transactionType.type
  } as unknown as ParsedMessage;
  return parsedResult;
}
