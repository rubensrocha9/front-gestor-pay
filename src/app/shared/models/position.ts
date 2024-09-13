export interface Position {
  id: number,
  companyId?: number,
  creationDate: Date,
  positionName: string;
}

export interface PositionDTO {
  positionName: string;
}
