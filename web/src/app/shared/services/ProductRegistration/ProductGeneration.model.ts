export class ProductRegistration {
  public SLPID: string;
  public TAC: string;
  public IMEI: string;
  public serialNo: string;
  public ProductRegNo: string;
  public regType: string;
  public created_date: string;
  public modified_date: string;

  constructor(
    SLPID: string,
    TAC: string,
    IMEI: string,
    serialNo: string,
    ProductRegNo: string,
    regType: string,
    created_date: string,
    modified_date: string
  ) {
    this.SLPID = SLPID;
    this.TAC = TAC;
    this.IMEI = IMEI;
    this.serialNo = serialNo;
    this.ProductRegNo = ProductRegNo;
    this.regType = regType;
    this.created_date = created_date;
    this.modified_date = modified_date;
  }
}
