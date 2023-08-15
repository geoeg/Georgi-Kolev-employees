import { useEffect } from "react";
import { IEmployeePair } from "../utils/IEmployeePair.model";
import { dataTableHeaders } from "../utils/TableHeaders.enum";
import { appendHeaderRow, appendTableBody, clearTableData } from "../utils/utilFunctions";

interface DataTableProps {
  data: IEmployeePair[];
}

const DataTable: React.FC<DataTableProps> = ({
  data,
}: DataTableProps) => {
  useEffect(() => {
    if (data.length === 0) return;

    clearTableData();
    appendHeaderRow(dataTableHeaders.map((header) => header.label));
    appendTableBody(
      data,
      dataTableHeaders.map((header) => header.field)
    );
  }, [data]);

  return (
    <table id="myTable">
      <thead>
        <tr id="headerRow"></tr>
      </thead>
      <tbody id="tableBody"></tbody>
    </table>
  );
};

export default DataTable;
