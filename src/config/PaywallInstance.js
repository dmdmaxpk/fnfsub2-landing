import axios from 'axios';
import { RefreshTokenFunction } from './apiCalls';
import config from './config';


const fetchPaywallClient = () => {
  const defaultOptions = {
    baseURL: config.base_url,
    headers: {
      'Content-Type': 'application/json',
    },
  };



  // Create instance
  let instance = axios.create(defaultOptions);
  
  // Set the AUTH token for any request
  instance.interceptors.request.use(async function (config) {
    let token = await RefreshTokenFunction().then(function (response){
      // console.log("response", response);
      return response === undefined ? '' : response.access_token;
    })
    // console.log("checkToken", token)
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
    return config;
  });

  return instance;
};

export default fetchPaywallClient();