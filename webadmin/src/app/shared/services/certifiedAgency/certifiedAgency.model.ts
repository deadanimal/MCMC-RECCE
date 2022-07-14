export class certifiedAgency {
  public Id: string;
  public email: string;
  public ca_name: string;
  public createdBy: string;
  public created_date: string;
  public modified_date: string;
  public appoint_date: string;
  public expiry_date: string;
  public pic_name: string;
  public ip_address: string;
  public url: string;
  public is_active: string;
  public path: string;
  public port: string;
  public remarks: string;
  public ca_id: string;

  constructor(
    Id: string,
    ca_name: string,
    createdBy: string,
    created_date: string,
    modified_date: string,
    appoint_date: string,
    expiry_date: string,
    pic_name: string,
    ip_address: string,
    url: string,
    is_active: string,
    path: string,
    port: string,
    remarks: string,
    ca_id: string,

  ) {
    this.Id = Id;
    this.ca_name = ca_name;
    this.created_date = created_date;
    this.modified_date = modified_date;
    this.createdBy = createdBy;
    this.appoint_date = appoint_date;
    this.expiry_date = expiry_date;
    this.pic_name = pic_name;
    this.ip_address = ip_address;
    this.url = url;
    this.is_active = is_active;
    this.path = path;
    this.port = port;
    this.remarks = remarks;
    this.ca_id = ca_id;

    
  }
}
