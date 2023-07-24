import { LocalMessage } from "@/types";

const DAYS_OF_THE_WEEK: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AmOrPm = (date: Date): string => {
  if (date.getHours() >= 12) {
    return "PM";
  }
  return "AM";
};

const formatHours = (date: Date): string => {
  const hh = date.getHours();
  if (hh == 12) return "12";
  if (hh >= 22) return hh - 12 + "";
  if (hh > 12) return "0" + (hh - 12);

  return "0" + hh;
};

export const FormatDate = (date: Date): string => {
  const dd = AmOrPm(date);
  const minutes = date.getMinutes();
  const h = formatHours(date);
  const m = minutes < 10 ? "0" + minutes : minutes + "";

  return h + ":" + m + " " + dd;
};

const areSameDate = (date_0: Date, date_1: Date): boolean => {
  return date_0.getDate() === date_1.getDate();
};

const areSameMonth = (date_0: Date, date_1: Date): boolean => {
  return date_0.getMonth() === date_1.getMonth();
};

const areSameYear = (date_0: Date, date_1: Date): boolean => {
  return date_0.getFullYear() === date_1.getFullYear();
};

const areSameFullDate = (date_0: Date, date_1: Date): boolean => {
  return (
    areSameDate(date_0, date_1) &&
    areSameMonth(date_0, date_1) &&
    areSameYear(date_0, date_1)
  );
};

const subtractDaysFromDate = (date: Date, days: number): Date => {
  const tmpDate = date;
  tmpDate.setDate(date.getDate() - days);

  return tmpDate;
};

const getYesterday = (date: Date): Date => {
  return subtractDaysFromDate(date, 1);
};

const aboutAWeekAgo = () => {
  const now = new Date();
  const aboutAWeekAgo = subtractDaysFromDate(now, 6);

  aboutAWeekAgo.setHours(0);
  aboutAWeekAgo.setMinutes(0);
  aboutAWeekAgo.setSeconds(0);
  aboutAWeekAgo.setSeconds(aboutAWeekAgo.getSeconds() - 1);

  return aboutAWeekAgo;
};

const isYesterday = (date: Date): boolean => {
  const today = new Date();
  const yesterday = getYesterday(today);

  return areSameFullDate(date, yesterday);
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return areSameFullDate(date, today);
};

const twoDigitYear = (date: Date): string => {
  const year = date.getFullYear() + "";
  return year.substring(2);
};

const mmDDYYYY = (date: Date): string => {
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1; // .getMonth() returns a value 0-11 so it must be adjusted
  const dayOfMonthString = dayOfMonth > 9 ? `${dayOfMonth}` : `0${dayOfMonth}`;
  const monthString = month > 9 ? `${month}` : `0${month}`;

  return `${monthString}/${dayOfMonthString}/${twoDigitYear(date)}`;
};

export const latestMessageIndicator = (date: Date): string => {
  if (isToday(date)) {
    return FormatDate(date);
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  if (date > aboutAWeekAgo()) {
    return DAYS_OF_THE_WEEK[date.getDay()];
  }

  return mmDDYYYY(date);
};

// Sorts objects by date field, ordering the object with the most recent date first
const sortByDate = <T extends Record<K, Date>, K extends keyof T>(
  a: T,
  b: T,
  dateField: K
) => {
  // .getTime() will return a greater number for a later date.
  return b[dateField].getTime() - a[dateField].getTime();
};

const sortLocalMessagesByDate = (a: LocalMessage, b: LocalMessage) =>
  sortByDate<LocalMessage, "createdAt">(a, b, "createdAt");

export const sortMessageListByDate = (messageList: LocalMessage[]) => {
  const listCopy = messageList.slice();
  listCopy.sort((a, b) => sortLocalMessagesByDate(a, b));
  return listCopy;
};

const sortTransactionsByDate = (
  a: { groupID: string; createdAt: Date },
  b: { groupID: string; createdAt: Date }
) =>
  sortByDate<{ groupID: string; createdAt: Date }, "createdAt">(
    a,
    b,
    "createdAt"
  );

export const sortTransactionListByDate = (
  transactions: {
    groupID: string;
    createdAt: Date;
  }[]
) => {
  return transactions.sort((a, b) => sortTransactionsByDate(a, b));
};
