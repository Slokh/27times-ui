import { intervalToDuration } from "date-fns";

export const getCountdown = (start: Date, end: Date) => {
  const { days, hours, minutes, seconds } = intervalToDuration({ start, end });

  return `${(days || 0) * 24 + (hours || 0)}:${
    !minutes || minutes < 10 ? "0" : ""
  }${minutes}:${!seconds || seconds < 10 ? "0" : ""}${seconds}`;
};
