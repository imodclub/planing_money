const apiURL =
  process.env.NODE_ENV === 'production'
    ? 'https://planing-money.vercel.app/api'
    : 'http://localhost:5002/api';

export default apiURL;
