import * as XLSX from "xlsx";

import { IEmployee } from "./IEmployee.model";
import { IEmployeePair } from "./IEmployeePair.model";
import { TableHeaders } from "./TableHeaders.enum";

const formatDate = (date: Date): string => {
  const year: number = date.getFullYear();
  const month: string = (date.getMonth() + 1).toString().padStart(2, "0");
  const day: string = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const mapNullableEmployeesData = (
  employees: IEmployee[]
): IEmployee[] => {
  return employees.map((entry: IEmployee) => {
    const mappedNullableValue: string =
      entry.DateTo === "NULL" ? formatDate(new Date()) : entry.DateTo;

    return {
      ...entry,
      DateTo: mappedNullableValue,
    };
  });
};

export const convertCsvFileDataToArray = (string: string): IEmployee[] => {
  const csvHeader: string[] = string.slice(0, string.indexOf("\n")).split(",");
  const csvRows: string[] = string.slice(string.indexOf("\n") + 1).split("\n");

  return csvRows.map((item: string) => {
    const values: string[] = item.split(",");
    const obj = csvHeader.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (object: any, header: string, index: number) => {
        object[header] = values[index];
        return object;
      },
      {}
    );

    return obj;
  });
};

export const convertXlsxFileDataToArray = (
  sheet: XLSX.WorkSheet
): IEmployee[] => {
  const parsedData: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const employeesData = parsedData.filter((row) =>
    row.some((cell) => cell !== "")
  );
  const headers: string[] = employeesData[0];
  const dataObjects = [];

  for (let i = 1; i < employeesData.length; i++) {
    const dataRow = employeesData[i];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataObject: any = {};

    for (let j = 0; j < headers.length; j++) {
      const key = headers[j];
      const value = dataRow[j];
      dataObject[key] = value;
    }

    dataObjects.push(dataObject);
  }

  return dataObjects;
};

export const createEmployeeProjectArray = (
  data: IEmployee[]
): IEmployeePair[] => {
  const result: IEmployeePair[] = [];

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

  // Create a set to track unique pairs
  const uniquePairs = new Set();

  // Convert the mapping into an array of objects
  for (const empID_A in employeeProjects) {
    for (const empID_B in employeeProjects) {
      if (
        empID_A !== empID_B &&
        !uniquePairs.has(`${empID_A}-${empID_B}`) &&
        !uniquePairs.has(`${empID_B}-${empID_A}`)
      ) {
        const projects_A = employeeProjects[empID_A];
        const projects_B = employeeProjects[empID_B];
        for (const projectID in projects_A) {
          if (projects_B[projectID]) {
            result.push({
              employeeIdA: Number(empID_A),
              employeeIdB: Number(empID_B),
              projectId: Number(projectID),
              daysWorked: projects_A[projectID] + projects_B[projectID],
            });
            // Add the pair to the set
            uniquePairs.add(`${empID_A}-${empID_B}`);
          }
        }
      }
    }
  }

  return result;
};

// append table data functions
export const appendHeaderRow = (headers: TableHeaders[]): void => {
  const headerRow: HTMLElement | null = document.getElementById("headerRow");
  if (!headerRow) return;

  headers.forEach((header) => {
    const th: HTMLTableCellElement = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
};

export const appendTableBody = (
  employeePairData: IEmployeePair[],
  headers: string[]
): void => {
  const tableBody: HTMLElement | null = document.getElementById("tableBody");
  if (!tableBody) return;

  employeePairData.forEach((rowData: IEmployeePair) => {
    const row: HTMLTableRowElement = document.createElement("tr");
    headers.forEach((header: string) => {
      const cell = document.createElement("td");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell.textContent = (rowData as any)[header] || "";
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
};
