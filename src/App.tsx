import { useEffect, useState } from 'react';

import * as XLSX from 'xlsx';

import './App.css'
import { IEmployee } from './utils/IEmployee.model';
import Dropdown from './components/Dropdown';
import { FileFormatOptionValues } from './utils/FileFormatOptions.enum';
import DataTable from './components/DataTable';
import { createEmployeeProjectArray, csvFileToArray, getTableHeaders, mapNullableEmployeesData } from './utils/utilFunctions.ts';
import Button from './components/Button';
import FileInput from './components/FileInput';
import { FileFormatDropdownOptions } from './utils/FileFormatDropdownOptions';
import { labels } from './utils/labels';
import { IEmployeePair } from './utils/IEmployeePair.model';

const fileReader: FileReader = new FileReader();

function App() {    
  const [file, setFile] = useState<File>();
  const [data, setData] = useState<IEmployee[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<FileFormatOptionValues>(FileFormatOptionValues.CSV);

  useEffect(() => {
    const mappedData: IEmployee[] = mapNullableEmployeesData(data);
    const result: IEmployeePair[] = createEmployeeProjectArray(mappedData);

    console.log('result: ', result);
    // TODO: append the correct table data

    const tableHeaders: string[] = getTableHeaders(mappedData);

    appendHeaderRow(tableHeaders);
    appendTableBody(mappedData, tableHeaders);
  }, [data]);

  const handleFileFormatChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedFormat(e.target.value as FileFormatOptionValues);
  }

  const handleOnFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  const handleCsvFileSubmit = (file: File): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fileReader.onload = function (event: any) {
      const text: string = event.target.result;
      setData(csvFileToArray(text));
    };

    fileReader.readAsText(file);
  }

  const handleXlsxFileSubmit = (file: File): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fileReader.onload = function (event: any) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const employeesData = parsedData.filter(row => row.some(cell => cell !== ""));

      if (employeesData.length === 0) return;

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

      setData(dataObjects);
    };

    fileReader.readAsBinaryString(file);
  }

  const handleFileUploadSubmit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (!file) return;

    if (selectedFormat === FileFormatOptionValues.CSV) {
      handleCsvFileSubmit(file);
    }

    if (selectedFormat === FileFormatOptionValues.XLSX) {
      handleXlsxFileSubmit(file);
    }
  };

  // append table data functions
  const appendHeaderRow = (headers: string[]): void => {
    const headerRow: HTMLElement | null = document.getElementById("headerRow");
    if (!headerRow) return;

    headers.forEach(header => {
      const th: HTMLTableCellElement = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    });
  };

  const appendTableBody = (tableData: IEmployee[], headers: string[]): void => {
    const tableBody: HTMLElement | null = document.getElementById("tableBody");
    if (!tableBody) return;

    tableData.forEach((rowData: IEmployee) => {
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
  
  return (
    <>
      <section>
        <form>
          <Dropdown 
            label={labels.FILE_PICKER_LABEL}
            value={selectedFormat}
            options={FileFormatDropdownOptions}
            onOptionChange={handleFileFormatChange}
          />
          <FileInput 
            fileFormat={selectedFormat}
            onFileChange={handleOnFileChange}
          />
          <Button 
            label={labels.IMPORT_BTN_LABEL}
            onClick={handleFileUploadSubmit} 
          />
        </form>
      </section>

      <section>
        <DataTable value={data} />
      </section>
    </>
  )
}

export default App;
