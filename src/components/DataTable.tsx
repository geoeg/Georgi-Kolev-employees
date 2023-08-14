import { IEmployee } from "../utils/IEmployee.model";

interface DataTableProps {
  value: IEmployee[];
}
 
const DataTable: React.FC<DataTableProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  value
}: DataTableProps) => {
  return (
    <table id="myTable">
      <thead>
        <tr id="headerRow"></tr>
      </thead>
      <tbody id="tableBody"></tbody>
    </table>
  );
}
 
export default DataTable;