export const CAREER_FILE_TYPES = {
  pdf: {
    extension: ".pdf",
    mimeTypes: ["application/pdf"],
    label: "PDF",
  },
  doc: {
    extension: ".doc",
    mimeTypes: ["application/msword"],
    label: "DOC",
  },
  docx: {
    extension: ".docx",
    mimeTypes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    label: "DOCX",
  },
} as const;

export type CareerFileType = keyof typeof CAREER_FILE_TYPES;

export type CareerFormConfig = {
  enabled: boolean;
  maxFiles: number;
  maxFileSizeMB: number;
  maxTotalSizeMB: number;
  allowedFileTypes: CareerFileType[];
};

export const DEFAULT_CAREER_FORM_CONFIG: CareerFormConfig = {
  enabled: true,
  maxFiles: 3,
  maxFileSizeMB: 10,
  maxTotalSizeMB: 20,
  allowedFileTypes: ["pdf", "doc", "docx"],
};

export const megabytesToBytes = (value: number) => value * 1024 * 1024;

export function careerAcceptValue(types: CareerFileType[]) {
  return types.map((type) => CAREER_FILE_TYPES[type].extension).join(",");
}
