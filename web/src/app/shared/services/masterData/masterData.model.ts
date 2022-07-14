export class masterTable {
  public Id: string;
  public fileNo: string;
  public TAC: string;
  public productCategory: string;
  public modelId: string;
  public modelDescription: string;
  public consigneeName: string;
  public submissionDate: string;
  public approveDate: string;
  public expiryDate: string;
  public category: string;
  public serialNo: string;
  public SLPID: string;
  public created_date: string;
  public modified_date: string;

  constructor(
    Id: string,
    fileNo: string,
    TAC: string,
    productCategory: string,
    modelId: string,
    modelDescription: string,
    consigneeName: string,
    submissionDate: string,
    approveDate: string,
    expiryDate: string,
    category: string,
    serialNo: string,
    SLPID: string,
    created_date: string,
    modified_date: string,

  ) {
    this.Id = Id;
    this.fileNo = fileNo;
    this.TAC = TAC;
    this.productCategory = productCategory;
    this.modelId = modelId;
    this.modelDescription = modelDescription;
    this.consigneeName = consigneeName;
    this.submissionDate = submissionDate;
    this.approveDate = approveDate;
    this.expiryDate = expiryDate;
    this.category = category;
    this.serialNo = serialNo;
    this.SLPID = SLPID;
    this.created_date = created_date;
    this.modified_date = modified_date;
  }
}
