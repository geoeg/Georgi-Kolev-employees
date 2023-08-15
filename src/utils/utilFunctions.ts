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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const calculateDaysWorked = (data: IEmployee[]): IEmployeePair[] => {
  const results: IEmployeePair[] = [];

  for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
      const {
        EmpID: empIdA,
        ProjectID: projectIdA,
        DateFrom: dateFromA,
        DateTo: dateToA,
      } = data[i];
      const {
        EmpID: empIdB,
        ProjectID: projectIdB,
        DateFrom: dateFromB,
        DateTo: dateToB,
      } = data[j];

      const startDate = new Date(
        Math.max(Date.parse(dateFromA), Date.parse(dateFromB))
      ).valueOf();
      const endDate = new Date(
        Math.min(Date.parse(dateToA), Date.parse(dateToB))
      ).valueOf();

      if (startDate <= endDate && projectIdA === projectIdB) {
        const daysWorked =
          Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        results.push({
          employeeIdA: Number(empIdA),
          employeeIdB: Number(empIdB),
          projectId: Number(projectIdA),
          daysWorked: daysWorked,
        });
      }
    }
  }
  
  return results;
};

// table data functions
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

export const clearTableData = (): void => {
  const tableHeader = document.getElementById("headerRow");
  if (tableHeader) {
    tableHeader.innerHTML = "";
  }

  const tableBody = document.getElementById("tableBody");
  if (tableBody) {
    tableBody.innerHTML = "";
  }
};
