import { forkJoin, Subscription } from "rxjs";
import * as FileSaver from 'file-saver';
import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ViewChild,
  TemplateRef,
  ElementRef,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ProductGenerationService } from "src/app/shared/services/ProductRegistration/ProductGeneration.service";
import * as XLSX from "xlsx";
import Dropzone from "dropzone";
import { BsDatepickerDirective } from "ngx-bootstrap";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { SLPService } from "src/app/shared/services/SLP/SLP.service";
import { productCertificationService } from "src/app/shared/services/productCertification/productCertification.service";
import { NgxSpinnerService } from "ngx-spinner";
import { VisitorCounterService } from 'src/app/shared/services/VisitorCounter/VisitorCounter.service';
import { formatDate } from "@angular/common";
import { DateAxisDataItem } from "@amcharts/amcharts4/charts";
import swal from "sweetalert2";
import { AuthService } from "src/app/shared/services/auth/auth.service";
import { UsersService } from "src/app/shared/services/users/users.service";
import { JwtHelperService } from '@auth0/angular-jwt';

// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: "app-data-search",
  templateUrl: "./data-search.component.html",
  styleUrls: ["./data-search.component.scss"],
})
export class DataSearchComponent implements OnInit, OnDestroy {

  @ViewChild('excel_table_SLP', {static: false}) excel_table_SLP:ElementRef;
  @ViewChild(BsDatepickerDirective, { static: false })
  datepicker: BsDatepickerDirective;
  entries: number = 10;
  datafield1: any
  infoTable = [];
  exportTable = []
  IMEITable = [];
  SerialTable = [];
  productCertificationTable = [];
  SLPTable = [];
  VisitorGetTable = [];
  dataSearchForm: FormGroup;
  searchForm: FormGroup;
  addNewDataForm: FormGroup;
  dateSearchForm: FormGroup;
  RegisterSearchForm: FormGroup;
  SLPSearchForm: FormGroup;
  CertificationSearchForm: FormGroup;
  // excel
  dataFromExcelFile = [];
  dataFromExcelFileSLPID = [];
  storeData: any;
  worksheet: any;
  fileUploaded: File;
  jsonData: any;
  data: [][];
  TACData: number
  IMEIData: number
  serialData: number
  rows = []
  getDataDB = []
  userData
  jai
  UserID

  dateFromApproveCert
  dateToApproveCert
  dateFromExpiryCert
  dateToExpiryCert
  dateFromApproveSLP
  dateToApproveSLP
  dateFromExpirySLP
  dateToExpirySLP
  dateTo
  dateFrom
  selectedDate
  temp = []
  temp2 = []
  exportDate: any
  ApproveDateCert: any | null | undefined = null;
  ApproveDateSLP: any | null | undefined = null;
  ExpiryDateSLP: any | null | undefined = null;
  ExpiryDateCert: any | null | undefined = null;
  required1
  required2
  required3


  //Export table
  isSummaryTableHidden: boolean = true
  fileNameRegistration= 'Export_Table_Registration.xlsx'
  fileNameSLPID= 'Export_Table_SLP_ID.xlsx'; 
  fileNameCert = 'Export_Table_Certification.xlsx';

  private categoryAxis: any;

  tableEntries: number = 20; //israa 
  tableEntries2: number = 20;
  tableEntries3: number = 20;
  tableSelected: any[] = [];
  tableSelected2: any[] = [];
  tableSelected3: any[] = [];
  tableTemp = [];
  tableActiveRow: any;
  tableActiveRow2: any;
  tableActiveRow3: any;
  SelectionType = SelectionType;

  subscription: Subscription;

  //pagination product registration
  //update total counter
  productRegistrationTotalCount;  
  productCertificationTotalCount;
  SLPTotalCount;  
  curPageSize = 20;
  curPageSize2= 20;
  curPageSize3= 20;


