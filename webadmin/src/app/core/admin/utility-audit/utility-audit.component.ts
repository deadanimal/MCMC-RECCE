import { ProductGenerationService } from "src/app/shared/services/ProductRegistration/ProductGeneration.service";
import { productCertificationService } from "src/app/shared/services/productCertification/productCertification.service";
import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import { forkJoin, Subscription } from "rxjs";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { FAQCategoriesService } from "src/app/shared/services/FAQCategories/FAQCategories.service";
import { VisitorCounterService } from "src/app/shared/services/VisitorCounter/VisitorCounter.service";
import { formatDate } from "@angular/common";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";

am4core.useTheme(am4themes_animated);

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: "app-utility-audit",
  templateUrl: "./utility-audit.component.html",
  styleUrls: ["./utility-audit.component.scss"],
})
export class UtilityAuditComponent implements OnInit {
  private chart: any;
  dataHistory;
  dataHistory2;
  VisitorGetTable = [];
  array = [];
  TACData: number
  IMEIData: number
  serialData: number
  getDataDB = []
  dataSearchForm: FormGroup;

  selectedDate: any;
  dateFrom;
  dateTo;
  temp;
  temp2 = [];

  // Table
  tableEntries: number = 10;
  tableSelected: any[] = [];
  tableTemp = [];
  tableActiveRow: any;
  SelectionType = SelectionType;

  subscription: Subscription;

  constructor(
    private zone: NgZone,
    private faqCategoriesService: FAQCategoriesService,
    private VisitorCounterService: VisitorCounterService,
    private productCertificationService: productCertificationService,
    private productGenerationService: ProductGenerationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.history();
    this.widgetDataGet();

    this.dataSearchForm = this.formBuilder.group({
      Action: new FormControl(""),
      history_date: new FormControl(""),
    });
  }

  history() {
    this.subscription = forkJoin([
      this.faqCategoriesService.getHistory(),
      this.faqCategoriesService.getHistory2(),
      this.faqCategoriesService.getHistory3(),
      this.faqCategoriesService.getHistory4(),
      this.faqCategoriesService.getHistory5(),
      this.faqCategoriesService.getHistory6(),
      this.faqCategoriesService.getHistory7(),
      this.faqCategoriesService.getHistory8(),
    ]).subscribe(
      (res) => {
        let arrayZero = [];
        let arrayOne = [];
        let arrayTwo = [];
        let arrayThree = [];
        let arrayFour = [];
        let arrayFive = [];
        let arraySix = [];
        let arraySeven = [];
        // let rangeArray = []

        arrayZero = res[0];
        arrayOne = res[1];
        arrayTwo = res[2];
        arrayThree = res[3];
        arrayFour = res[4];
        arrayFive = res[5];
        arraySix = res[6];
        arraySeven = res[7];
        this.array = [
          ...arrayZero,
          ...arrayOne,
          ...arrayTwo,
          ...arrayThree,
          ...arrayFour,
          ...arrayFive,
          ...arraySix,
          ...arraySeven,
        ];
        this.array.sort(
          (x, y) => +new Date(y.history_date) - +new Date(x.history_date)
        );
      },
      (err) => {
        console.log("error", err);
      }
    );
  }

