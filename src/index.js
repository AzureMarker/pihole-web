import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history';
import 'ionicons/dist/css/ionicons.min.css';
import Full from './containers/Full'

const history = createBrowserHistory();

console.log(process.env.PUBLIC_URL);

ReactDOM.render(
  (
    <HashRouter basename={process.env.PUBLIC_URL} history={history}>
      <Switch>
        <Route path="/" name="Home" component={Full}/>
      </Switch>
    </HashRouter>
  ),
  document.getElementById('root')
);
