export class emailTemplate {
  public Id: string;
  public template_name: string;
  public template_content: string;
  public created_date: string;
  public modified_date: string;

  constructor(
    Id: string,
    template_name: string,
    template_content: string,
    created_date: string,
    modified_date: string,

  ) {
    this.Id = Id;
    this.template_name = template_name;
    this.template_content = template_content;
    this.created_date = created_date;
    this.modified_date = modified_date;
  }
}
