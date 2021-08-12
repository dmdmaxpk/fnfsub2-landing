import React from 'react';
import  config  from '../../config/config';
import {Event} from '../Tracking';
import { withRouter } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import PaywallInstance from '../../config/PaywallInstance';
import AxiosInstance from '../../config/AxiosInstance';

class Popup extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      data: [],
      packageId: this.props.packageId,
      doubleConsent: false,
      btnDisable: true,
      loading: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.cancel = this.cancel.bind(this);
    // this.testSubscribe = this.testSubscribe.bind(this);
  }
  componentDidMount(){
    // Pageview call
    AxiosInstance.get(`${config.base_url}/pageview?source=${this.props.src ? this.props.src : 'HE'}&msisdn=${this.props.msisdn}&mid=${this.props.mid}&tid=${this.props.tid}`)
    .then(res => {console.log("pageview response", res)})
    .catch(console.error());

    // Check User Status
    setTimeout(() => {
      if(this.props.msisdn){
        AxiosInstance.get(`${config.base_url}/user/graylist/${this.props.msisdn}?source=${this.props.src ? this.props.src : 'HE'}&package_id=${this.state.packageId}`)
          .then(res => {
            let data = res.data;

            Event("Count", "Load", "Landing");
            if(data){
              this.setState({data});
              if(data.subscription_status === "billed" || data.subscription_status === "trial" || data.subscription_status === "graced"){
                Event("Count", "Load", "Already Subscribed");
                window.location.href = `${config.mainWebsiteUrl}/live-tv?msisdn=${this.props.msisdn}&package_id=${this.state.packageId}&refresh=true`;
              }
              else if(data.subscription_status === "expired" || data.subscription_status === "not_billed" || data.is_gray_listed === true || data.code === 6){
                this.setState({btnDisable: false});
              }
            }
          })
          .catch(err => {
            console.log(err);
          })
        }
    }, 3000);
  }
  subscribe(){
    this.setState({loading: true});
    const userData = {
      msisdn: this.props.msisdn,
      package_id: this.state.packageId,
      source: (this.props.src !== null && this.props.src !== "null" && this.props.src !== undefined && this.props.src !== "") ? this.props.src : "HE",
      marketing_source: this.props.mid,
      affiliate_unique_transaction_id: this.props.tid,
      affiliate_mid: this.props.mid,
      payment_source: 'telenor'

    }
    // console.log('user', userData);
    PaywallInstance.post(`${config.base_url}/payment/subscribe`, userData)
    .then(res =>{
      if(res.data.code === -1){
        this.setState({loading: false});
        alert(res.data.message);
      }
      else{
        if(this.props.mid === "gdn"){
          this.props.history.push({
          pathname: "/confirmSubscription",
          state: {
            msisdn: this.props.msisdn
          }
        })
      }
      else if(res.data.code === 11 && res.data.message === "Trial period activated!"){
        console.log("Trial Event");
        Event("Click", "Trial Activated With Msisdn", this.props.msisdn);
      }
      else if(res.data.code === 10 && res.data.message === "In queue for billing!"){
        Event("Count", "Click", "Queued for billing");
      }
      setTimeout(() => {
        window.location.href = `${config.mainWebsiteUrl}/live-tv?msisdn=${this.props.msisdn}&package_id=${res.data.package_id}&`
      }, 2000);
    }
    })
    .catch(err =>{
      this.setState({loading: false});
      console.log(err);
      alert("Something went wrong! :(");
    })
  }
  cancel(){
    Event("Count", "Click", "Cancel");
    this.setState({doubleConsent: false});
  }
  handleSubmit(){
      Event("Count", "Click", "Subscribe Button Click");
      Event("Click", "Test Case S-1", this.props.msisdn);
      if(this.state.data.subscription_status === "expired" || this.state.data.subscription_status === "not_billed" || this.state.data.is_gray_listed === true){
        this.setState({doubleConsent: true});
        Event("Count", "Click", "Double Consent");
      }
      else if(this.state.data.code === 6){
        Event("Click", "Test Case T-2", "testing");
        Event("Click", "Test Case T-1", this.props.msisdn);
        this.subscribe();
      }
  }

  render() {
    return (
        <div>
          {this.state.doubleConsent === false ?
            this.state.btnDisable === false ?
              this.state.loading === false ?
              <button className={`affiliateSubBtn ${this.props.className}`} onClick={this.handleSubmit}>
                Subscribe Now 
                <img className="telenorBtnLogo" src={require("../../assets/t-logo.png")} />
              </button>
              :
                <Loader
                  type="Rings"
                  color="#00BFFF"
                  height={100}
                  width={100}
                />
              :
              ''
          :
            <div className = "DCBox">
              <p className="confirmText">Confirm?</p>
              <button className="btnDoubleConsent btnYes" onClick={this.subscribe}>Yes</button>
              <button className="btnDoubleConsent btnNo" onClick={this.cancel}>No</button>
            </div>
          }
        </div>
    );
  }
}

export default withRouter(Popup);