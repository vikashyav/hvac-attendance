import { getApi } from './index';
const api = getApi('employee-options');
export const getEmployeeOptions = ({ signal } = {}) => api({ url: '/', method: 'GET', signal });
export const addEmployeeOption = data => api({ url: '/', method: 'POST', data });
