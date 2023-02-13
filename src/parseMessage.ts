import {
  TransactionTypeWithRegex,
  ParsedMessage,
  ParsedMessageFailure,
  FailedParsing,
  transactionTypeWithPattern,
} from './types';
import { dateType, parseDateTimeString, timeType } from './utils';

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

  const { date, time, ...rest } = _result;
  const finalDate = parseDateTimeString(date as dateType, time as timeType)
  const parsedResult = { ...rest, dateTime: finalDate.valueOf(), type: transactionType.type } as unknown as ParsedMessage;

  return parsedResult;
}
