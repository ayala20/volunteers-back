export class CreateFeedbackDto {
  constructor(
    public date: number,
    public rating: string,
  ) {}
}
