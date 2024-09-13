import { ExpenseManagerStatusType } from "../enum/expense-status.enum";

export interface ExpenseManager {
  id?: number;
  companyId?: number;
  name?: string;
  amount?: number;
  status?: ExpenseManagerStatusType;
  statusDescription?: string;
  creationDate?: Date;
  isExpenseEmployee?: boolean;
}
