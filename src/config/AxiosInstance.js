import axios from 'axios';
import config from './config';

const fetchClient = () => {
  const defaultOptions = {
    baseURL: config.base_url,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Create instance
  let instance = axios.create(defaultOptions);
  return instance;
};

export default fetchClient();