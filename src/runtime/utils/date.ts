// Utility to handle dayjs imports in a way that works with Nuxt 4
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const utcToLocal = (utc: string, format?: string) => {
  return dayjs
    .utc(utc)
    .tz(dayjs.tz.guess())
    .format(format || "YYYY-MM-DD hh:mm:ss A");
};

const localToUtc = (local: string, format?: string) => {
  return dayjs(local)
    .utc()
    .format(format || "YYYY-MM-DD hh:mm:ss A");
};

export { dayjs, utcToLocal, localToUtc };
