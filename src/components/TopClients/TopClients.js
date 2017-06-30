import React, { Component } from 'react';

class TopClients extends Component {
  constructor(props) {
    super(props);

    this.state = {
      total_queries: 0,
      top_clients: {}
    };

    this.updateChart = this.updateChart.bind(this);
  }

  updateChart() {
    fetch("http://pi.hole:4747/stats/top_clients")
      .then(res => res.json())
      .then(res => {
        this.setState({
          total_queries: res.dns_queries_today,
          top_clients: res.top_clients
        });
      });

    setTimeout(this.updateChart, 10 * 1000);
  }

  componentDidMount() {
    this.updateChart();
  }

  render() {
    return (
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            Top Clients
          </div>
          <div className="card-block">
            <div style={{overflowX: "auto"}}>
              <table className="table table-bordered">
                <tbody>
                <tr>
                  <th>Client</th>
                  <th>Requests</th>
                  <th>Frequency</th>
                </tr>
                {
                  Object.keys(this.state.top_clients).map((item, index) => {
                    let hostname = "";
                    let ipAddr = "";
                    let stat = this.state.top_clients[item];
                    let percentage = stat / this.state.total_queries * 100;

                    // Check if we have the IP and hostname
                    // ex. localhost|127.0.0.1
                    if(item.includes("|")) {
                      let parts = item.split("|");
                      hostname = parts[0];
                      ipAddr = parts[1];
                    }

                    return (
                      <tr key={item}>
                        <td>
                          {hostname !== "" ? hostname : ipAddr}
                        </td>
                        <td>
                          {stat}
                        </td>
                        <td>
                          <div className="progress progress-sm" title={percentage.toFixed(1) + "% of " + this.state.total_queries.toLocaleString()}>
                            <div className="progress-bar bg-primary" style={{width: percentage + "%"}}/>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
            </div>
          </div>
          {
            this.state.total_queries === 0
              ?
              <div className="card-img-overlay" style={{background: "rgba(255,255,255,0.7)"}}>
                <i className="fa fa-refresh fa-spin" style={{position: "absolute", top: "50%", left: "50%", fontSize: "30px"}}/>
              </div>
              :
              null
          }
        </div>
      </div>
    );
  }
}

export default TopClients;