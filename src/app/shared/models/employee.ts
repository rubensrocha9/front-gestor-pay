import { EmployeeStatus } from "../enum/employee-status.enum";
import { GenderStatusType } from "../enum/gender-status.enum";
import { RoleType } from "../enum/role.enum";
import { AttachmentDTO } from "./attachment";

export interface Employee {
  id?: number;
  companyId: number;
  positionId: number;
  name: string;
  birthDate: Date;
  amount: number;
  email: string;
  isEmailConfirmed: boolean;
  entryDate: Date;
  departureDate?: Date;
  documentNumber: string;
  phoneNumber: string;
  countryCode: string;
  gender: GenderStatusType;
  role: RoleType;
  status: EmployeeStatus;
  statusDescription: string;
  companyTime?: string;
  positionName: string;
  creationDate?: Date;
  attachment: AttachmentDTO;
  address: EmployeeAddress;
}

export interface EmployeeAndAddress {
  employee: CreateEmployee;
  address: EmployeeAddress;
}

export interface EmployeeAddress {
  id?: number;
  employeeId?: number;
  street: string;
  homeNumber: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface CreateEmployee {
  id?: number;
  companyId?: number;
  positionId: number;
  name: string;
  birthDate: Date;
  amount: string;
  email: string;
  entryDate: Date;
  departureDate?: Date;
  documentNumber: string;
  gender: GenderStatusType;
  phoneNumber: string;
  countryCode: string;
}

export interface EmployeePermission {
  id: number;
  companyId: number;
  positionId: number;
  name: string;
  email: string;
  entryDate: Date;
  departureDate: Date;
  role: RoleType;
  roleDescription: string;
  status: EmployeeStatus;
  statusDescription: string;
  companyTime: string;
  employeePosition: string;
  address: string;
}

export interface EmployeeRole {
  userRole: RoleType;
}

export interface Feedback {
  employeeId: number;
  companyId: number;
  feedback: string;
  creationDate?: Date;
}