  searching_mode: boolean = false;
  searching_mode_url;


  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered modal-lg",
  };

  constructor(
    private productGenerationService: ProductGenerationService,
    private productCertificationService: productCertificationService,
    private SLPService: SLPService,
    private formBuilder: FormBuilder,
    private zone: NgZone,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private VisitorCounterService:VisitorCounterService,
    private authService: AuthService,
    private usersService: UsersService,
  ) {
    this.productGeneration();
    this.productCertificationGet();
    this.SLPGet();
    this.widgetDataGet();
    this.getToken()
  }

  ngOnInit() {
    this.addNewDataForm = this.formBuilder.group({
      Id: new FormControl(""),
      fileNo: new FormControl(""),
      TAC: new FormControl(""),
      productCategory: new FormControl(""),
      modelId: new FormControl(""),
      modelDescription: new FormControl(""),
      consigneeName: new FormControl(""),
      submissionDate: new FormControl(""),
      approveDate: new FormControl(""),
      expiryDate: new FormControl(""),
      category: new FormControl(""),
      imeiNo: new FormControl(""),
      SLPID: new FormControl(""),
      serialNo: new FormControl(""),
    });

    this.RegisterSearchForm = this.formBuilder.group({
      TAC: new FormControl(""),
      imei: new FormControl(""),
      SLPID: new FormControl(""),
      SerialNo: new FormControl(""),
      RegType: new FormControl(""),
      ProductRegistrationNo: new FormControl(""),
      ca_owner: new FormControl(""),
      CreatedDate: new FormControl("")
    });

    this.SLPSearchForm = this.formBuilder.group({
      SLP_ID: new FormControl(""),
      SLPID_owner: new FormControl(""),
      principal_certificate: new FormControl(""),
      ApproveDate: new FormControl(""),
      ExpiryDate: new FormControl(""),
      ca_owner: new FormControl(""),
    });

    this.CertificationSearchForm = this.formBuilder.group({
      FileNo: new FormControl(""),
      TAC: new FormControl(""),
      ProductCategory: new FormControl(""),
      Model: new FormControl(""),
      Brand: new FormControl(""),
      ROCROB: new FormControl(""),
      ApproveDate: new FormControl(""),
      ExpiryDate: new FormControl(""),
      ca_owner: new FormControl(""),
      MarketingName: new FormControl(""),
      TypeOfProduct: new FormControl(""),
    });

  }

  ngOnDestroy() {}

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  filterTableRegister() {
    this.searching_mode = true
    // console.log("date", this.selectedDate.length)
    if (this.selectedDate != null) {
      //add day to second data
      //let selectedDateTo = this.selectedDate[1].getDate()
      let temp = new Date(this.selectedDate[1].getTime());
      let temp2 = new Date(this.selectedDate[0].getTime());
      this.dateFrom = formatDate(temp2, "yyyy-MM-d", "en_GB") + "T00:00:00"
      this.dateTo = formatDate(temp, "yyyy-MM-d", "en_GB") + "T23:59:59"

      // this.datafield1 =
      // "TAC=" +
      // this.RegisterSearchForm.value.TAC +
      // "&IMEI=" +
      // this.RegisterSearchForm.value.imei +
      // "&RegType=" +
      // this.RegisterSearchForm.value.RegType +
      // "&SerialNo=" + this.RegisterSearchForm.value.SerialNo +
      // "&SLPID=" + this.RegisterSearchForm.value.SLPID +
      // "&ProductRegistrationNo=" +
      // this.RegisterSearchForm.value.ProductRegistrationNo +
      // "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
      // "&created_date__gte=" + this.dateFrom +
      // "&created_date__lte=" + this.dateTo

      if(this.RegisterSearchForm.value.ProductRegistrationNo == undefined && this.RegisterSearchForm.value.SLPID == undefined && this.RegisterSearchForm.value.TAC == undefined ){
        console.log('loop 1')
        this.datafield1 =
        "&IMEI=" +
        this.RegisterSearchForm.value.imei +
        "&RegType=" +
        this.RegisterSearchForm.value.RegType +
        "&SerialNo=" + this.RegisterSearchForm.value.SerialNo +
        "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
        "&created_date__gte=" + this.dateFrom +
        "&created_date__lte=" + this.dateTo
      }
      else if (this.RegisterSearchForm.value.ProductRegistrationNo == undefined && this.RegisterSearchForm.value.TAC == undefined && this.RegisterSearchForm.value.SLPID != undefined ) {
        console.log('loop 2')
        this.datafield1 =
        "&IMEI=" +
        this.RegisterSearchForm.value.imei +
        "&RegType=" +
        this.RegisterSearchForm.value.RegType +
        "&SerialNo=" + this.RegisterSearchForm.value.SerialNo +
        "&SLPID=" + this.RegisterSearchForm.value.SLPID +
        "&created_date__gte=" + this.dateFrom +
        "&created_date__lte=" + this.dateTo +
        "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner 
      }
      else if (this.RegisterSearchForm.value.ProductRegistrationNo == undefined && this.RegisterSearchForm.value.SLPID == undefined && this.RegisterSearchForm.value.TAC != undefined) {
        console.log('loop 3')
        this.datafield1 =
        "TAC=" + this.RegisterSearchForm.value.TAC +
        "&IMEI=" +
        this.RegisterSearchForm.value.imei +
        "&RegType=" +
        this.RegisterSearchForm.value.RegType +
        "&SerialNo=" + this.RegisterSearchForm.value.SerialNo +
        "&created_date__gte=" + this.dateFrom +
        "&created_date__lte=" + this.dateTo +
        "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner 
      }
      else if (this.RegisterSearchForm.value.ProductRegistrationNo != undefined && this.RegisterSearchForm.value.TAC == undefined && this.RegisterSearchForm.value.SLPID == undefined) {
        console.log('loop 4')
        this.datafield1 =
        "&IMEI=" +
        this.RegisterSearchForm.value.imei +
        "&RegType=" +
        this.RegisterSearchForm.value.RegType +
        "&SerialNo=" + this.RegisterSearchForm.value.SerialNo + 
        "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
        "&ProductRegistrationNo=" +
        this.RegisterSearchForm.value.ProductRegistrationNo +
        "&created_date__gte=" + this.dateFrom +
        "&created_date__lte=" + this.dateTo
      }
      else if (this.RegisterSearchForm.value.ProductRegistrationNo != undefined && this.RegisterSearchForm.value.TAC != undefined && this.RegisterSearchForm.value.SLPID == undefined) {
        console.log('loop 5')
        this.datafield1 =
        "TAC=" + this.RegisterSearchForm.value.TAC +
        "&IMEI=" +
        this.RegisterSearchForm.value.imei +
        "&RegType=" +
        this.RegisterSearchForm.value.RegType +
        "&SerialNo=" + this.RegisterSearchForm.value.SerialNo + 
        "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
        "&ProductRegistrationNo=" +
        this.RegisterSearchForm.value.ProductRegistrationNo +
        "&created_date__gte=" + this.dateFrom +
        "&created_date__lte=" + this.dateTo
      }
      else if (this.RegisterSearchForm.value.ProductRegistrationNo != undefined && this.RegisterSearchForm.value.TAC == undefined && this.RegisterSearchForm.value.SLPID != undefined) {
        console.log('loop 6')
        this.datafield1 =
        "SLPID=" + this.RegisterSearchForm.value.SLPID +
        "&IMEI=" +
        this.RegisterSearchForm.value.imei +
        "&RegType=" +
        this.RegisterSearchForm.value.RegType +
        "&SerialNo=" + this.RegisterSearchForm.value.SerialNo + 
        "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
        "&ProductRegistrationNo=" +
        this.RegisterSearchForm.value.ProductRegistrationNo +
        "&created_date__gte=" + this.dateFrom +
        "&created_date__lte=" + this.dateTo
      }
      else if (this.RegisterSearchForm.value.ProductRegistrationNo == undefined && this.RegisterSearchForm.value.TAC != undefined && this.RegisterSearchForm.value.SLPID != undefined) {
        console.log('loop 7')
        this.datafield1 =
        "SLPID=" + this.RegisterSearchForm.value.SLPID +
        "&IMEI=" +
        this.RegisterSearchForm.value.imei +
        "&RegType=" +
        this.RegisterSearchForm.value.RegType +
        "&SerialNo=" + this.RegisterSearchForm.value.SerialNo + 
        "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
        "&TAC=" + this.RegisterSearchForm.value.TAC +
        "&created_date__gte=" + this.dateFrom +
        "&created_date__lte=" + this.dateTo
      }
      else if (this.RegisterSearchForm.value.ProductRegistrationNo != undefined && this.RegisterSearchForm.value.TAC != undefined && this.RegisterSearchForm.value.SLPID != undefined) {
        console.log('loop 8')
        this.datafield1 =
        "SLPID=" + this.RegisterSearchForm.value.SLPID +
        "&IMEI=" +
        this.RegisterSearchForm.value.imei +
        "&RegType=" +
        this.RegisterSearchForm.value.RegType +
        "&SerialNo=" + this.RegisterSearchForm.value.SerialNo + 
        "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
        "&TAC=" + this.RegisterSearchForm.value.TAC +
        "&ProductRegistrationNo=" +
        this.RegisterSearchForm.value.ProductRegistrationNo +
        "&created_date__gte=" + this.dateFrom +
        "&created_date__lte=" + this.dateTo
      }
    }
    else if (this.selectedDate == null){
      if(this.RegisterSearchForm.value.ProductRegistrationNo == undefined && this.RegisterSearchForm.value.SLPID == undefined && this.RegisterSearchForm.value.TAC == undefined ){
        console.log('loop 1')
        this.datafield1 =
        "&IMEI=" +
        this.RegisterSearchForm.value.imei +
        "&RegType=" +
        this.RegisterSearchForm.value.RegType +
        "&SerialNo=" + this.RegisterSearchForm.value.SerialNo +
        "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner 
      }
      else if (this.RegisterSearchForm.value.ProductRegistrationNo == undefined && this.RegisterSearchForm.value.TAC == undefined && this.RegisterSearchForm.value.SLPID != undefined ) {
        console.log('loop 2')
        this.datafield1 =
        "&IMEI=" +
        this.RegisterSearchForm.value.imei +
        "&RegType=" +
        this.RegisterSearchForm.value.RegType +
        "&SerialNo=" + this.RegisterSearchForm.value.SerialNo +
        "&SLPID=" + this.RegisterSearchForm.value.SLPID +
        "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner 
      }
      else if (this.RegisterSearchForm.value.ProductRegistrationNo == undefined && this.RegisterSearchForm.value.SLPID == undefined && this.RegisterSearchForm.value.TAC != undefined) {
        console.log('loop 3')
        this.datafield1 =
        "TAC=" + this.RegisterSearchForm.value.TAC +
        "&IMEI=" +
        this.RegisterSearchForm.value.imei +
        "&RegType=" +
        this.RegisterSearchForm.value.RegType +
        "&SerialNo=" + this.RegisterSearchForm.value.SerialNo +
        "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner 
      }
      else if (this.RegisterSearchForm.value.ProductRegistrationNo != undefined && this.RegisterSearchForm.value.TAC == undefined && this.RegisterSearchForm.value.SLPID == undefined) {
        console.log('loop 4')
        this.datafield1 =
        "&IMEI=" +
        this.RegisterSearchForm.value.imei +
        "&RegType=" +
        this.RegisterSearchForm.value.RegType +
        "&SerialNo=" + this.RegisterSearchForm.value.SerialNo + 
        "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
        "&ProductRegistrationNo=" +
        this.RegisterSearchForm.value.ProductRegistrationNo
      }
      else if (this.RegisterSearchForm.value.ProductRegistrationNo != undefined && this.RegisterSearchForm.value.TAC != undefined && this.RegisterSearchForm.value.SLPID == undefined) {
        console.log('loop 5')
        this.datafield1 =
        "TAC=" + this.RegisterSearchForm.value.TAC +
        "&IMEI=" +
        this.RegisterSearchForm.value.imei +
        "&RegType=" +
        this.RegisterSearchForm.value.RegType +
        "&SerialNo=" + this.RegisterSearchForm.value.SerialNo + 
        "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
        "&ProductRegistrationNo=" +
        this.RegisterSearchForm.value.ProductRegistrationNo
      }
      else if (this.RegisterSearchForm.value.ProductRegistrationNo != undefined && this.RegisterSearchForm.value.TAC == undefined && this.RegisterSearchForm.value.SLPID != undefined) {
        console.log('loop 6')
        this.datafield1 =
        "SLPID=" + this.RegisterSearchForm.value.SLPID +
        "&IMEI=" +
        this.RegisterSearchForm.value.imei +
        "&RegType=" +
        this.RegisterSearchForm.value.RegType +
        "&SerialNo=" + this.RegisterSearchForm.value.SerialNo + 
        "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
        "&ProductRegistrationNo=" +
        this.RegisterSearchForm.value.ProductRegistrationNo
      }
      else if (this.RegisterSearchForm.value.ProductRegistrationNo == undefined && this.RegisterSearchForm.value.TAC != undefined && this.RegisterSearchForm.value.SLPID != undefined) {
        console.log('loop 7')
        this.datafield1 =
        "SLPID=" + this.RegisterSearchForm.value.SLPID +
        "&IMEI=" +
        this.RegisterSearchForm.value.imei +
        "&RegType=" +
        this.RegisterSearchForm.value.RegType +
        "&SerialNo=" + this.RegisterSearchForm.value.SerialNo + 
        "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
        "&TAC=" + this.RegisterSearchForm.value.TAC 
      }
      else if (this.RegisterSearchForm.value.ProductRegistrationNo != undefined && this.RegisterSearchForm.value.TAC != undefined && this.RegisterSearchForm.value.SLPID != undefined) {
        console.log('loop 8')
        this.datafield1 =
        "SLPID=" + this.RegisterSearchForm.value.SLPID +
        "&IMEI=" +
        this.RegisterSearchForm.value.imei +
        "&RegType=" +
        this.RegisterSearchForm.value.RegType +
        "&SerialNo=" + this.RegisterSearchForm.value.SerialNo + 
        "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
        "&TAC=" + this.RegisterSearchForm.value.TAC +
        "&ProductRegistrationNo=" +
        this.RegisterSearchForm.value.ProductRegistrationNo
      }
    }

    console.log(this.datafield1);
    this.spinner.show()
    this.productGenerationService.filter(this.datafield1).subscribe(
      (res) => {
        this.infoTable = res['results'];
        this.productRegistrationTotalCount = res["count"];
        // console.log(res)
        this.spinner.hide()
        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
      },
      (err) => {},
      () => {
        // this.SearchDateRange()
      }
    );
  }

  filterTableSLP() {
    this.searching_mode = true;
    if (this.ApproveDateSLP == null && this.ExpiryDateSLP != null){
    let temp = new Date(this.ExpiryDateSLP[1].getTime());
    let temp2 = new Date(this.ExpiryDateSLP[0].getTime());
    this.dateFromExpirySLP = formatDate(temp2, "yyyy-MM-dd", "en_GB") + "+00%3A00%3A00%2B00"
    this.dateToExpirySLP = formatDate(temp, "yyyy-MM-dd", "en_GB") + "+00%3A00%3A00%2B00"

    this.datafield1 =
      "SLP_ID=" +
      this.SLPSearchForm.value.SLP_ID +
      "&SLPID_owner__icontains=" +
      this.SLPSearchForm.value.SLPID_owner +
      "&principal_certificate__icontains=" +
      this.SLPSearchForm.value.principal_certificate +
      "&CA_owner__icontains=" + this.SLPSearchForm.value.ca_owner+
      "&ExpiryDate__gte=" + this.dateFromExpirySLP +
      "&ExpiryDate__lte=" + this.dateToExpirySLP
    }
    else if (this.ApproveDateSLP != null && this.ExpiryDateSLP == null){
      let temp = new Date(this.ApproveDateSLP[1].getTime());
      let temp2 = new Date(this.ApproveDateSLP[0].getTime());
      this.dateFromApproveSLP = formatDate(temp2, "yyyy-MM-dd", "en_GB") + "+00%3A00%3A00%2B00"
      this.dateToApproveSLP = formatDate(temp, "yyyy-MM-dd", "en_GB") + "+00%3A00%3A00%2B00"
  
      this.datafield1 =
        "SLP_ID=" +
        this.SLPSearchForm.value.SLP_ID +
        "&SLPID_owner__icontains=" +
        this.SLPSearchForm.value.SLPID_owner +
        "&principal_certificate__icontains=" +
        this.SLPSearchForm.value.principal_certificate +
        "&CA_owner__icontains=" + this.SLPSearchForm.value.ca_owner+
        "&ApproveDate__gte=" + this.dateFromApproveSLP +
        "&ApproveDate__lte=" + this.dateToApproveSLP
    }
    else if (this.ApproveDateSLP != null && this.ExpiryDateSLP != null){
      let temp = new Date(this.ApproveDateSLP[1].getTime());
      let temp2 = new Date(this.ApproveDateSLP[0].getTime());
      this.dateFromApproveSLP = formatDate(temp2, "yyyy-MM-dd", "en_GB") + "+00%3A00%3A00%2B00"
      this.dateToApproveSLP = formatDate(temp, "yyyy-MM-dd", "en_GB") + "+00%3A00%3A00%2B00"
      let temp3 = new Date(this.ExpiryDateSLP[1].getTime());
      let temp4 = new Date(this.ExpiryDateSLP[0].getTime());
      this.dateFromExpirySLP = formatDate(temp4, "yyyy-MM-dd", "en_GB") + "+00%3A00%3A00%2B00"
      this.dateToExpirySLP = formatDate(temp3, "yyyy-MM-dd", "en_GB") + "+00%3A00%3A00%2B00"
  
      this.datafield1 =
        "SLP_ID=" +
        this.SLPSearchForm.value.SLP_ID +
        "&SLPID_owner__icontains=" +
        this.SLPSearchForm.value.SLPID_owner +
        "&principal_certificate__icontains=" +
        this.SLPSearchForm.value.principal_certificate +
        "&CA_owner__icontains=" + this.SLPSearchForm.value.ca_owner+
        "&ApproveDate__gte=" + this.dateFromApproveSLP +
        "&ApproveDate__lte=" + this.dateToApproveSLP +
        "&ExpiryDate__gte=" + this.dateFromExpirySLP +
        "&ExpiryDate__lte=" + this.dateToExpirySLP
    }
    else {
      this.datafield1 =
        "SLP_ID=" +
        this.SLPSearchForm.value.SLP_ID +
        "&SLPID_owner__icontains=" +
        this.SLPSearchForm.value.SLPID_owner +
        "&principal_certificate__icontains=" +
        this.SLPSearchForm.value.principal_certificate +
        "&CA_owner__icontains=" + this.SLPSearchForm.value.ca_owner
    }
    // console.log("datafield1", this.datafield1)
    this.spinner.show()
    this.SLPService.filterMix_pagination(this.datafield1).subscribe(
      (res) => {
        this.SLPTable = res['results'];
        this.SLPTotalCount = res["count"];

        this.spinner.hide()
        this.SLPTable = this.SLPTable.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
      },
      (err) => {},
      () => {
        // if (this.ExpiryDateSLP != null || this.ApproveDateSLP != null){
        //   // this.SearchDateRangeSLP()
        // }

      }
    );
  }

  filterTableCertication() {
    this.searching_mode = true;

    if (this.ApproveDateCert != null && this.ExpiryDateCert == null){

      let temp = new Date(this.ApproveDateCert[1].getTime());
      let temp2 = new Date(this.ApproveDateCert[0].getTime());
      this.dateFromApproveCert = formatDate(temp2, "yyyy-MM-dd", "en_GB") + "T00:00:00"
      this.dateToApproveCert = formatDate(temp, "yyyy-MM-dd", "en_GB") + "T23:59:59"

      this.datafield1 =
      "FileNo=" +
      this.CertificationSearchForm.value.FileNo +
      "&TAC=" +
      this.CertificationSearchForm.value.TAC +
      "&ProductCategory=" +
      this.CertificationSearchForm.value.ProductCategory +
      "&Model__icontains=" +
      this.CertificationSearchForm.value.Model +
      "&Brand__icontains=" + this.CertificationSearchForm.value.Brand +
      "&ROCROB=" + this.CertificationSearchForm.value.ROCROB+
      "&CA_owner__icontains=" + this.CertificationSearchForm.value.ca_owner+
      "&ApproveDate__gte=" + this.dateFromApproveCert +
      "&ApproveDate__lte="+ this.dateToApproveCert +
      "&MarketingName__icontains=" + this.CertificationSearchForm.value.MarketingName +
      "&TypeOfProduct__icontains=" + this.CertificationSearchForm.value.TypeOfProduct
    }
    else if (this.ApproveDateCert != null && this.ExpiryDateCert != null) {

      let temp = new Date(this.ApproveDateCert[1].getTime());
      let temp2 = new Date(this.ApproveDateCert[0].getTime());
      this.dateFromApproveCert = formatDate(temp2, "yyyy-MM-dd", "en_GB") + "T00:00:00"
      this.dateToApproveCert = formatDate(temp, "yyyy-MM-dd", "en_GB") + "T23:59:59"

      let temp3 = new Date(this.ExpiryDateCert[1].getTime())
      let temp4 =new Date(this.ExpiryDateCert[0].getTime())
      this.dateFromExpiryCert = formatDate(temp4, "yyyy-MM-dd", "en_GB") + "T00:00:00"
      this.dateToExpiryCert = formatDate(temp3, "yyyy-MM-dd", "en_GB") + "T23:59:59"

      this.datafield1 =
      "FileNo=" +
      this.CertificationSearchForm.value.FileNo +
      "&TAC=" +
      this.CertificationSearchForm.value.TAC +
      "&ProductCategory=" +
      this.CertificationSearchForm.value.ProductCategory +
      "&Model__icontains=" +
      this.CertificationSearchForm.value.Model +
      "&Brand__icontains=" + this.CertificationSearchForm.value.Brand +
      "&ROCROB=" + this.CertificationSearchForm.value.ROCROB+
      "&CA_owner__icontains=" + this.CertificationSearchForm.value.ca_owner+
      "&ApproveDate__gte=" + this.dateFromApproveCert +
      "&ApproveDate__lte="+ this.dateToApproveCert +
      "&ExpiryDate__gte=" + this.dateFromExpiryCert+
      "&ExpiryDate__lte=" +this.dateToExpiryCert +
      "&MarketingName__icontains=" + this.CertificationSearchForm.value.MarketingName +
      "&TypeOfProduct__icontains=" + this.CertificationSearchForm.value.TypeOfProduct
    }
    else if(this.ExpiryDateCert != null && this.ApproveDateCert == null){

      let temp3 = new Date(this.ExpiryDateCert[1].getTime())
      let temp4 =new Date(this.ExpiryDateCert[0].getTime())
      this.dateFromExpiryCert = formatDate(temp4, "yyyy-MM-dd", "en_GB") + "T00:00:00"
      this.dateToExpiryCert = formatDate(temp3, "yyyy-MM-dd", "en_GB") + "T23:59:59"

      this.datafield1 =
      "FileNo=" +
      this.CertificationSearchForm.value.FileNo +
      "&TAC=" +
      this.CertificationSearchForm.value.TAC +
      "&ProductCategory=" +
      this.CertificationSearchForm.value.ProductCategory +
      "&Model__icontains=" +
      this.CertificationSearchForm.value.Model +
      "&Brand__icontains=" + this.CertificationSearchForm.value.Brand +
      "&ROCROB=" + this.CertificationSearchForm.value.ROCROB+
      "&CA_owner__icontains=" + this.CertificationSearchForm.value.ca_owner+
      "&ExpiryDate__gte=" + this.dateFromExpiryCert+
      "&ExpiryDate__lte=" +this.dateToExpiryCert +
      "&MarketingName__icontains=" + this.CertificationSearchForm.value.MarketingName +
      "&TypeOfProduct__icontains=" + this.CertificationSearchForm.value.TypeOfProduct
    }
    else{
      this.datafield1 =
      "FileNo=" +
      this.CertificationSearchForm.value.FileNo +
      "&TAC=" +
      this.CertificationSearchForm.value.TAC +
      "&ProductCategory=" +
      this.CertificationSearchForm.value.ProductCategory +
      "&Model__icontains=" +
      this.CertificationSearchForm.value.Model +
      "&Brand__icontains=" + this.CertificationSearchForm.value.Brand +
      "&ROCROB=" + this.CertificationSearchForm.value.ROCROB+
      "&CA_owner__icontains=" + this.CertificationSearchForm.value.ca_owner +
      "&MarketingName__icontains=" + this.CertificationSearchForm.value.MarketingName +
      "&TypeOfProduct__icontains=" + this.CertificationSearchForm.value.TypeOfProduct
    }

    this.spinner.show()
    // console.log('filter data', this.datafield1)
    this.productCertificationService.filterMix_pagination(this.datafield1).subscribe(
      (res) => {
        this.productCertificationTable = res['results'];
        this.productCertificationTotalCount = res["count"];
        this.spinner.hide()
        this.productCertificationTable = this.productCertificationTable.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
      },
      (err) => {},
      () => {
        if (this.ExpiryDateCert != null || this.ApproveDateCert != null){
          // this.SearchDateRangeCert()
        }
      }
    );
  }

  productGeneration() {
    this.productGenerationService.get().subscribe(
      (res) => {
        this.infoTable = res["results"];
        this.productRegistrationTotalCount = res["count"];
      },
      (err) => {
        // console.log("HTTP Error", err)
      },
      () => {
      }
    );
  }

  entryChange($event) {
    //this.tableEntries = +$event.target.value;
    this.tableEntries = 20;
  }

  entryChange2($event) {
    this.tableEntries2 = +$event.target.value;
  }

  entryChange3($event) {
    this.tableEntries3 = +$event.target.value;
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onSelect2({ selected }) {
    this.tableSelected2.splice(0, this.tableSelected2.length);
    this.tableSelected2.push(...selected);
  }

  onSelect3({ selected }) {
    this.tableSelected3.splice(0, this.tableSelected3.length);
    this.tableSelected3.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  onActivate2(event) {
    this.tableActiveRow2 = event.row;
  }

  onActivate3(event) {
    this.tableActiveRow3 = event.row;
  }

  NewData() {
    console.log(this.addNewDataForm.value);
    this.productGenerationService.post(this.addNewDataForm.value).subscribe(
      () => {
        // Success
        // this.isLoading = false
        // this.successMessage();
        // this.loadingBar.complete();
        // this.successAlert("create project");
        this.productGeneration();
        console.log("success");
      },
      () => {
        // Failed
        // this.isLoading = false
        // this.successMessage();
        // this.errorAlert("edit");
      },
      () => {
        // After
        // this.notifyService.openToastr("Success", "Welcome back");
        // this.navigateHomePage();
      }
    );
  }

  openModal(modalRef: TemplateRef<any>) {
    this.modal = this.modalService.show(modalRef, this.modalConfig);
  }

  closeModal() {
    this.modal.hide();
  }

  productCertificationGet() {
    this.productCertificationService.get().subscribe(
      (res) => {
        this.productCertificationTable = res['results'];
        this.productCertificationTotalCount = res['count']
      },
      (err) => {},
      () => {
      }
    );
  }

  SearchDateRangeCert() {
    if (this.ApproveDateCert != null && this.ExpiryDateCert == null){
      this.dateFromApproveCert = this.ApproveDateCert[0]
      this.dateToApproveCert = this.ApproveDateCert[1]
      console.log('dateFromApproveCert1',this.dateFromApproveCert)
      console.log('dateToApproveCert1',this.dateToApproveCert)
      let temp = this.exportTable
      for (let i in temp) {
        if (temp[i].ApproveDate) {
          if (formatDate(temp[i].ApproveDate, "yyyy-MM-dd", "en_US") >=
          formatDate(this.dateFromApproveCert, "yyyy-MM-dd", "en_US") &&
          formatDate(temp[i].ApproveDate, "yyyy-MM-dd", "en_US") <=
          formatDate(this.dateToApproveCert, "yyyy-MM-dd", "en_US")) {
            console.log('temp2',temp[i])
            this.temp2.push(temp[i]);
          }
        }
      }
    }

    else if (this.ApproveDateCert != null && this.ExpiryDateCert != null){
      this.dateFromApproveCert = this.ApproveDateCert[0]
      this.dateToApproveCert = this.ApproveDateCert[1]
      this.dateFromExpiryCert = this.ExpiryDateCert[0]
      this.dateToExpiryCert = this.ExpiryDateCert[1]
      console.log('dateFromApproveCert2',this.dateFromApproveCert)
      console.log('dateToApproveCert2',this.dateToApproveCert)
      let temp = this.exportTable
      for (let i in temp) {
        if (temp[i].ApproveDate) {
          if (formatDate(temp[i].ApproveDate, "yyyy-MM-dd", "en_US") >=
          formatDate(this.dateFromApproveCert, "yyyy-MM-dd", "en_US") &&
          formatDate(temp[i].ApproveDate, "yyyy-MM-dd", "en_US") <=
          formatDate(this.dateToApproveCert, "yyyy-MM-dd", "en_US")) {
            console.log('temp2',temp[i])
            this.temp.push(temp[i]);
          }
        }
      }

      let temp3 = this.temp
      for (let i in temp3) {
        if (temp3[i].ExpiryDate) {
          if (formatDate(temp3[i].ExpiryDate, "yyyy-MM-dd", "en_US") >=
          formatDate(this.dateFromExpiryCert, "yyyy-MM-dd", "en_US") &&
          formatDate(temp3[i].ExpiryDate, "yyyy-MM-dd", "en_US") <=
          formatDate(this.dateToExpiryCert, "yyyy-MM-dd", "en_US")) {
            console.log('temp3',temp3[i])
            this.temp2.push(temp3[i]);
          }
        }
      }
    }

    else if(this.ExpiryDateCert != null && this.ApproveDateCert == null){
      this.dateFromExpiryCert = this.ExpiryDateCert[0]
      this.dateToExpiryCert = this.ExpiryDateCert[1]
      console.log('dateFromApproveCert3',this.dateFromExpiryCert)
      console.log('dateToApproveCert3',this.dateToExpiryCert)

      let temp3 = this.exportTable
      for (let i in temp3) {
        if (temp3[i].ExpiryDate) {
          if (formatDate(temp3[i].ExpiryDate, "yyyy-MM-dd", "en_US") >=
          formatDate(this.dateFromExpiryCert, "yyyy-MM-dd", "en_US") &&
          formatDate(temp3[i].ExpiryDate, "yyyy-MM-dd", "en_US") <=
          formatDate(this.dateToExpiryCert, "yyyy-MM-dd", "en_US")) {
            this.temp2.push(temp3[i]);
          }
        }
      }
    }

    this.exportTable = this.temp2.slice(0,999)
    this.temp2 = []
  }

  SearchDateRangeSLP(){
    if (this.ApproveDateSLP != null && this.ExpiryDateSLP == null){
      this.dateFromApproveSLP = this.ApproveDateSLP[0]
      this.dateToApproveSLP = this.ApproveDateSLP[1]
      console.log('dateFromApproveSLP1',this.dateFromApproveSLP)
      console.log('dateToApproveSLP1',this.dateToApproveSLP)
      let temp = this.exportTable
      for (let i in temp) {
        if (temp[i].ApproveDate) {
          if (formatDate(temp[i].ApproveDate, "yyyy-MM-dd", "en_US") >=
          formatDate(this.dateFromApproveSLP, "yyyy-MM-dd", "en_US") &&
          formatDate(temp[i].ApproveDate, "yyyy-MM-dd", "en_US") <=
          formatDate(this.dateToApproveSLP, "yyyy-MM-dd", "en_US")) {
            console.log('temp2',temp[i])
            this.temp2.push(temp[i]);
          }
        }
      }
    }

    else if(this.ExpiryDateSLP != null && this.ApproveDateSLP != null){
      this.dateFromApproveSLP = this.ApproveDateSLP[0]
      this.dateToApproveSLP = this.ApproveDateSLP[1]
      this.dateFromExpirySLP = this.ExpiryDateSLP[0]
      this.dateToExpirySLP = this.ExpiryDateSLP[1]
      console.log('dateFromApproveSLP2',this.dateFromExpirySLP)
      console.log('dateToApproveSLP2',this.dateToExpirySLP)

      let temp = this.exportTable
      for (let i in temp) {
        if (temp[i].ApproveDate) {
          if (formatDate(temp[i].ApproveDate, "yyyy-MM-dd", "en_US") >=
          formatDate(this.dateFromApproveSLP, "yyyy-MM-dd", "en_US") &&
          formatDate(temp[i].ApproveDate, "yyyy-MM-dd", "en_US") <=
          formatDate(this.dateToApproveSLP, "yyyy-MM-dd", "en_US")) {
            console.log('temp2',temp[i])
            this.temp.push(temp[i]);
          }
        }
      }

      let temp3 = this.temp
      for (let i in temp3) {
        if (temp3[i].ExpiryDate) {
          if (formatDate(temp3[i].ExpiryDate, "yyyy-MM-dd", "en_US") >=
          formatDate(this.dateFromExpirySLP, "yyyy-MM-dd", "en_US") &&
          formatDate(temp3[i].ExpiryDate, "yyyy-MM-dd", "en_US") <=
          formatDate(this.dateToExpirySLP, "yyyy-MM-dd", "en_US")) {
            console.log('temp3',temp3[i])
            this.temp2.push(temp3[i]);
          }
        }
      }
    }

    else if(this.ExpiryDateSLP != null && this.ApproveDateSLP == null){
      this.dateFromExpirySLP = this.ExpiryDateSLP[0]
      this.dateToExpirySLP = this.ExpiryDateSLP[1]
      console.log('dateFromApproveSLP3',this.dateFromExpirySLP)
      console.log('dateToApproveSLP3',this.dateToExpirySLP)

      let temp3 = this.exportTable
      for (let i in temp3) {
        if (temp3[i].ExpiryDate) {
          if (formatDate(temp3[i].ExpiryDate, "yyyy-MM-dd", "en_US") >=
          formatDate(this.dateFromExpirySLP, "yyyy-MM-dd", "en_US") &&
          formatDate(temp3[i].ExpiryDate, "yyyy-MM-dd", "en_US") <=
          formatDate(this.dateToExpirySLP, "yyyy-MM-dd", "en_US")) {
            this.temp2.push(temp3[i]);
          }
        }
      }
    }

    this.exportTable = this.temp2.slice(0,999)
    this.temp2 = []
  }

  widgetDataGet() {
    this.subscription = forkJoin([
      this.VisitorCounterService.get(),
      this.productCertificationService.get_TAC(),
      this.productGenerationService.getWidget(),
    ]).subscribe(
      (res)=>{
        this.VisitorGetTable = res[0]
        this.TACData = res[1]['TAC_count']
        this.getDataDB = res[2]
        this.IMEIData = this.getDataDB[0]['imei_count']
        this.serialData = this.getDataDB[0]['serial_count']
      }
    );
  }

  SLPGet() {
    this.SLPService.get().subscribe(
      (res) => {
        this.SLPTable = res['results'];
        this.SLPTotalCount =res['count']

      },
      (err) => {
        // console.log("HTTP Error", err), this.errorMessage();
      },
      () => {
      }
    );
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.dataFromExcelFile = XLSX.utils.sheet_to_json(ws, { raw: false });
      console.log("this.data = ", this.dataFromExcelFile);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  submitFileExcelRegister() {
    let productRegisterationServ = this.productGenerationService;
    this.spinner.show()
    this.dataFromExcelFile.forEach(function (loopval, index) {
      let formDataaaaa: any
      formDataaaaa = [
        {
          FileNo: loopval.FileNo,
          TAC: loopval.TAC,
          SLPID: loopval.SLPID,
          ProductRegistrationNo: loopval.ProductRegistrationNo,
          RegType: loopval.RegType,
          SerialNo: loopval.SerialNo,
          IMEI: loopval.IMEI,
          CA_owner: loopval.CA_owner
        },
      ];

      // console.log('loopval.ROCROB = ', loopval)
      console.log("formDataaaaa = ", formDataaaaa[0]);
      // // dalam foreach
      productRegisterationServ.post(formDataaaaa[0]).subscribe(
        (res) => {
          console.log("res = ", res);
        },
        (error) => {
          console.error("err", error);
        }
      )
    })
    this.modal.hide();
      setTimeout(() => {
      this.spinner.hide();
      this.AuditUpload()
    }, 5000);
  }

  AuditUpload() {
    this.usersService.getOne(this.UserID).subscribe(
      (User)=>{
        this.userData = User
        console.log('userdata',this.userData)
        const obj = {
          history_user:this.userData,
          history_type:'+',
          history_desc: this.dataFromExcelFile.length
        }
        console.log("test",obj)
        this.productGenerationService.DataAudit(obj).subscribe(
          (data) => {
            console.log(data)
          },
          (err) => {
            console.log("err", err)
          },
        )
      }
    )
  }

  submitFileExcelCert() {
    let productCertificertServ = this.productCertificationService;
    this.spinner.show();
    this.dataFromExcelFile.forEach(function (loopval, index) {
      let formDataaaaa: any;
      formDataaaaa = [
        {
          FileNo: loopval.FileNo,
          TAC: loopval.TAC,
          TypeOfProduct: loopval.TypeOfProduct,
          Model: loopval.Model,
          Brand: loopval.Brand,
          MarketingName: loopval.MarketingName,
          ApproveDate: loopval.ApproveDate,
          ExpiryDate: loopval.ExpiryDate,
          ProductCategory: loopval.ProductCategory,
          CertholderName: loopval.CertholderName,
          ROCROB: loopval.ROCROB,
          CA_owner: loopval.CA_owner
        },
      ];

      // console.log('loopval.ROCROB = ', loopval)
      console.log("formDataaaaa = ", formDataaaaa[0]);

      // dalam foreach
      productCertificertServ.post(formDataaaaa[0]).subscribe(
        (res) => {
          console.log("res = ", res);
        },
        (error) => {
          console.error("err", error);
        }
      );
    });
    this.productCertificationGet();
    this.modal.hide();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  submitFileExcelSLPID() {
    let SLPService = this.SLPService;
    this.spinner.show();
    this.dataFromExcelFile.forEach(function (loopval, index) {
      let formDataSLP: any;
      formDataSLP = [
        {
          SLP_ID: loopval.SLP_ID,
          ExpiryDate: loopval.ExpiryDate,
          ApproveDate: loopval.ApproveDate,
          SLPID_owner: loopval.SLPID_owner,
          principal_certificate: loopval.principal_certificate,
          CA_owner: loopval.CA_owner
        },
      ];

      // console.log('loopval.ROCROB = ', loopval.SLPID)
      // console.log("formDataaaaa = ", formDataSLP[0]);

      // dalam foreach
      SLPService.post(formDataSLP[0]).subscribe(
        (res) => {
          // console.log("res = ", res);
        },
        (error) => {
          console.error("err", error);
        }
      );
    });
    this.SLPGet();
    this.modal.hide();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  confirmExport() {
    swal.fire({
      title: "Confirmation",
      text: "Are you sure want to export this data?",
      type: "info",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-info",
      confirmButtonText: "Confirm",
      showCancelButton: true,
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if(result.value){
        this.export()
      }
    })
  }

  confirmExportCert() {
    swal.fire({
      title: "Confirmation",
      text: "Are you sure want to export this data?",
      type: "info",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-info",
      confirmButtonText: "Confirm",
      showCancelButton: true,
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if(result.value){
        this.exportCert()}
      
    })
  }

  confirmExportSLP() {
    swal.fire({
      title: "Confirmation",
      text: "Are you sure want to export this data?",
      type: "info",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-info",
      confirmButtonText: "Confirm",
      showCancelButton: true,
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if(result.value){
        this.exportSLP()}

    })
  }

  export() {
    // this.dateFrom = formatDate(this.selectedDate[0], "yyyy-MM-dThh:mm:ss", "en_US")
    // this.dateTo = formatDate(this.selectedDate[1], "yyyy-MM-dThh:mm:ss", "en_US")
    if (this.infoTable.length <= 18) {
      this.spinner.show()
      this.exportTable = this.infoTable
      setTimeout(() => {
        this.exportexcel()
        this.spinner.hide()
      }, 3000);
    }

    else {

    if(this.RegisterSearchForm.value.ProductRegistrationNo == undefined && this.RegisterSearchForm.value.SLPID == undefined && this.RegisterSearchForm.value.TAC == undefined ){
      console.log('loop 1')
      this.datafield1 =
      "&IMEI=" +
      this.RegisterSearchForm.value.imei +
      "&RegType=" +
      this.RegisterSearchForm.value.RegType +
      "&SerialNo=" + this.RegisterSearchForm.value.SerialNo +
      "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner 
    //   "&created_date__gte=" + this.dateFrom +
    //   "&created_date__lte=" + this.dateTo
    }
    else if (this.RegisterSearchForm.value.ProductRegistrationNo == undefined && this.RegisterSearchForm.value.TAC == undefined && this.RegisterSearchForm.value.SLPID != undefined ) {
      console.log('loop 2')
      this.datafield1 =
      "&IMEI=" +
      this.RegisterSearchForm.value.imei +
      "&RegType=" +
      this.RegisterSearchForm.value.RegType +
      "&SerialNo=" + this.RegisterSearchForm.value.SerialNo +
      "&SLPID=" + this.RegisterSearchForm.value.SLPID +
      // "&created_date__gte=" + this.dateFrom +
      // "&created_date__lte=" + this.dateTo +
      "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner 
    }
    else if (this.RegisterSearchForm.value.ProductRegistrationNo == undefined && this.RegisterSearchForm.value.SLPID == undefined && this.RegisterSearchForm.value.TAC != undefined) {
      console.log('loop 3')
      this.datafield1 =
      "TAC=" + this.RegisterSearchForm.value.TAC +
      "&IMEI=" +
      this.RegisterSearchForm.value.imei +
      "&RegType=" +
      this.RegisterSearchForm.value.RegType +
      "&SerialNo=" + this.RegisterSearchForm.value.SerialNo +
      // "&created_date__gte=" + this.dateFrom +
      // "&created_date__lte=" + this.dateTo +
      "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner 
    }
    else if (this.RegisterSearchForm.value.ProductRegistrationNo != undefined && this.RegisterSearchForm.value.TAC == undefined && this.RegisterSearchForm.value.SLPID == undefined) {
      console.log('loop 4')
      this.datafield1 =
      "&IMEI=" +
      this.RegisterSearchForm.value.imei +
      "&RegType=" +
      this.RegisterSearchForm.value.RegType +
      "&SerialNo=" + this.RegisterSearchForm.value.SerialNo + 
      "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
      "&ProductRegistrationNo=" +
      this.RegisterSearchForm.value.ProductRegistrationNo 
      // "&created_date__gte=" + this.dateFrom +
      // "&created_date__lte=" + this.dateTo
    }
    else if (this.RegisterSearchForm.value.ProductRegistrationNo != undefined && this.RegisterSearchForm.value.TAC != undefined && this.RegisterSearchForm.value.SLPID == undefined) {
      console.log('loop 5')
      this.datafield1 =
      "TAC=" + this.RegisterSearchForm.value.TAC +
      "&IMEI=" +
      this.RegisterSearchForm.value.imei +
      "&RegType=" +
      this.RegisterSearchForm.value.RegType +
      "&SerialNo=" + this.RegisterSearchForm.value.SerialNo + 
      "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
      "&ProductRegistrationNo=" +
      this.RegisterSearchForm.value.ProductRegistrationNo 
      // "&created_date__gte=" + this.dateFrom +
      // "&created_date__lte=" + this.dateTo
    }
    else if (this.RegisterSearchForm.value.ProductRegistrationNo != undefined && this.RegisterSearchForm.value.TAC == undefined && this.RegisterSearchForm.value.SLPID != undefined) {
      console.log('loop 6')
      this.datafield1 =
      "SLPID=" + this.RegisterSearchForm.value.SLPID +
      "&IMEI=" +
      this.RegisterSearchForm.value.imei +
      "&RegType=" +
      this.RegisterSearchForm.value.RegType +
      "&SerialNo=" + this.RegisterSearchForm.value.SerialNo + 
      "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
      "&ProductRegistrationNo=" +
      this.RegisterSearchForm.value.ProductRegistrationNo 
      // "&created_date__gte=" + this.dateFrom +
      // "&created_date__lte=" + this.dateTo
    }
    else if (this.RegisterSearchForm.value.ProductRegistrationNo == undefined && this.RegisterSearchForm.value.TAC != undefined && this.RegisterSearchForm.value.SLPID != undefined) {
      console.log('loop 7')
      this.datafield1 =
      "SLPID=" + this.RegisterSearchForm.value.SLPID +
      "&IMEI=" +
      this.RegisterSearchForm.value.imei +
      "&RegType=" +
      this.RegisterSearchForm.value.RegType +
      "&SerialNo=" + this.RegisterSearchForm.value.SerialNo + 
      "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
      "&TAC=" + this.RegisterSearchForm.value.TAC 
      // "&created_date__gte=" + this.dateFrom +
      // "&created_date__lte=" + this.dateTo
    }
    else if (this.RegisterSearchForm.value.ProductRegistrationNo != undefined && this.RegisterSearchForm.value.TAC != undefined && this.RegisterSearchForm.value.SLPID != undefined) {
      console.log('loop 8')
      this.datafield1 =
      "SLPID=" + this.RegisterSearchForm.value.SLPID +
      "&IMEI=" +
      this.RegisterSearchForm.value.imei +
      "&RegType=" +
      this.RegisterSearchForm.value.RegType +
      "&SerialNo=" + this.RegisterSearchForm.value.SerialNo + 
      "&CA_owner__icontains=" + this.RegisterSearchForm.value.ca_owner +
      "&TAC=" + this.RegisterSearchForm.value.TAC +
      "&ProductRegistrationNo=" +
      this.RegisterSearchForm.value.ProductRegistrationNo 
    //   "&created_date__gte=" + this.dateFrom +
    //   "&created_date__lte=" + this.dateTo
    }

    // this.datafield1 =
    // "TAC=" + this.RegisterSearchForm.value.TAC +
    // "&SLPID=" + this.RegisterSearchForm.value.SLPID +
    // "&ProductRegistrationNo=" + this.RegisterSearchForm.value.ProductRegistrationNo +
    // "&created_date__gte=" + this.dateFrom +
    // "&created_date__lte=" + this.dateTo
    
    console.log(this.datafield1);
    this.spinner.show()
    this.exportDate = 'True'
    this.productGenerationService.filterMix(this.datafield1).subscribe(
      (res) => {
        this.exportTable = res;
        console.log(this.exportTable)
        this.exportTable = this.exportTable.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });

        this.SearchDateRange()
        
        
      },
      (err) => {},
      () => {
        setTimeout(() => {
          this.exportexcel()
          this.spinner.hide()
        }, 10000);
        
      }
    );

    }

  }

  exportCert() {
    // if (this.ApproveDateCert != null && this.ExpiryDateCert == null){

    //   let temp = new Date(this.ApproveDateCert[1].getTime());
    //   let temp2 = new Date(this.ApproveDateCert[0].getTime());
    //   this.dateFromApproveCert = formatDate(temp2, "yyyy-MM-dd", "en_GB") + "T00:00:00"
    //   this.dateToApproveCert = formatDate(temp, "yyyy-MM-dd", "en_GB") + "T23:59:59"

    //   this.datafield1 =
    //   "FileNo=" +
    //   this.CertificationSearchForm.value.FileNo +
    //   "&TAC=" +
    //   this.CertificationSearchForm.value.TAC +
    //   "&ProductCategory=" +
    //   this.CertificationSearchForm.value.ProductCategory +
    //   "&Model=" +
    //   this.CertificationSearchForm.value.Model +
    //   "&Brand=" + this.CertificationSearchForm.value.Brand +
    //   "&ROCROB=" + this.CertificationSearchForm.value.ROCROB+
    //   "&CA_owner=" + this.CertificationSearchForm.value.ca_owner+
    //   "&ApproveDate__gte=" + this.dateFromApproveCert +
    //   "&ApproveDate__lte="+ this.dateToApproveCert +
    //   "&MarketingName=" + this.CertificationSearchForm.value.MarketingName
    // }
    // else if (this.ApproveDateCert != null && this.ExpiryDateCert != null) {

    //   let temp = new Date(this.ApproveDateCert[1].getTime());
    //   let temp2 = new Date(this.ApproveDateCert[0].getTime());
    //   this.dateFromApproveCert = formatDate(temp2, "yyyy-MM-dd", "en_GB") + "T00:00:00"
    //   this.dateToApproveCert = formatDate(temp, "yyyy-MM-dd", "en_GB") + "T23:59:59"

    //   let temp3 = new Date(this.ExpiryDateCert[1].getTime())
    //   let temp4 =new Date(this.ExpiryDateCert[0].getTime())
    //   this.dateFromExpiryCert = formatDate(temp4, "yyyy-MM-dd", "en_GB") + "T00:00:00"
    //   this.dateToExpiryCert = formatDate(temp3, "yyyy-MM-dd", "en_GB") + "T23:59:59"

    //   this.datafield1 =
    //   "FileNo=" +
    //   this.CertificationSearchForm.value.FileNo +
    //   "&TAC=" +
    //   this.CertificationSearchForm.value.TAC +
    //   "&ProductCategory=" +
    //   this.CertificationSearchForm.value.ProductCategory +
    //   "&Model=" +
    //   this.CertificationSearchForm.value.Model +
    //   "&Brand=" + this.CertificationSearchForm.value.Brand +
    //   "&ROCROB=" + this.CertificationSearchForm.value.ROCROB+
    //   "&CA_owner=" + this.CertificationSearchForm.value.ca_owner+
    //   "&ApproveDate__gte=" + this.dateFromApproveCert +
    //   "&ApproveDate__lte="+ this.dateToApproveCert +
    //   "&ExpiryDate__gte=" + this.dateFromExpiryCert+
    //   "&ExpiryDate__lte=" +this.dateToExpiryCert +
    //   "&MarketingName=" + this.CertificationSearchForm.value.MarketingName
    // }
    // else if(this.ExpiryDateCert != null && this.ApproveDateCert == null){

    //   let temp3 = new Date(this.ExpiryDateCert[1].getTime())
    //   let temp4 =new Date(this.ExpiryDateCert[0].getTime())
    //   this.dateFromExpiryCert = formatDate(temp4, "yyyy-MM-dd", "en_GB") + "T00:00:00"
    //   this.dateToExpiryCert = formatDate(temp3, "yyyy-MM-dd", "en_GB") + "T23:59:59"

    //   this.datafield1 =
    //   "FileNo=" +
    //   this.CertificationSearchForm.value.FileNo +
    //   "&TAC=" +
    //   this.CertificationSearchForm.value.TAC +
    //   "&ProductCategory=" +
    //   this.CertificationSearchForm.value.ProductCategory +
    //   "&Model=" +
    //   this.CertificationSearchForm.value.Model +
    //   "&Brand=" + this.CertificationSearchForm.value.Brand +
    //   "&ROCROB=" + this.CertificationSearchForm.value.ROCROB+
    //   "&CA_owner=" + this.CertificationSearchForm.value.ca_owner+
    //   "&ExpiryDate__gte=" + this.dateFromExpiryCert+
    //   "&ExpiryDate__lte=" +this.dateToExpiryCert +
    //   "&MarketingName=" + this.CertificationSearchForm.value.MarketingName
    // }
    // else{
    this.datafield1 =
    "FileNo=" +
    this.CertificationSearchForm.value.FileNo +
    "&TAC=" +
    this.CertificationSearchForm.value.TAC +
    "&ProductCategory=" +
    this.CertificationSearchForm.value.ProductCategory +
    "&Model=" +
    this.CertificationSearchForm.value.Model +
    "&Brand=" + this.CertificationSearchForm.value.Brand +
    "&ROCROB=" + this.CertificationSearchForm.value.ROCROB+
    "&CA_owner=" + this.CertificationSearchForm.value.ca_owner +
    "&MarketingName=" + this.CertificationSearchForm.value.MarketingName +
    "&TypeOfProduct=" + this.CertificationSearchForm.value.TypeOfProduct
    // }
  
    console.log(this.datafield1);
    this.spinner.show()
    this.productCertificationService.filterMix(this.datafield1).subscribe(
      (res) => {
        this.exportTable = res;
        console.log(this.exportTable)
        this.exportTable = this.exportTable.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });

        this.SearchDateRangeCert()
        
      },
      (err) => {},
      () => {
        setTimeout(() => {
          this.exportexcelCert()
          this.spinner.hide()
        }, 10000);
      }
    );
  }

  exportSLP() {
    // this.dateFrom = formatDate(this.ExpiryDateSLP[0], "yyyy-MM-dThh:mm:ss", "en_US")
    // this.dateTo = formatDate(this.ApproveDateSLP[1], "yyyy-MM-dThh:mm:ss", "en_US")

    // if (this.ApproveDateSLP == null && this.ExpiryDateSLP != null){
    //   let temp = new Date(this.ExpiryDateSLP[1].getTime());
    //   let temp2 = new Date(this.ExpiryDateSLP[0].getTime());
    //   this.dateFromExpirySLP = formatDate(temp2, "yyyy-MM-dd", "en_GB") + "+00%3A00%3A00%2B00"
    //   this.dateToExpirySLP = formatDate(temp, "yyyy-MM-dd", "en_GB") + "+00%3A00%3A00%2B00"
  
    //   this.datafield1 =
    //     "SLP_ID=" +
    //     this.SLPSearchForm.value.SLP_ID +
    //     "&SLPID_owner=" +
    //     this.SLPSearchForm.value.SLPID_owner +
    //     "&principal_certificate=" +
    //     this.SLPSearchForm.value.principal_certificate +
    //     "&CA_owner=" + this.SLPSearchForm.value.ca_owner+
    //     "&ExpiryDate__gte=" + this.dateFromExpirySLP +
    //     "&ExpiryDate__lte=" + this.dateToExpirySLP
    //   }
    // else if (this.ApproveDateSLP != null && this.ExpiryDateSLP == null){
    //   let temp = new Date(this.ApproveDateSLP[1].getTime());
    //   let temp2 = new Date(this.ApproveDateSLP[0].getTime());
    //   this.dateFromApproveSLP = formatDate(temp2, "yyyy-MM-dd", "en_GB") + "+00%3A00%3A00%2B00"
    //   this.dateToApproveSLP = formatDate(temp, "yyyy-MM-dd", "en_GB") + "+00%3A00%3A00%2B00"
  
    //   this.datafield1 =
    //     "SLP_ID=" +
    //     this.SLPSearchForm.value.SLP_ID +
    //     "&SLPID_owner=" +
    //     this.SLPSearchForm.value.SLPID_owner +
    //     "&principal_certificate=" +
    //     this.SLPSearchForm.value.principal_certificate +
    //     "&CA_owner=" + this.SLPSearchForm.value.ca_owner+
    //     "&ApproveDate__gte=" + this.dateFromApproveSLP +
    //     "&ApproveDate__lte=" + this.dateToApproveSLP
    // }
    // else if (this.ApproveDateSLP != null && this.ExpiryDateSLP != null){
    //   let temp = new Date(this.ApproveDateSLP[1].getTime());
    //   let temp2 = new Date(this.ApproveDateSLP[0].getTime());
    //   this.dateFromApproveSLP = formatDate(temp2, "yyyy-MM-dd", "en_GB") + "+00%3A00%3A00%2B00"
    //   this.dateToApproveSLP = formatDate(temp, "yyyy-MM-dd", "en_GB") + "+00%3A00%3A00%2B00"
    //   let temp3 = new Date(this.ExpiryDateSLP[1].getTime());
    //   let temp4 = new Date(this.ExpiryDateSLP[0].getTime());
    //   this.dateFromExpirySLP = formatDate(temp4, "yyyy-MM-dd", "en_GB") + "+00%3A00%3A00%2B00"
    //   this.dateToExpirySLP = formatDate(temp3, "yyyy-MM-dd", "en_GB") + "+00%3A00%3A00%2B00"
  
    //   this.datafield1 =
    //     "SLP_ID=" +
    //     this.SLPSearchForm.value.SLP_ID +
    //     "&SLPID_owner=" +
    //     this.SLPSearchForm.value.SLPID_owner +
    //     "&principal_certificate=" +
    //     this.SLPSearchForm.value.principal_certificate +
    //     "&CA_owner=" + this.SLPSearchForm.value.ca_owner+
    //     "&ApproveDate__gte=" + this.dateFromApproveSLP +
    //     "&ApproveDate__lte=" + this.dateToApproveSLP +
    //     "&ExpiryDate__gte=" + this.dateFromExpirySLP +
    //     "&ExpiryDate__lte=" + this.dateToExpirySLP
    // }
    // else {
    this.datafield1 =
      "SLP_ID=" +
      this.SLPSearchForm.value.SLP_ID +
      "&SLPID_owner=" +
      this.SLPSearchForm.value.SLPID_owner +
      "&principal_certificate=" +
      this.SLPSearchForm.value.principal_certificate +
      "&CA_owner=" + this.SLPSearchForm.value.ca_owner
    // }
    

    console.log(this.datafield1);
    this.spinner.show()
    this.SLPService.filterMix(this.datafield1).subscribe(
      (res) => {
        this.exportTable = res;
        console.log(this.exportTable)
        this.exportTable = this.exportTable.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
        this.SearchDateRangeSLP()
        
      },
      (err) => {},
      () => {
        setTimeout(() => {
          this.exportexcelSLP()
          this.spinner.hide()
        }, 10000);
      }
    );
  }

  exportexcel() {
    /* table id is passed over here */   
    let elementReg = document.getElementById('tableProductReg'); 
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(elementReg);
    console.log("registration",elementReg)
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // /* save to file */
    XLSX.writeFile(wb, this.fileNameRegistration);
  }

  exportexcelCert() {
  /* table id is passed over here */   
  let elementCert = document.getElementById('excel-table-cert'); 
  const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(elementCert);
  console.log("export",elementCert)
  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // /* save to file */
  XLSX.writeFile(wb, this.fileNameCert);
  }

  exportexcelSLP() {
    /* table id is passed over here */   
    let element = document.getElementById('excel_table_SLP'); 
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    console.log("export",element)
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileNameSLPID);
  }

  SearchDateRange() {
    console.log("dateRange", this.selectedDate)
    if (this.selectedDate != null){
      this.dateFrom = this.selectedDate[0];
      this.dateTo = this.selectedDate[1];
      let temp = this.infoTable;
        for (let i in temp) {
          if (temp[i].created_date) {
            if (
              formatDate(temp[i].created_date, "yyyy-MM-dd", "en_US") >=
                formatDate(this.dateFrom, "yyyy-MM-dThh:mm:ss", "en_US") &&
              formatDate(temp[i].created_date, "yyyy-MM-dd", "en_US") <=
                formatDate(this.dateTo, "yyyy-MM-dd", "en_US")
            ) {
              console.log(temp[i])
              this.temp2.push(temp[i]);
            }
          }
        }
        this.infoTable = this.temp2
        this.temp2 = []
    }

    if (this.exportDate='True'){
      this.dateFrom = this.selectedDate[0];
      this.dateTo = this.selectedDate[1];
      let temp = this.exportTable;
        for (let i in temp) {
          if (temp[i].created_date) {
            if (
              formatDate(temp[i].created_date, "yyyy-MM-dd", "en_US") >=
                formatDate(this.dateFrom, "yyyy-MM-dThh:mm:ss", "en_US") &&
              formatDate(temp[i].created_date, "yyyy-MM-dd", "en_US") <=
                formatDate(this.dateTo, "yyyy-MM-dd", "en_US")
            ) {
              console.log(temp[i])
              this.temp2.push(temp[i]);
            }
          }
        }
        this.exportTable = this.temp2
        this.exportDate ='false'
        this.temp2 = []
    }
  }


  // pagination function
  onFooterPage1($event) {
      this.spinner.show()

      if (this.searching_mode) {
        this.productGenerationService.filterMix_pagination(this.datafield1+"&page="+$event.page).subscribe(
          (res) => {
            this.infoTable = []
            this.infoTable = res["results"];
            this.productRegistrationTotalCount = res["count"];
            this.spinner.hide()
          },
          (err) => {
            console.log("HTTP Error", err)
            this.spinner.hide()
          },
          () => {
          }
        );

      }
      else {

        this.productGenerationService.get_pagination($event.page).subscribe(
          (res) => {
            this.infoTable = []
            this.infoTable = res["results"];
            this.productRegistrationTotalCount = res["count"];
            this.spinner.hide()
          },
          (err) => {
            console.log("HTTP Error", err)
            this.spinner.hide()
          },
          () => {
          }
        );
      }
  }

  onFooterPage2($event) {
    this.spinner.show()

    if (this.searching_mode) {
      this.productCertificationService.filterMix_pagination(this.datafield1+"&page="+$event.page).subscribe(
        (res) => {
          this.productCertificationTable = []
          this.productCertificationTable = res["results"];
          this.productCertificationTotalCount = res["count"];
          this.spinner.hide()
        },
        (err) => {
          console.log("HTTP Error", err)
          this.spinner.hide()
        },
        () => {
        }
      );

    }
    else {

      this.productCertificationService.get_pagination($event.page).subscribe(
        (res) => {
          this.productCertificationTable = []
          this.productCertificationTable = res["results"];
          this.productCertificationTotalCount = res["count"];
          this.spinner.hide()
        },
        (err) => {
          console.log("HTTP Error", err)
          this.spinner.hide()
        },
        () => {
        }
      );
    }
}

  onFooterPage3($event) {
    this.spinner.show()

    if (this.searching_mode) {
      this.SLPService.filterMix_pagination(this.datafield1+"&page="+$event.page).subscribe(
        (res) => {
          this.SLPTable = []
          this.SLPTable = res["results"];
          this.SLPTotalCount = res["count"];
          this.spinner.hide()
        },
        (err) => {
          console.log("HTTP Error", err)
          this.spinner.hide()
        },
        () => {
        }
      );

    }
    else {

      this.SLPService.get_pagination($event.page).subscribe(
        (res) => {
          this.SLPTable = []
          this.SLPTable = res["results"];
          this.SLPTotalCount = res["count"];
          this.spinner.hide()
        },
        (err) => {
          console.log("HTTP Error", err)
          this.spinner.hide()
        },
        () => {
        }
      );
    }
  }

  confirm(row) {
    swal.fire({
      title: "Confirmation",
      text: "Are you sure to delete this data?",
      type: "info",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-info",
      confirmButtonText: "Confirm",
      showCancelButton: true,
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.value) {
        console.log(row.Id)
        this.spinner.show()
        this.productGenerationService.delete(row.Id).subscribe(
        (res) => {
        console.log("res", res);
        this.spinner.hide()
        this.deleteMessage()
        },
        (err) => {
        },
        );
      }
      this.usersService.getOne(this.UserID).subscribe(
        (User)=>{
          this.userData = User
          console.log('userdata',this.userData)
          const obj = {
            history_user:this.userData,
            history_type:'-',
            history_desc:'1'
          }
          console.log("test",obj)
          this.productGenerationService.DataAudit(obj).subscribe(
            (data) => {
              console.log(data)
            },
            (err) => {
              console.log("err", err)
            },
          )
        }
      )
    })
  }

  confirmCert(row) {
    swal.fire({
      title: "Confirmation",
      text: "Are you sure to delete this data?",
      type: "info",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-info",
      confirmButtonText: "Confirm",
      showCancelButton: true,
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.value) {
        console.log(row.Id)
        this.spinner.show()
        this.productCertificationService.delete(row.Id).subscribe(
        (res) => {
        console.log("res", res);
        this.spinner.hide()
        this.deleteMessage()
        },
        (err) => {
        },
        );
      }
      this.usersService.getOne(this.UserID).subscribe(
        (User)=>{
          this.userData = User
          console.log('userdata',this.userData)
          const obj = {
            history_user:this.userData,
            history_type:'-',
            history_desc:'1'
          }
          console.log("test",obj)
          this.productGenerationService.DataAudit(obj).subscribe(
            (data) => {
              console.log(data)
            },
            (err) => {
              console.log("err", err)
            },
          )
        }
      )
    })
  }

  confirmSLP(row) {
    swal.fire({
      title: "Confirmation",
      text: "Are you sure to delete this data?",
      type: "info",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-info",
      confirmButtonText: "Confirm",
      showCancelButton: true,
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.value) {
        console.log(row.Id)
        this.spinner.show()
        this.SLPService.delete(row.Id).subscribe(
        (res) => {
        console.log("res", res);
        this.spinner.hide()
        this.deleteMessage()
        },
        (err) => {
        },
        );
      }
      this.usersService.getOne(this.UserID).subscribe(
        (User)=>{
          this.userData = User
          console.log('userdata',this.userData)
          const obj = {
            history_user:this.userData,
            history_type:'-',
            history_desc:'1'
          }
          console.log("test",obj)
          this.productGenerationService.DataAudit(obj).subscribe(
            (data) => {
              console.log(data)
            },
            (err) => {
              console.log("err", err)
            },
          )
        }
      )
    })
  }

  checkRow(row) {
    for (let i = 0; i < this.infoTable.length; i++) {
      if (this.infoTable[i].Id == row.Id) {
        this.infoTable[i].isTick = row.isTick;
      }
    }
  }

  checkRowCert(row) {
    for (let i = 0; i < this.productCertificationTable.length; i++) {
      if (this.productCertificationTable[i].Id == row.Id) {
        this.productCertificationTable[i].isTick = row.isTick;
      }
    }
  }

  checkRowSLP(row) {
    for (let i = 0; i < this.SLPTable.length; i++) {
      if (this.SLPTable[i].Id == row.Id) {
        this.SLPTable[i].isTick = row.isTick;
      }
    }
  }

  deleteMessage() {
    swal.fire({
      title: "Success",
      text: "Data has been deleted!",
      type: "success",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      confirmButtonText: "Close"
    }).then((result) => {
      if (result.value) {
        this.productGeneration()
      }
    })
  }

  confirmRegBulk() {
    swal.fire({
      title: "Confirmation",
      text: "Are you sure to delete this data?",
      type: "info",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-info",
      confirmButtonText: "Confirm",
      showCancelButton: true,
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.value) {
        console.log("bulk reg delete")
        this.bulkDELETE()
      }
    })
  }

  confirmCertBulk() {
    swal.fire({
      title: "Confirmation",
      text: "Are you sure to delete this data?",
      type: "info",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-info",
      confirmButtonText: "Confirm",
      showCancelButton: true,
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.value) {
        console.log("bulk cert delete")
        this.bulkDELETECert()
      }
    })
  }

  confirmSLPBulk() {
    swal.fire({
      title: "Confirmation",
      text: "Are you sure to delete this data?",
      type: "info",
      buttonsStyling: false,
      confirmButtonClass: "btn btn-info",
      confirmButtonText: "Confirm",
      showCancelButton: true,
      cancelButtonClass: "btn btn-danger",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.value) {
        console.log("bulk SLP delete")
        this.bulkDELETESLP()
      }
    })
  }

  bulkDELETE() {
    this.jai=0
    this.spinner.show();
    let j = 0
    for (let i=0; i<this.infoTable.length; i++) {
      if (this.infoTable[i].isTick == true) {
        
        this.productGenerationService.delete(this.infoTable[i].Id).subscribe(
          (res)=> {
            console.log(res);
          },
          (err)=> {
            console.log(err);
          },
          () => {

          }
        );
        j++
        this.jai=j
      }

    }
    this.AuditBulkDelete()
    this.spinner.hide();
    this.deleteMessage();

  }

  AuditBulkDelete() {
    this.usersService.getOne(this.UserID).subscribe(
      (User)=>{
        this.userData = User
        console.log('userdata',this.userData)
        const obj = {
          history_user:this.userData,
          history_type:'-',
          history_desc: this.jai
        }
        console.log("test",obj)
        this.productGenerationService.DataAudit(obj).subscribe(
          (data) => {
            console.log(data)
          },
          (err) => {
            console.log("err", err)
          },
        )
      }
    )
  }

  bulkDELETECert() {
    this.jai=0
    this.spinner.show();
    let j = 0
    for (let i=0; i<this.productCertificationTable.length; i++) {
      if (this.productCertificationTable[i].isTick == true) {
        this.productCertificationService.delete(this.productCertificationTable[i].Id).subscribe(
          (res)=> {
            console.log(res);
            this.productCertificationGet()
          },
          (err)=> {
            console.log(err);
          },
          () => {

          }
        );
        j++
        this.jai=j
      }
    }
    this.AuditBulkDelete()
    this.spinner.hide();
    this.deleteMessage();

  }

  bulkDELETESLP() {
    this.jai=0
    this.spinner.show();
    let j = 0
    for (let i=0; i<this.SLPTable.length; i++) {
      if (this.SLPTable[i].isTick == true) {
        this.SLPService.delete(this.SLPTable[i].Id).subscribe(
          (res)=> {
            console.log(res);
            this.SLPGet()
          },
          (err)=> {
            console.log(err);
          },
          () => {

          }
        );
        j++
        this.jai=j
      }
    }
    this.AuditBulkDelete()
    this.spinner.hide();
    this.deleteMessage();

  }

  getToken() {
    let jwtHelper: JwtHelperService = new JwtHelperService()
    const token = localStorage.getItem('accessToken');
    console.log('token = ', token)

    let decodedToken = jwtHelper.decodeToken(token)
    this.UserID = decodedToken.user_id
    console.log('user ID = ', this.UserID)

    this.usersService.getOne(this.UserID).subscribe(
      (res)=>{
        this.userData = res['user_type']
        console.log (this.userData)

      },
      (err) => {

      },
      () =>{
        
      }
    )

  }

}