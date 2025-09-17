/**
 * Interface for the 'Auth' data
 */
export interface AuthEntity {
  id: string | number; // Primary ID
  name: string;
}

export interface userLoginPayload{
  username_or_email: string;
  password: string;
  rememberMe: boolean;
}


export interface userLoginResponse {
  user: UserInfo;
  tokens: Tokens
  permissions: string[],
}

export interface Tokens{
  refresh: string;
  access: string;
}

export interface UserInfo {
  userId: string;
  accessToken: string;
  appName:string;
  userName: string;
  userRole: string;
  empId?: string;
  role: string;
  roleLower: string;
  permissions: string[];
  priority_site: {id: number, name: string} | null;
}


export interface LogoutPayload {
  data: {userAuditId: number};
}
export interface LogoutResponse{
  userInfo: UserInfo;
  data: {browserToken: string};
  dataDecryptFlag: string;
  responseStatus: Response
}