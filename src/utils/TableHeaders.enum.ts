export enum TableHeaders {
  EmployeeA = 'Employee ID #1',
  EmployeeB = 'Employee ID #2',
  ProjectId = 'Project ID',
  DaysWorked = 'Days worked'
}

export const dataTableHeaders: { label: TableHeaders, field: string }[] = [
  { label: TableHeaders.EmployeeA, field: 'employeeIdA' }, 
  { label: TableHeaders.EmployeeB, field: 'employeeIdB' }, 
  { label: TableHeaders.ProjectId, field: 'projectId' }, 
  { label: TableHeaders.DaysWorked, field: 'daysWorked' }, 
];