  searchFunction() {
    let datafield = "history_type=" + this.dataSearchForm.value.Action;

    if (datafield === 'history_type=++' ){
      this.faqCategoriesService.searchHistory6("history_type=%2B%2B").subscribe(
        (res)=> {
          this.array = res
          this.SearchDateRange()
        }
      )
    }

    else if (datafield === 'history_type=--' ){
      this.faqCategoriesService.searchHistory6(datafield).subscribe(
        (res)=> {
          this.array = res
          this.SearchDateRange()
        }
      )
    }

    else if (datafield === 'history_type=+'){

      this.subscription = forkJoin([
        this.faqCategoriesService.searchHistory("history_type=%2B"),
        this.faqCategoriesService.searchHistory2("history_type=%2B"),
        this.faqCategoriesService.searchHistory3("history_type=%2B"),
        // this.faqCategoriesService.searchHistory4("history_type=%2B"),
        this.faqCategoriesService.searchHistory5("history_type=%2B"),
      ]).subscribe(
        (res) => {
          let arrayZero = [];
          let arrayOne = [];
          let arrayTwo = [];
          let arrayThree = [];
          // let arrayFour = [];
          // let arrayFive = [];
  
          arrayZero = res[0];
          arrayOne = res[1];
          arrayTwo = res[2];
          arrayThree = res[3];
          // arrayFour = res[4];
          // arrayFive = res[5];
          this.array = [
            ...arrayZero,
            ...arrayOne,
            ...arrayTwo,
            ...arrayThree,
            // ...arrayFour,
            // ...arrayFive,
          ];

          this.SearchDateRange()
        },
        (err) => {
          console.log("error", err);
        }
      );
    }

    else if (datafield === 'history_type=-') {
      console.log("masuk loop delete")
      this.subscription = forkJoin([
        this.faqCategoriesService.searchHistory(datafield),
        this.faqCategoriesService.searchHistory2(datafield),
        this.faqCategoriesService.searchHistory3(datafield),
        // this.faqCategoriesService.searchHistory4(datafield),
        this.faqCategoriesService.searchHistory5(datafield),
        this.faqCategoriesService.searchHistory8(datafield),
      ]).subscribe(
        (res) => {
          let arrayZero = [];
          let arrayOne = [];
          let arrayTwo = [];
          let arrayThree = [];
          // let arrayFour = [];
          // let arrayFive = [];
          let arraySeven = [];

          arrayZero = res[0];
          arrayOne = res[1];
          arrayTwo = res[2];
          arrayThree = res[3];
          // arrayFour = res[4];
          // arrayFive = res[5];
          arraySeven = res[4]
          this.array = [
            ...arrayZero,
            ...arrayOne,
            ...arrayTwo,
            ...arrayThree,
            // ...arrayFour,
            // ...arrayFive,
            ...arraySeven,
          ];

          this.SearchDateRange()
        },
        (err) => {
          console.log("error", err);
        }
      );

      }
    
    else if (datafield === 'history_type=~'){
    
      this.subscription = forkJoin([
        this.faqCategoriesService.searchHistory(datafield),
        this.faqCategoriesService.searchHistory2(datafield),
        this.faqCategoriesService.searchHistory3(datafield),
        this.faqCategoriesService.searchHistory4(datafield),
        this.faqCategoriesService.searchHistory5(datafield),
      ]).subscribe(
        (res) => {
          let arrayZero = [];
          let arrayOne = [];
          let arrayTwo = [];
          let arrayThree = [];
          let arrayFour = [];
          // let arrayFive = [];

          arrayZero = res[0];
          arrayOne = res[1];
          arrayTwo = res[2];
          arrayThree = res[3];
          arrayFour = res[4];
          // arrayFive = res[5];
          this.array = [
            ...arrayZero,
            ...arrayOne,
            ...arrayTwo,
            ...arrayThree,
            ...arrayFour,
            // ...arrayFive,
          ];

          this.SearchDateRange()
        },
        (err) => {
          console.log("error", err);
        }
      );

      }
    
    else {
      this.history()
    }
  }

  SearchDateRange() {
    console.log("dateRange", this.selectedDate)
    if (this.selectedDate != null){
      this.dateFrom = this.selectedDate[0];
      this.dateTo = this.selectedDate[1];
      let temp = this.array;

          for (let i in temp) {
            if (temp[i].history_date) {
              if (
                formatDate(temp[i].history_date, "yyyy-MM-dd", "en_US") >=
                  formatDate(this.dateFrom, "yyyy-MM-dd", "en_US") &&
                formatDate(temp[i].history_date, "yyyy-MM-dd", "en_US") <=
                  formatDate(this.dateTo, "yyyy-MM-dd", "en_US")
              ) {
                console.log(temp[i])
                this.temp2.push(temp[i]);
              }
            }
          }
          this.array = this.temp2;
          this.array.sort(
            (x, y) => +new Date(y.history_date) - +new Date(x.history_date)
          );
    }
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  entriesChange($event) {
    this.tableEntries = +$event.target.value;
  }

  // widgetDataGet() {
  //   this.subscription = forkJoin([
  //     this.visitorCounterService.get(),
  //     this.productCertificationService.get_TAC(),
  //     this.productGenerationService.get_IMEI(),
  //     this.productGenerationService.get_serial()
  //   ]).subscribe(
  //     (res)=>{
  //       this.VisitorGetTable = res[0]
  //       this.TACData = res[1]['TAC_count']
  //       this.IMEIData = res[2]['IMEI_count']
  //       this.serialData = res[3]['serial_count']
  //     }
  //   );
  // }

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
}
