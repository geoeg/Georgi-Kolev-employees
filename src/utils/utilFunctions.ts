import { IEmployee } from "./IEmployee.model";

const formatDate = (date: Date): string => {
  const year: number = date.getFullYear();
  const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
  const day: string = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const mapNullableEmployeesData = (employees: IEmployee[]): IEmployee[] => {
  return employees.map((entry: IEmployee) => {
    const mappedNullableValue: string = entry.DateTo === 'NULL' ? 
      formatDate(new Date()) : entry.DateTo;
    
      return {
        ...entry,
        DateTo: mappedNullableValue
      }
  })
};

export const csvFileToArray = (string: string): IEmployee[] => {
  const csvHeader: string[] = string.slice(0, string.indexOf("\n")).split(",");
  const csvRows: string[] = string.slice(string.indexOf("\n") + 1).split("\n");

  return csvRows.map((item: string) => {
    const values: string[] = item.split(",");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj = csvHeader.reduce((object: any, header: string, index: number) => {
      object[header] = values[index];
      return object;
    }, {});

    return obj;
  });
};

export const getTableHeaders = (data: IEmployee[]): string[] => {
  return Array.from(new Set(data.flatMap(obj => Object.keys(obj))));
};

export const createEmployeeProjectArray = (data: IEmployee[]) => {
  const result = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const employeeProjects: any = {};

  for (const entry of data) {
      const { EmpID, ProjectID, DateFrom, DateTo } = entry;
      const from = new Date(DateFrom).valueOf();
      const until = new Date(DateTo).valueOf();
      const daysWorked = Math.ceil((until - from) / (1000 * 60 * 60 * 24)) + 1;

      if (!employeeProjects[EmpID]) {
          employeeProjects[EmpID] = {};
      }

      if (!employeeProjects[EmpID][ProjectID]) {
          employeeProjects[EmpID][ProjectID] = 0;
      }

      employeeProjects[EmpID][ProjectID] += daysWorked;
  }

  // Convert the mapping into an array of objects
  for (const empID in employeeProjects) {
      const projects = employeeProjects[empID];
      for (const projectID in projects) {
          result.push({
              employeeIdA: Number(empID),
              employeeIdB: Number(empID),
              projectId: Number(projectID),
              daysWorked: projects[projectID]
          });
      }
  }

  return result;
}
