import { getApi } from './index';
const api = getApi('companies');
export const getCompanies = () => api({ url: '/', method: 'GET' });
export const createCompany = data => api({ url: '/', method: 'POST', data });
export const getCompanyAdmins = () => api({ url: '/admins', method: 'GET' });
export const createCompanyAdmin = data => api({ url: '/admins', method: 'POST', data });
