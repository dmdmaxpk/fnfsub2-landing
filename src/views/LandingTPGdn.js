import React from 'react';
import Popup from "../components/popup/popup";
import AxiosInstance from '../config/AxiosInstance';
import { config } from '../config/config';

export default class LandingTPGdn extends React.Component {

  constructor(props){
    super(props);
    console.log(props);
    this.state = {
        showPopup: true,
        // packageId: '',
        pkgDesc: ''
    };
  }
  componentDidMount(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const src = urlParams.get('src') === 'null' ? 'HE' : urlParams.get('src');
    const pkgID = urlParams.get('pkg');
    // Get Package ID
    AxiosInstance.get(`/package?source=${src ? src : 'HE'}`)
    .then(res =>{
      let packageData = pkgID ? res.data[0] : res.data[1];
      console.log("packageID", packageData._id);
      this.setState({
        packageId: packageData._id,
        pkgDesc: packageData.package_desc
      })
    })
    setTimeout(() => {
      this.setState({enableControls: true})
    }, 3000)
  }

  routerLogic(){
      console.log("Press the router Logic button");
  }
  render() {
    var queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var msisdn = urlParams.get('msisdn');
    var src = urlParams.get('src') === 'null' ? 'HE' : urlParams.get('src');
    var mid = urlParams.get('mid');
    var pkg = urlParams.get('pkg');
    var unique_transaction_id = urlParams.get('tid');
    return (
      src !== 'tp-fb2021' ?
        <div className="full_page_height">
            <div className="eventLandingBg">
              <div className="eventTextDiv">
                <h1 className = "aText1 zeroMB aText1sm">SAFAR ME HO YA HO TV SE DOOR, KABHI BHI</h1>
                <h1 className = "aText1 aText1a aText1sm zeroMB">KAHEN BHI DEKHO EXCITING CRICKET MATCHES</h1>
                <h1 className = "aText1 aText1a aText1sm zeroMB"><font color="#9ee132">GOONJ</font> MOBILE TV PER!</h1>
              </div>

              <div className="eventBtnDiv">
                <p className="pkgDesc">{this.state.pkgDesc}</p>
                {this.state.packageId ? 
                  <Popup packageId={pkg ? this.state.packageId : 'QDfG'} msisdn={msisdn} src={src} mid={mid} tid={unique_transaction_id} />
                :
                  ''
                }
              </div>
              {this.state.enableControls === true ?
                <div className="eventConsentTextDiv lightFont">
                  <p className="eventConsentText1 zeroMB">
                    I agree to recurring charges deduction from my mobile balance until Unsubscription
                  </p>
                  <p className="cbText2">
                    <font className="cancelText">CANCEL ANYTIME FROM </font>Profile{">"}Subscriptions
                  </p>
                  <div className="flagsDiv">
                    <img className="flagsImg" src={require('../assets/flags.png')} />
                  </div>
                </div>
              :''}
            </div>
        </div>
        :
        <div className="full_page_height">
          <div className="affiliateLandingBg">
            <h1 className = "aText1 zeroMB aText1sm">NA TV KI ZAROORAT AUR NA HE CABLE KI!</h1>
            <h1 className = "aText1 aText1a aText1sm">ABH <font color="#9ee132">Goonj</font> se Mobile bna tv!</h1>
            <br />
            <div className="channelLogosDiv">
              <img className="channelLogosImg" src={require("../assets/channelLogos/01.png")} />
              <img className="channelLogosImg" src={require("../assets/channelLogos/02.png")} />
              <img className="channelLogosImg" src={require("../assets/channelLogos/03.png")} />
              <img className="channelLogosImg" src={require("../assets/channelLogos/04.png")} />
              <img className="channelLogosImg" src={require("../assets/channelLogos/06.png")} />
              <br />
              <img className="channelLogosImg lastChannelImage" src={require("../assets/channelLogos/08.png")} />
              <img className="channelLogosImg lastChannelImage" src={require("../assets/channelLogos/09.png")} />
              <img className="channelLogosImg lastChannelImage" src={require("../assets/channelLogos/10.png")} />
            </div>
            <br />
          {
              this.state.showPopup? <Popup packageId={pkg ? this.state.packageId : 'QDfG'} msisdn={msisdn} src={src} mid={mid} tid={unique_transaction_id} />: null
          }
            <div className="chargesBox lightFont">
              <p className="cbText1">
                <font className="chargePP">{this.state.pkgDesc}</font> Charges will be deducted from mobile balance
              </p>
              <p className="cbText2">
                <font className="cancelText">for package conversion or cancellation, go to </font>Profile{">"}Subscriptions
              </p>
            </div>
          </div>
        </div>
    );
  }
}