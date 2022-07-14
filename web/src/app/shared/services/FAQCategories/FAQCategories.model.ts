export class FAQCategories {
  public categoryId: string;
  public active: boolean;
  public category: string;
  public createdBy: string;
  public created_date: string;
  public modified_date: string;

  constructor(
    categoryId: string,
    category: string,
    active: boolean,
    createdBy: string,
    created_date: string,
    modified_date: string,


  ) {
    this.categoryId = categoryId;
    this.active = active;
    this.category = category;
    this.createdBy = createdBy;
    this.created_date = created_date;
    this.modified_date = modified_date;
  }
}
