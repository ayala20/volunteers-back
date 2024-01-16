export enum StatusFreeActivity {
  WAITING = 'WAITING',
  REQUEST = 'REQUEST',
  TAKEN = 'TAKEN',
  DONE = 'DONE',
}

export class CreateFreeActivityDto {
  constructor(
    public freeActivity_id: string,
    public name: string,
    public manager: string,
    public category: string,
    public district: string,
    public volunteer: string,
    public description: string,
    public dateAndTime: Date,
    public address: string,
    public status: StatusFreeActivity,
  ) {}
}
