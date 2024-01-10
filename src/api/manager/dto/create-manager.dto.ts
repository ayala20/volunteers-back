export class CreateManagerDto {
  constructor(
    public name: number,
    public password: string,
    public phone: string,
    public email: string,
    public association: string,
    public passwordAssociation: string,
  ) {}
}
