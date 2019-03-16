import moment, { Moment } from "moment";
import i18next from "i18next";

/**
 * Preconfigured date ranges for use in a date range picker. The keys are
 * translated, so this object must be computed using the translation function.
 *
 * @param t The translation function
 */
export const dateRanges: (
  t: i18next.TranslationFunction
) => { [name: string]: [Moment, Moment] } = t => ({
  [t("Last 24 Hours")]: [moment().subtract(1, "day"), moment()],
  [t("Today")]: [moment().startOf("day"), moment()],
  [t("Yesterday")]: [
    moment()
      .subtract(1, "days")
      .startOf("day"),
    moment()
      .subtract(1, "days")
      .endOf("day")
  ],
  [t("Last 7 Days")]: [moment().subtract(6, "days"), moment()],
  [t("Last 30 Days")]: [moment().subtract(29, "days"), moment()],
  [t("This Month")]: [moment().startOf("month"), moment()],
  [t("Last Month")]: [
    moment()
      .subtract(1, "month")
      .startOf("month"),
    moment()
      .subtract(1, "month")
      .endOf("month")
  ],
  [t("This Year")]: [moment().startOf("year"), moment()],
  [t("All Time")]: [moment(0), moment()]
});
