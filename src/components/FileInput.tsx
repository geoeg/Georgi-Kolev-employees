interface FileInputProps {
  fileFormat: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
 
const FileInput: React.FC<FileInputProps> = ({
  fileFormat,
  onFileChange
}: FileInputProps) => {
  return (
    <input
      type="file"
      id="fileInput"
      accept={`.${fileFormat}`}
      onChange={onFileChange}
    />
  );
}
 
export default FileInput;