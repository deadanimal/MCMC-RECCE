export class FAQTitle {
  public categoryId: string;
  public active: string;
  public title: boolean;
  public createdBy: string;
  public created_date: string;
  public modified_date: string;

  constructor(
    categoryId: string,
    active: string,
    title: boolean,
    createdBy: string,
    created_date: string,
    modified_date: string,

  ) {
    this.categoryId = categoryId;
    this.active = active;
    this.title = title;
    this.createdBy = createdBy;
    this.created_date = created_date;
    this.modified_date = modified_date;
  }
}
