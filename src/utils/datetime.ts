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

export const FormatDate = (date: Date | string): string => {
  if (typeof date === "string") date = new Date(date);

  const dd = AmOrPm(date);
  const minutes = date.getMinutes();
  const h = formatHours(date);
  const m = minutes < 10 ? "0" + minutes : minutes + "";

  return h + ":" + m + " " + dd;
};
