import axios from 'axios';

import { env } from 'env.js'

export const instance = axios.create({
  baseURL: env.REACT_APP_SERVER_URL,
});
