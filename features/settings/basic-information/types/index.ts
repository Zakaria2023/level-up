export type BasicInformationInputType =
  | "Text"
  | "Number"
  | "Select"
  | "Checkbox"
  | "File";

export type BasicInformationStatus =
  | "Configured"
  | "Uploaded"
  | "Verified"
  | "Primary"
  | "Default"
  | "Active";

export type BasicInformationRow = {
  id: number;
  field: string;
  value: string;
  inputType: BasicInformationInputType;
  status: BasicInformationStatus;
};
