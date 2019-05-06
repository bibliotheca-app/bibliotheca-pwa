import { DocumentSnapshot } from '@google-cloud/firestore';
import axios from 'axios';
import { Change, EventContext } from 'firebase-functions';
import { SlackClient } from './slack-client';

function getEnvVar(target: string) {
  const value = process.env[target];
  if (!value) throw new Error(`you must set environment variavle: ${target}`);
  return value;
}

type BorrowOrReturn = 'borrow' | 'return';

function getUserData({
  before,
  after,
}: {
  before: Book;
  after: Book;
}): { borrowOrReturn: BorrowOrReturn; email: string; bookTitle: string } {
  if (before.borrowedBy) {
    const borrowOrReturn = 'return';
    const email = before.borrowedBy;
    const bookTitle = before.title;
    return { borrowOrReturn, email, bookTitle };
  }
  if (after.borrowedBy) {
    const borrowOrReturn = 'borrow';
    const email = after.borrowedBy;
    const bookTitle = after.title;
    return { borrowOrReturn, email, bookTitle };
  }
  throw new Error('Illegal Document Update');
}

async function buildMessage(slackClient: SlackClient, before: Book, after: Book) {
  const { email, bookTitle, borrowOrReturn } = getUserData({ before, after });
  const userName = await getUserId(slackClient, email);

  const borrowOrReturnText = ((bOrR: BorrowOrReturn) => {
    switch (bOrR) {
      case 'borrow':
        return '貸出';
      case 'return':
        return '返却';
    }
  })(borrowOrReturn);
  const text = `${userName} さんが『${bookTitle}』を${borrowOrReturnText}しました`;
  return text;
}

async function getUserId(slackClient: SlackClient, email: string): Promise<string> {
  const u = await slackClient.lookupByEmail(email);
  if (u.ok) {
    return `<@${u.user.id}>`;
  } else {
    return email;
  }
}

type Book = { borrowedBy: string | undefined; createdAt: Date; title: string };

export async function onBookBorrowOrReturn(
  change: Change<DocumentSnapshot>,
  context: EventContext,
): Promise<void> {
  const bookId: string = context.params.bookId;

  console.log(`bookId: ${bookId}`);
  console.log(`change: ${JSON.stringify(change)}`);
  console.log(`context: ${JSON.stringify(context)}`);

  const before = change.before.data() as Book;
  const after = change.after.data() as Book;
  const slackClient = new SlackClient(getEnvVar('SLACK_TOKEN'));
  const text = await buildMessage(slackClient, before, after);
  await axios.post(
    getEnvVar('NOTIFY_SLACK_WEBHOOK_URL'),
    { text },
    { headers: { 'Content-type': 'application/json' } },
  );
}
