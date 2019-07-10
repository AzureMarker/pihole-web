/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Selector For Time Range Context
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Fragment, Suspense } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { Button } from "reactstrap";
import {
  TimeRange,
  TimeRangeContext
} from "../common/context/TimeRangeContext";
import "bootstrap-daterangepicker/daterangepicker.css";
import { WithTranslation, withTranslation } from "react-i18next";
import { dateRanges } from "../../util/dateRanges";

export interface TimeRangeSelectorProps {
  /**
   * The range to show
   */
  range: TimeRange | null;

  /**
   * Called when a new range is selected
   *
   * @param range The new range, or null if "Last 24 Hours" is selected
   */
  onSelect: (range: TimeRange | null) => void;

  /**
   * If the chosen label should be shown outside of the selector
   */
  showLabel: boolean;

  /**
   * The button size to use
   */
  size?: string;
}

/**
 * Get the label to be shown next to the selector button
 *
 * @param props The selector props
 */
const renderLabel = (
  props: TimeRangeSelectorProps & WithTranslation
): string | null => {
  const { t } = props;

  if (!props.showLabel) {
    return null;
  }

  if (!props.range) {
    return t<string>("Last 24 Hours");
  }

  if (props.range.name === "Custom Range") {
    return (
      props.range.from.toDate().toLocaleString() +
      " - " +
      props.range.until.toDate().toLocaleString()
    );
  }

  return props.range.name;
};

/**
 * A time range selector which shows the selected time range (label if
 * predefined, or time range if custom)
 */
export const TimeRangeSelector = (
  props: TimeRangeSelectorProps & WithTranslation
) => {
  const { range, onSelect, t } = props;

  const translatedDateRanges = dateRanges(t);
  const last24Hours = t("Last 24 Hours");
  const today = t("Today");
  const label = renderLabel(props);
  const size = props.size ? props.size : "sm";

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
      <Button color="light" size={size}>
        <i className="far fa-clock fa-lg" />
        {label ? (
          <Fragment>
            &nbsp; &nbsp;
            {label}
          </Fragment>
        ) : null}
      </Button>
    </DateRangePicker>
  );
};

export const TranslatedTimeRangeSelector = withTranslation("time-ranges")(
  TimeRangeSelector
);

export const TimeRangeSelectorContainer = ({ size }: { size?: string }) => (
  <TimeRangeContext.Consumer>
    {context => (
      <Suspense fallback={null}>
        <TranslatedTimeRangeSelector
          range={context.range}
          onSelect={context.update}
          showLabel={true}
          size={size}
        />
      </Suspense>
    )}
  </TimeRangeContext.Consumer>
);
