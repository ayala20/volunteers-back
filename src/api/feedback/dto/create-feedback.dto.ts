export class CreateFeedbackDto {
  constructor(
    public date: number,
    public rating: number,
    public note: string,
    public idFreeActivity: string,
  ) {}
}
