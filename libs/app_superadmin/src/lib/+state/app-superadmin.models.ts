/**
 * Interface for the 'AppSuperadmin' data
 */
export interface AppSuperadminEntity {
  id: string | number; // Primary ID
  name: string;
}

export interface ClientDetails {
  client_superadmin_count: number;
  client_admin_count: number;
  client_siteadmin_count: number;
  client_user_count: number;
  office_locations: OfficeLocation[];
  office_location_count: number;
  expense_head_count: number;
  projects_count: number;
}

export interface OfficeLocation {
  id: number;
  name: string;
  user_count: number;
}
