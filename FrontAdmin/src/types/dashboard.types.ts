// src/types/dashboard.types.ts

export interface DataResults {
  total_user: number;
  total_forms: number;
  total_outages: number;
  total_tariffs: number;
  active_forms: number;
  completed_forms: number;
  total_admins: number;
  active_admins: number;
}

export interface TopUser {
  id_user: number;
  firstname: string;
  lastname: string;
  email: string;
  total_forms: number;
}

export interface FormTypeStat {
  form_type: string;
  count: number;
}

export interface DistrictStat {
  id_district: number;
  name: string;
  forms_count: number;
  users_count: number;
}

export interface OutageStat {
  status: string;
  count: number;
}

export interface RecentForm {
  id_form: number;
  form_type: string;
  address: string;
  created_at: string;
  status: string;
  user_firstname: string;
  user_lastname: string;
}

export interface AdminStat {
  id_admin: number;
  fio: string;
  login: string;
  roles: string;
  processed_forms: number;
  active_forms: number;
  last_activity: string;
}

export interface AdminPerformance {
  id_admin: number;
  fio: string;
  login: string;
  total_processed: number;
  completed: number;
  pending: number;
  last_month_activity: number;
}

export interface StatisticsData {
  dataResults: DataResults;
  topUsers: TopUser[];
  formsByType: FormTypeStat[];
  formsByDistrict: DistrictStat[];
  outagesByStatus: OutageStat[];
  recentForms: RecentForm[];
  adminStats: AdminStat[];
  adminsPerformance: AdminPerformance[];
}
