export interface AttachmentDTO {
  id: number;
  companyId: number;
  employeeId: number;
  creationDate: Date;
  base64: string;
  fileName: string;
  fileExtension: string;
  imgUrl: string;
}
