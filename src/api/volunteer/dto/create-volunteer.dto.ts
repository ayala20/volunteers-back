export class CreateVolunteerDto {
  constructor(
    public full_name: string,
    public address: string,
    public phone: string,
    public dateOfBirth: Date,
    public id_number: string,
    public password: string,
    public email: string,
  ) {}
}
