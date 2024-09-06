const apiURL =
  process.env.NODE_ENV === 'production'
    ? 'https://planing-money-git-main-imodclubs-projects.vercel.app/'
    : 'http://localhost:5002/api';

export default apiURL;
