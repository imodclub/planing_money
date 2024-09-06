const apiURL =
  process.env.NODE_ENV === 'production'
    ? 'https://planningmoney.visitors-it.com/api'
    : 'http://localhost:5002/api';

export default apiURL;
