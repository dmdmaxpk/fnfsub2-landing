import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import './App.css';
import Landing from "./views/landing";

import {PageView, initGA} from './components/Tracking';
import LandingDaily from './views/LandingDaily';
import LandingTPGdn from './views/LandingTPGdn';
import LandingTPGdnDaily from './views/LandingTPGdnDaily';
import CreateLog from './views/CreateLog';

class App extends React.Component{

componentDidMount(){
  initGA('UA-69091505-14');
  PageView();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let UrlAccessToken = urlParams.get("access_token");
  let UrlRefreshToken = urlParams.get("refresh_token");
  if(UrlAccessToken){
    localStorage.setItem('accessToken', UrlAccessToken);
  }
  if(UrlRefreshToken){
    localStorage.setItem('refreshToken', UrlRefreshToken);
  }
}
render(){
  return (
    <BrowserRouter>
      <div id="app-div" className="full_page_height">
        <Route exact path="/" component={Landing} ></Route>
        <Route exact path="/gdnThree" component={LandingDaily} ></Route>
        <Route exact path="/tp-gdn" component={LandingTPGdn} ></Route>
        <Route exact path="/tp-gdn-daily" component={LandingTPGdnDaily} ></Route>
        <Route exact path="/redirect" component={CreateLog} />
      </div>
    </BrowserRouter>
  );
}  
}

export default App;
