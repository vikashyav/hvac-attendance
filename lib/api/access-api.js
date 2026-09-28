import { getApi } from './index';
const api = getApi('access');
const headers = companyId => companyId ? { 'X-Company-Id': companyId } : {};
export const getCapabilities = ({ companyId, signal } = {}) => api({ url: '/me', method: 'GET', signal, headers: headers(companyId) });
export const getPermissions = ({ companyId, signal } = {}) => api({ url: '/permissions', method: 'GET', signal, headers: headers(companyId) });
/** @param {{ companyId?: string, page?: number, signal?: AbortSignal }} [options] */
export const getRoles = ({ companyId, page = 1, signal } = {}) => api({ url: '/roles', method: 'GET', params: { page }, signal, headers: headers(companyId) });
/** @param {{ companyId?: string, page?: number, signal?: AbortSignal }} [options] */
export const getMemberships = ({ companyId, page = 1, signal } = {}) => api({ url: '/memberships', method: 'GET', params: { page }, signal, headers: headers(companyId) });
export const createRole = ({ companyId, ...data }) => api({ url: '/roles', method: 'POST', data, headers: headers(companyId) });
export const assignRole = ({ companyId, membershipId, roleId }) => api({ url: `/memberships/${membershipId}/roles`, method: 'POST', data: { roleId }, headers: headers(companyId) });
export const revokeRole = ({ companyId, assignmentId }) => api({ url: `/assignments/${assignmentId}`, method: 'DELETE', headers: headers(companyId) });
