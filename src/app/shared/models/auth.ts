export interface Auth {
  companyId: number;
  employeeId: number;
  name: string;
  email: string;
  password: string;
  role: string;
  token: string;
  refreshToken: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface Register {
  companyName: string;
  email: string;
  documentNumber: string;
  password: string;
}

export interface RegisterEmployee {
  email: string;
  documentNumber: string;
  password: string;
}

export interface ConfirmEmail {
  companyId: number;
  employeeId: number;
  emailToken: string;
}

export interface SendResetPassword {
  email?: string;
  emailToken?: string;
  newPassword?: string;
}
