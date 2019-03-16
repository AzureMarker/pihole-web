/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Selector For Time Range Context
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { Button } from "reactstrap";
import {
  TimeRange,
  TimeRangeContext
} from "../common/context/TimeRangeContext";
import "bootstrap-daterangepicker/daterangepicker.css";
import { WithNamespaces, withNamespaces } from "react-i18next";
import { dateRanges } from "../../util/dateRanges";

export interface TimeRangeSelectorProps {
  /**
   * The range to show
   */
  range: TimeRange | null;

  /**
   * Called when a new range is selected
   *
   * @param range The new range, or null if none is selected
   */
  onSelect: (range: TimeRange | null) => void;
}

/**
 * A time range selector which shows the selected time range (label if
 * predefined, or time range if custom)
 */
export const TimeRangeSelector = ({
  range,
  onSelect,
  t
}: TimeRangeSelectorProps & WithNamespaces) => {
  const translatedDateRanges = dateRanges(t);
  const last24Hours = t("Last 24 Hours");
  const today = t("Today");

  return (
    <DateRangePicker
      startDate={range ? range.from : translatedDateRanges[last24Hours][0]}
      endDate={range ? range.until : translatedDateRanges[last24Hours][1]}
      maxDate={translatedDateRanges[today][1]}
      onApply={(event, picker) => {
        if (
          picker.startDate.isSame(translatedDateRanges[last24Hours][0]) &&
          picker.endDate.isSame(translatedDateRanges[last24Hours][1])
        ) {
          // Set to null so we fetch data from FTL instead of the database
          onSelect(null);
        } else {
          // Set the time range so we fetch from the database
          onSelect({
            from: picker.startDate,
            until: picker.endDate,
            name: picker.chosenLabel
          });
        }
      }}
      timePicker={true}
      showDropdowns={true}
      ranges={translatedDateRanges}
    >
      <Button color="light" size="sm">
        <i className="far fa-clock fa-lg" />
        &nbsp; &nbsp;
        {range
          ? range.name === "Custom Range"
            ? range.from.toDate().toLocaleString() +
              " - " +
              range.until.toDate().toLocaleString()
            : range.name
          : t("Last 24 Hours")}
      </Button>
    </DateRangePicker>
  );
};

export const TranslatedTimeRangeSelector = withNamespaces("time-ranges")(
  TimeRangeSelector
);

export const TimeRangeSelectorContainer = () => (
  <TimeRangeContext.Consumer>
    {context => (
      <TranslatedTimeRangeSelector
        range={context.range}
        onSelect={context.update}
      />
    )}
  </TimeRangeContext.Consumer>
);
