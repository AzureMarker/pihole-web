/* Pi-hole: A black hole for Internet advertisements
 * (c) 2019 Pi-hole, LLC (https://pi-hole.net)
 * Network-wide ad blocking via your own hardware.
 *
 * Web Interface
 * Generic top items component
 *
 * This file is copyright under the latest version of the EUPL.
 * Please see LICENSE file for your rights under this license. */

import React, { Component, ReactNode } from "react";
import { WithAPIData } from "../common/WithAPIData";
import { Subtract } from "react-i18next";

export interface TopTableInnerProps<T> {
  loading: boolean;
  title: string;
  data: T;
  headers: Array<string>;
  emptyMessage: string;
  isEmpty: (data: T) => boolean;
  generateRows: (data: T) => ReactNode;
}

export class TopTable<T> extends Component<TopTableInnerProps<T>, {}> {
  static defaultProps = {
    loading: true,
    title: "",
    data: {},
    headers: [],
    emptyMessage: "",
    isEmpty: () => true,
    generateRows: () => null
  };

  /**
   * Generate the table
   *
   * @returns {*} a React element for the table, or an empty message
   */
  generateTable = () => {
    // If there is no data, just show a message
    if (this.props.isEmpty(this.props.data)) {
      return this.props.emptyMessage;
    }

    return (
      <table className="table table-bordered">
        <tbody>
          <tr>
            {this.props.headers.map((header, i) => (
              <th key={i}>{header}</th>
            ))}
          </tr>
          {this.props.generateRows(this.props.data)}
        </tbody>
      </table>
    );
  };

  render() {
    return (
      <div className="card">
        <div className="card-header">{this.props.title}</div>
        <div className="card-body">
          <div style={{ overflowX: "auto" }}>{this.generateTable()}</div>
        </div>
        {this.props.loading ? (
          <div
            className="card-img-overlay"
            style={{ background: "rgba(255,255,255,0.7)" }}
          >
            <i
              className="fa fa-refresh fa-spin"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                fontSize: "30px"
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export interface TopTableProps<T, D>
  extends Subtract<TopTableInnerProps<T>, { loading: boolean; data: T }> {
  apiCall: () => Promise<D>;
  initialData: T;
  apiHandler: (data: D) => T;
}

export default function<T, D>({
  title,
  apiCall,
  initialData,
  headers,
  emptyMessage,
  isEmpty,
  apiHandler,
  generateRows,
  ...props
}: TopTableProps<T, D>) {
  return (
    <WithAPIData
      apiCall={apiCall}
      repeatOptions={{
        interval: 10 * 60 * 1000,
        ignoreCancel: true
      }}
      renderInitial={() => (
        <TopTable
          title={title}
          headers={headers}
          emptyMessage={emptyMessage}
          isEmpty={isEmpty}
          generateRows={generateRows}
          data={initialData}
          loading={true}
          {...props}
        />
      )}
      renderOk={data => (
        <TopTable
          title={title}
          headers={headers}
          emptyMessage={emptyMessage}
          isEmpty={isEmpty}
          generateRows={generateRows}
          data={apiHandler(data)}
          loading={false}
          {...props}
        />
      )}
      renderErr={() => (
        <TopTable
          title={title}
          headers={headers}
          emptyMessage={emptyMessage}
          isEmpty={isEmpty}
          generateRows={generateRows}
          data={initialData}
          loading={true}
          {...props}
        />
      )}
    />
  );
}
