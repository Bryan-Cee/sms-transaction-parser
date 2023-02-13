import {
  TransactionTypeWithRegex,
  ParsedMessage,
  ParsedMessageFailure,
  FailedParsing,
  transactionTypeWithPattern,
} from './types';

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
