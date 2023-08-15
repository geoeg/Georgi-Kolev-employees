import { useEffect, useState } from "react";

import * as XLSX from "xlsx";

import "./App.css";
import { IEmployee } from "./utils/IEmployee.model";
import Dropdown from "./components/Dropdown";
import { FileFormatOptionValues } from "./utils/FileFormatOptions.enum";
import DataTable from "./components/DataTable";
import {
  calculateDaysWorked,
  convertCsvFileDataToArray,
  convertXlsxFileDataToArray,
  mapNullableEmployeesData,
} from "./utils/utilFunctions.ts";
import Button from "./components/Button";
import FileInput from "./components/FileInput";
import { FileFormatDropdownOptions } from "./utils/FileFormatDropdownOptions";
import { labels } from "./utils/labels";
import { IEmployeePair } from "./utils/IEmployeePair.model";

const fileReader: FileReader = new FileReader();

function App() {
  const [file, setFile] = useState<File>();
  const [data, setData] = useState<IEmployee[]>([]);
  const [employeePairs, setEmployeePairs] = useState<IEmployeePair[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<FileFormatOptionValues>(
    FileFormatOptionValues.CSV
  );

  useEffect(() => {
    if (data.length === 0) return;

    const employeePairData: IEmployeePair[] = calculateDaysWorked(
      mapNullableEmployeesData(data)
    );
    setEmployeePairs(employeePairData);
  }, [data]);

  const handleFileFormatChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setSelectedFormat(e.target.value as FileFormatOptionValues);
  };

  const handleOnFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  const handleCsvFileSubmit = (file: File): void => {
    fileReader.onload = function (event: any) {
      const text: string = event.target.result;

      setData(convertCsvFileDataToArray(text));
    };

    fileReader.readAsText(file);
  };

  const handleXlsxFileSubmit = (file: File): void => {
    fileReader.onload = function (event: any) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      setData(convertXlsxFileDataToArray(sheet));
    };

    fileReader.readAsBinaryString(file);
  };

  const handleFileUploadSubmit = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.preventDefault();
    if (!file) return;

    if (selectedFormat === FileFormatOptionValues.CSV) {
      handleCsvFileSubmit(file);
    }

    if (selectedFormat === FileFormatOptionValues.XLSX) {
      handleXlsxFileSubmit(file);
    }
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
          <div className="uploader-container">
            <FileInput
              fileFormat={selectedFormat}
              onFileChange={handleOnFileChange}
            />
            <Button
              label={labels.IMPORT_BTN_LABEL}
              onClick={handleFileUploadSubmit}
            />
          </div>
        </form>
      </section>

      <section className="table-container">
        <DataTable data={employeePairs} />
      </section>
    </>
  );
}

export default App;
