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

export interface TopTableInnerProps<T> {
  loading: boolean;
  title: string;
  data: T;
  headers: string[];
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
   * Generate the card containing the table
   *
   * @returns {*} a React element for the card
   */
  generateCard = () => {
    // If there is no data, just show a message
    if (this.props.isEmpty(this.props.data)) {
      return <div className="card-body">{this.props.emptyMessage}</div>;
    }

    return (
      <div className="card-body p-0">
        <div style={{ overflowX: "auto" }}>
          <table className="table m-0">
            <tbody>
              <tr>
                {this.props.headers.map((header, i) => (
                  <th className="border-top-0" key={i}>
                    {header}
                  </th>
                ))}
              </tr>
              {this.props.generateRows(this.props.data)}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="card">
        <div className="card-header">{this.props.title}</div>
        {this.generateCard()}
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
  extends Omit<TopTableInnerProps<T>, "loading" | "data"> {
  apiCall: () => Promise<D>;
  initialData: T;
  apiHandler: (data: D) => T;
}

export default function <T, D>({
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
          loading
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
          loading
          {...props}
        />
      )}
    />
  );
}
