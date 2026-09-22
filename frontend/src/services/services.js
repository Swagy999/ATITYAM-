import api from './api';

export const authService = {
  login: (email, password) => api.post('/auth/login.php', { email, password }),
  register: (userData) => api.post('/auth/register.php', userData),
  getMe: () => api.get('/auth/me.php'),
  logout: () => api.post('/auth/logout.php')
};

export const propertyService = {
  list: (params) => api.get('/properties/list.php', { params }),
  create: (data) => api.post('/properties/create.php', data),
  getDetails: (id) => api.get('/properties/details.php', { params: { id } }),
  update: (data) => api.post('/properties/update.php', data),
  verify: (data) => api.post('/properties/verify.php', data)
};

export const guestService = {
  list: (params) => api.get('/guests/list.php', { params }),
  create: (data) => api.post('/guests/create.php', data),
  getDetails: (id) => api.get('/guests/details.php', { params: { id } }),
  update: (data) => api.post('/guests/update.php', data)
};

export const stayService = {
  checkin: (data) => api.post('/stays/checkin.php', data),
  checkout: (stayId) => api.post('/stays/checkout.php', { stay_id: stayId }),
  list: (params) => api.get('/stays/list.php', { params })
};

export const reportService = {
  getReport: (params) => api.get('/reports/monthly.php', { params }),
  getExportUrl: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const token = localStorage.getItem('atithya_token') || '';
    return `${api.defaults.baseURL}/reports/export-csv.php?token=${token}&${query}`;
  }
};

export const analyticsService = {
  getOverview: () => api.get('/analytics/overview.php'),
  getMonthlyTrends: () => api.get('/analytics/monthly.php'),
  getStateWise: () => api.get('/analytics/state-wise.php'),
  getCountryWise: () => api.get('/analytics/country-wise.php'),
  getDestinations: () => api.get('/analytics/destination.php')
};

export const policeService = {
  search: (params) => api.get('/police/search.php', { params }),
  propertySearch: (params) => api.get('/police/property-search.php', { params })
};

export const alertService = {
  list: (params) => api.get('/alerts/list.php', { params }),
  updateStatus: (data) => api.post('/alerts/update-status.php', data)
};

export const adminService = {
  getAuditLogs: (params) => api.get('/admin/audit-logs.php', { params }),
  getMasterData: () => api.get('/admin/master-data.php'),
  getSettings: () => api.get('/admin/system-settings.php'),
  updateSettings: (data) => api.post('/admin/system-settings.php', data),
  listUsers: (params) => api.get('/users/list.php', { params }),
  createUser: (data) => api.post('/users/create.php', data),
  updateUser: (data) => api.post('/users/update.php', data)
};
