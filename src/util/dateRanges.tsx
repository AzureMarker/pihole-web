import moment, { Moment } from "moment";
import i18next from "i18next";

const now = moment();
const oneDayAgo = moment().subtract(1, "day");
const startOfDay = moment().startOf("day");
const startOfYesterday = moment()
  .subtract(1, "days")
  .startOf("day");
const endOfYesterday = moment()
  .subtract(1, "days")
  .endOf("day");
const lastWeek = moment().subtract(7, "days");
const lastMonth = moment().subtract(30, "days");
const startOfMonth = moment().startOf("month");
const startOfLastMonth = moment()
  .subtract(1, "month")
  .startOf("month");
const endOfLastMonth = moment()
  .subtract(1, "month")
  .endOf("month");
const startOfYear = moment().startOf("year");
const epoch = moment(0);

/**
 * Preconfigured date ranges for use in a date range picker. The keys are
 * translated, so this object must be computed using the translation function.
 *
 * @param t The translation function
 */
export const dateRanges: (
  t: i18next.TFunction
) => { [name: string]: [Moment, Moment] } = t => ({
  [t("Last 24 Hours")]: [oneDayAgo, now],
  [t("Today")]: [startOfDay, now],
  [t("Yesterday")]: [startOfYesterday, endOfYesterday],
  [t("Last 7 Days")]: [lastWeek, now],
  [t("Last 30 Days")]: [lastMonth, now],
  [t("This Month")]: [startOfMonth, now],
  [t("Last Month")]: [startOfLastMonth, endOfLastMonth],
  [t("This Year")]: [startOfYear, now],
  [t("All Time")]: [epoch, now]
});
