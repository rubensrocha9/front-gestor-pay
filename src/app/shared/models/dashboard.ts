import { Feedback } from "./employee";

export interface Dashboard {
  employeeWithHighestAmountName: string;
  employeeWithHighestAmount: number;
  employeeWithHighestAmountPosition: string;
  lastEmployeeHiredName: string;
  lastEmployeeHiredPosition: string;
  lastEmployeeHiredDate: Date;
  quantityEmployeesActive: number;
  totalAmountEmployees: number;
  employeeAmount: number;
  amount: number;
  accumulatedAmount: number;
  accumulatedExpenses: AccumulatedExpensesDashboard[];
  totalSpendingAmount: SpendingDashboard[]
  monthlyExpense: ExpensesDashboard[];
}

export interface ExpensesDashboard
{
  employeeAmount: number;
}

export interface SpendingDashboard
{
  amount: number;
}

export interface AccumulatedExpensesDashboard
{
 accumulatedAmount: number;
}

export interface FeedbackWithAttachmentDTO {
  employeeId: number;
  companyId: number;
  feedback: Feedback[];
  imgUrl: string;
  name: string;
}
