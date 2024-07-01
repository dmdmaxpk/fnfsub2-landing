import * as React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button"
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import {useState, useEffect} from "react";
// import telenor from "./telenor.png";
import axios from "axios"; // Import Axios
import { Snackbar } from "@material-ui/core";
import PaywallInstance from "../../config/PaywallInstance";
import "./consentModal.css";
 
const ConsentButton = (props) => {
  console.log('props', props);
  const { msisdn } = props;
  const [consent, setConsent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cmsTokenDetails, setCmsTokenDetails] = useState({});
  const [snackbarProps, setSnackbarProps] = useState({open: false, message: ''})
  // console.log(msisdn, 'msisdn')

  const submitConsent = async() => {
    setLoading(true);
    try {
      // Submit consent using the generated token
      console.log('msisdn', msisdn);
      const submitResponse = await PaywallInstance.post("/payment/consent", 
      {msisdn, serviceId: props.serviceId, correlationId: props.data.correlationId, tokenSubmission: props.data.tokenSubmission})
      .then(res => {
        const result = res.data;
        if (result.resCode === '00' || result.resCode === '03' || result.resCode === '06') {
          props.onClose();
          setSnackbarProps({open: true, message: 'Successfully subscribed to Goonj!'});
          setTimeout(() => {
            window.location.href = result.url;
          }, 3000)
        } else {
          setSnackbarProps({open: true, message: 'Failed to subscribe! Please try again later.'});
        }
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        setSnackbarProps({open: true, message: 'Failed to subscribe! Please try again later.'})
      })
    } catch (error) {
      setLoading(false);
      setSnackbarProps({open: true, message: 'Failed to subscribe! Please try again later.'})
    }
  };

    return(
        <div>
            {props.open && props.data ? 
              <Modal
                open={props.open}
                // onClose={props.onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="consentModalContainer"
                style={{backgroundImage: props.data.coverImage}}
              >
                <Box className="consent-box">
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                      <div className="marginBottom5vh" style={{textAlign:"center"}}>
                        <img src={`data:image/jpeg;base64,${props.data.telenorLogo}`} alt="Image" />
                      </div>
                      <div className="marginBottom5vh" style={{textAlign:"center"}}>
                        <img src={`data:image/jpeg;base64,${props.data.logo}`} alt="Image" />
                      </div>
                      <p>
                        <h1>{props.data.subscriptionText}</h1>
                        <p>{props.data.renewalText}</p>
                      </p>
                  </Typography>
                  <Typography id="modal-modal-description" sx={{mt:2}}>
                    <Button disabled={loading} className="confirm-button"  onClick={submitConsent}>Confirm</Button>
                    <Typography variant="button" color="secondary" component="span" onClick={props.onClose} style={{ cursor: 'pointer',color:"white" }}>
                      <span style={{textDecoration: 'underline'}}>Cancel</span>
                    </Typography>
                    <h3>{props.data.unSubText}</h3>
                  </Typography>
                </Box>
              </Modal>
            :
              null
            }

            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={snackbarProps.open}
              onClose={()=> setSnackbarProps({open: false})}
              message={snackbarProps.message}
              key={'top center'}
              autoHideDuration={3000}
              className="snackbarContainer"
            />
        </div>
    )
}
export default ConsentButton;