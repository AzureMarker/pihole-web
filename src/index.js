import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history';
import 'ionicons/dist/css/ionicons.min.css';
import Full from './containers/Full'

const history = createBrowserHistory();

ReactDOM.render(
  (
    <BrowserRouter history={history}>
      <Switch>
        <Route path="/" name="Home" component={Full}/>
      </Switch>
    </BrowserRouter>
  ),
  document.getElementById('root')
);
