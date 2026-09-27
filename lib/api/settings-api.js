import { getApi } from './index';
const api = getApi('settings');
const headers = companyId => companyId ? { 'X-Company-Id': companyId } : {};
export const getSystemSettings = ({ signal, companyId } = {}) => api({ url: '/', method: 'GET', signal, headers: headers(companyId) });
export const saveSystemSettings = ({ companyId, ...data }) => api({ url: '/', method: 'PUT', data, headers: headers(companyId) });
export const getAttendancePolicy = ({ signal } = {}) => api({ url: '/attendance-policy', method: 'GET', signal });
