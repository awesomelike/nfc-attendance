import axios from 'axios';

require('dotenv').config();

export const execute = (promise) => new Promise((resolve, reject) => {
  promise.then((res) => resolve(res.data)).catch(reject);
});

export default axios.create({
  baseURL: process.env.BASE_URL,
});