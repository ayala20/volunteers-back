export class CreateAssociationDto {
  constructor(
    public id: string,
    public name: string,
    public address: string,
    public email: string,
    public phone: string,
    public password: string,
    public file: string,
    public logo_image: string,
    public is_approved: boolean,
  ) {}
}
