import { intervalToDuration } from "date-fns";

export const getCountdown = (start: number, end: number) => {
  const { days, hours, minutes, seconds } = intervalToDuration({ start, end });

  return `${(days || 0) * 24 + (hours || 0)}:${
    !minutes || minutes < 10 ? "0" : ""
  }${minutes}:${!seconds || seconds < 10 ? "0" : ""}${seconds}`;
};
