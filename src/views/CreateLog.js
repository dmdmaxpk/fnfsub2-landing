import React, { Component } from 'react';
import AxiosInstance from '../config/AxiosInstance';

class CreateLog extends Component {
    componentDidMount(){
        this.checkStatus('QDfG');
    }
    checkStatus = (packageId) => {
        console.log("status call for package:", packageId);
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let msisdn = urlParams.get("msisdn");

        let statusData = {
            source: 'HE',
            msisdn: msisdn,
            package_id: packageId
        }
        AxiosInstance.post('/payment/status', statusData)
        .then(res => {
            let result = res.data;
            console.log("result", result)
            if(result.subscribed_package_id){
                window.location.href = `https://goonj.pk/`
            }
            else{
                console.log("first call fail")
                this.checkStatus('QDfC');
                window.location.href = `https://goonj.pk/`
            }
        })
        .catch(err => {
            console.err(err);
            window.location.href = "https://goonj.pk/"
        })
    }
    render() {
        return(
            <div>
            </div>
        );
    }
}
export default CreateLog;