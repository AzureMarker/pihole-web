import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

class QueriesGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: {},
      domains: {}
    };
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              Queries over time
            </div>
            <div className="card-block">
              <Line width={970} height={250} options={{maintainAspectRatio: false}}/>
            </div>
            {
              Object.keys(this.state.ads).length === 0 && Object.keys(this.state.domains).length === 0
              ?
                <div className="card-img-overlay" style={{background: "rgba(255,255,255,0.7)"}}>
                  <i className="fa fa-refresh fa-spin" style={{position: "absolute", top: "50%", left: "50%", fontSize: "30px"}}/>
                </div>
              :
                null
            }
          </div>
        </div>
      </div>
    );
  }
}

export default QueriesGraph;