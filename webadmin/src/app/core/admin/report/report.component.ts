import { productCertification } from './../../../shared/services/productCertification/productCertification.model';
import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  TemplateRef,
} from "@angular/core";
import { User } from "src/assets/mock/admin-user/users.model";
import { MocksService } from "src/app/shared/services/mocks/mocks.service";
import { MasterDataService } from "src/app/shared/services/masterData/masterData.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { UsersService } from "src/app/shared/services/users/users.service";
import * as XLSX from "xlsx";
import { SearchCounterService } from "src/app/shared/services/SearchCounter/SearchCounter.service";
import { SLPService } from "src/app/shared/services/SLP/SLP.service";
import { ProductGenerationService } from "src/app/shared/services/ProductRegistration/ProductGeneration.service";
import { productCertificationService } from "src/app/shared/services/productCertification/productCertification.service";
import { VisitorCounterService } from "src/app/shared/services/VisitorCounter/VisitorCounter.service";
import { forkJoin, Subscription } from "rxjs";
am4core.useTheme(am4themes_animated);
am4core.addLicense('ch-custom-attribution');

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class ReportComponent implements OnInit, OnDestroy {
  // Chart
  chart: any
  chart1: any
  chart2: any
  chart3: any
  chart4: any
  dataChart: any[] = []
  dataChart2: any[] = []
  dataChart3: any[] = []
  chartData: any[] = []
  chartData2: any[] = []
  chartdata3: any[] = []
  chartdataMaster: any[] = []
  chartdataMaster2: any[] = []
  user: any
  counter: any
  visitorby2021: any
  visitorby2022: any
  searchby2021:any
  searchby2022: any
  searchbymonth: any

  imeiData: any
  serialData: any
  tacData: any
  radioDatay2015: any
  radioDatay2016: any
  radioDatay2017: any
  radioDatay2018: any
  radioDatay2019: any
  radioDatay2020: any
  radioDatay2021: any
  telephonyDatay2015: any
  telephonyDatay2016: any
  telephonyDatay2017: any
  telephonyDatay2018: any
  telephonyDatay2019: any
  telephonyDatay2020: any
  telephonyDatay2021: any
  hybridDatay2015: any
  hybridDatay2016: any
  hybridDatay2017: any
  hybridDatay2018: any
  hybridDatay2019: any
  hybridDatay2020: any
  hybridDatay2021: any
  dataTotal: any

  tableEntries: number = 5
  tableSelected: any[] = []
  tableTemp = []
  tableActiveRow: any
  SelectionType = SelectionType
  infoTable = []
  CounterTable = []
  SLPTable = []
  TACData : number
  IMEIData : number
  SERIALData : number
  TOTALData: number
  getDataDB = []
  IMEITable = []
  SerialTable = []
  CertTable = []
  filterIMEI = []
  filterSERIAL = []
  filterPRODUCT = []
  filterLABEL = []
  VisitorGetTable = []
  certByDate = []
  TACcount = []
  IMEIcount : any
  SERIALcount : any
  thisMonthSearch: number
  totalSearch: any
  currentProduct: number
  userdata=[]
  searchMonthly
  searchMonth
  dataSearchForm: FormGroup
  percent: any 

  new
  exist

  event = 'new'

  subscription: Subscription;

  state: boolean = false
  isSummaryTableHidden: boolean = true
  fileName = "MasterTable.xlsx"

  // Datepicker
  bsDPConfig = {
    isAnimated: true,
    containerClass: "theme-default",
  };

  constructor(
    private mockService: MocksService,
    private zone: NgZone,
    private masterDataService: MasterDataService,
    private usersService: UsersService,
    private SearchCounterService: SearchCounterService,
    private SLPService: SLPService,
    private ProductGenerationService: ProductGenerationService,
    private productCertificationService: productCertificationService,
    private VisitorCounterService: VisitorCounterService
  ) {}

  ngOnInit() {
    this.productGeneration();
    this.widgetDataGet();
    this.calculateCharts();
    this.getData()
    setTimeout(() => {
      this.chartData = [
        {
          year: "Jan",
          search: this.searchby2021['january'],
        },
        {
          year: "Feb",
          search: this.searchby2021['february'],
        },
        {
          year: "Mar",
          search: this.searchby2021['march'],
        },
        {
          year: "Apr",
          search: this.searchby2021['april'],
        },
        {
          year: "May",
          search: this.searchby2021['may'],
        },
        {
          year: "Jun",
          search: this.searchby2021['june'],
        },
        {
          year: "Jul",
          search: this.searchby2021['july'],
        },
        {
          year: "Aug",
          search: this.searchby2021['august'],
        },
        {
          year: "Sept",
          search: this.searchby2021['september'],
        },
        {
          year: "Oct",
          search: this.searchby2021['october'],
        },
        {
          year: "Nov",
          search: this.searchby2021['november'],
        },
        {
          year: "Dec",
          search: this.searchby2021['december']
        }
      ]
      this.chartData2 = [
        {
          year: "Jan",
          visitor: this.visitorby2022['january'],  
        },
        {
          year: "Feb",
          visitor:this.visitorby2022['february'],
        },
        {
          year: "Mar",
          visitor: this.visitorby2022['march'],
        },
        {
          year: "Apr",
          visitor:this.visitorby2022['april'],
        },
        {
          year: "May",
          visitor: this.visitorby2022['may'],
        },
        {
          year: "Jun",
          visitor: this.visitorby2022['june'],
        },
        {
          year: "Jul",
          visitor:this.visitorby2022['july'],
        },
        {
          year: "Aug",
          visitor:this.visitorby2022['august'],
        },
        {
          year: "Sept",
          visitor:this.visitorby2022['september'],
        },
        {
          year: "Oct",
          visitor: this.visitorby2022['october'],
        },
        {
          year: "Nov",
          visitor:this.visitorby2022['november']
        },
        {
          year: "Dec",
          visitor:this.visitorby2022['december']
        }
      ]
      this.chartdata3 = [
        {
          item: "Product Info",
          value: this.searchMonthly['product'],
        },
        {
          item: "IMEI",
          value: this.searchMonthly['imei'],
        },
        {
          item: "Serial",
          value: this.searchMonthly['serial'],
        },
        {
          item: "SLP ID",
          value: this.searchMonthly['label'],
        }
      ]
      this.getCharts()
      this.calculate()
    }, 5000);
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
      if (this.chart1) {
        this.chart1.dispose();
      }
      if (this.chart2) {
        this.chart2.dispose();
      }
      if (this.chart3) {
        this.chart3.dispose();
      }
      if (this.chart4) {
        this.chart4.dispose();
      }
    });
  }

  getData() {
    this.VisitorCounterService.getVisitorChartNew().subscribe(
      (res) => {
        console.log('visitor data', res)
        this.counter = res
        this.visitorby2021 = this.counter.visitor_chart.y2021
        this.visitorby2022 = this.counter.visitor_chart.y2022
        console.log('visitor data', this.visitorby2021)
      },
      () => {},
      () => {
        

      })

    this.SearchCounterService.getSearchChartNew().subscribe(
      (res) => {
        this.counter = res
        this.searchby2021 = this.counter.search_chart.y2021
        this.searchby2021 = this.counter.search_chart.y2022
        // this.getCharts()
      },
      (err) => {},
      () => {
        
      })


      // get chart israa
      this.ProductGenerationService.getImeiSerialChart().subscribe(
        (res) => {
          console.log("checking lu ", res);
          this.imeiData = res.imei_chart.imei_by_month
          this.serialData = res.serialno_chart.serial_by_month
        },
        (err) => {
          console.log(err)
        }
        
      )
      this.productCertificationService.getTelephonyRadioChart().subscribe(
        (res) =>{
          console.log("Telephony n radio", res)
          this.radioDatay2015 = res.radio_chart.y2015
          this.radioDatay2016 = res.radio_chart.y2016
          this.radioDatay2017 = res.radio_chart.y2017
          this.radioDatay2018 = res.radio_chart.y2018
          this.radioDatay2019 = res.radio_chart.y2019
          this.radioDatay2020 = res.radio_chart.y2020
          this.radioDatay2021 = res.radio_chart.y2021
          this.telephonyDatay2015 = res.telephony_chart.y2015
          this.telephonyDatay2016 = res.telephony_chart.y2016
          this.telephonyDatay2017 = res.telephony_chart.y2017
          this.telephonyDatay2018 = res.telephony_chart.y2018
          this.telephonyDatay2019 = res.telephony_chart.y2019
          this.telephonyDatay2020 = res.telephony_chart.y2020
          this.telephonyDatay2021 = res.telephony_chart.y2021
          this.hybridDatay2016 = res.hybrid_chart.y2016
          this.hybridDatay2017 = res.hybrid_chart.y2017
          this.hybridDatay2018 = res.hybrid_chart.y2018
          this.hybridDatay2019 = res.hybrid_chart.y2019
          this.hybridDatay2020 = res.hybrid_chart.y2020
          this.hybridDatay2021 = res.hybrid_chart.y2021
          this.hybridDatay2015 = res.hybrid_chart.y2015
          
        }
      )

      this.productCertificationService.getTelephonyRadioTotalChart().subscribe(
        (res) =>{
          console.log("Telephony n radio Total", res)
          let datatotal = [{
            'year':'2015',
            'Radio': res.Radio['2015'],
            'Telephony': res.Telephony['2015'],
            'Hybrid': res.Hybrid['2015']
          },
          {
            'year':'2016',
            'Radio': res.Radio['2016'],
            'Telephony': res.Telephony['2016'],
            'Hybrid': res.Hybrid['2016']
          },
          {
            'year':'2017',
            'Radio': res.Radio['2017'],
            'Telephony': res.Telephony['2017'],
            'Hybrid': res.Hybrid['2017']
          },
          {
            'year':'2018',
            'Radio': res.Radio['2018'],
            'Telephony': res.Telephony['2018'],
            'Hybrid': res.Hybrid['2018']
          },
          {
            'year':'2019',
            'Radio': res.Radio['2019'],
            'Telephony': res.Telephony['2019'],
            'Hybrid': res.Hybrid['2019']
          },{
            'year':'2020',
            'Radio': res.Radio['2020'],
            'Telephony': res.Telephony['2020'],
            'Hybrid': res.Hybrid['2020']
          },{
            'year':'2021',
            'Radio': res.Radio['2021'],
            'Telephony': res.Telephony['2021'],
            'Hybrid': res.Hybrid['2021']
          }]
          console.log(datatotal)
          this.dataTotal = datatotal
          
        }
      )
  }

  productGeneration() {
    this.masterDataService.get().subscribe(
      (res) => {
        this.infoTable = [...res];
        console.log("zzzzz = ", this.infoTable);

        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key,
          };
        });
        console.log("xxxxxx = ", this.infoTable);
      },
      (err) => {
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
      () => {
        console.log("HTTP request completed.");
        //   this.infoTable = [res]
        //   console.log("zzzzz = ",this.infoTable)
      }
    );
  }

  getCharts() {
    this.zone.runOutsideAngular(() => {
      this.getChart()
      this.getChart2()
      this.getChart3()
    });
  }

  getChart() {
    let chart = am4core.create("visitorChart", am4charts.XYChart);

    chart.data=this.chartData2

    chart.exporting.menu = new am4core.ExportMenu();

    chart.exporting.menu.items = [{
          "label": "...",
          "menu": [
            {
              "label": "Image",
              "menu": [
                { "type": "png", "label": "PNG" },
                { "type": "jpg", "label": "JPG" },
                { "type": "svg", "label": "SVG" },
                { "type": "pdf", "label": "PDF" }
              ]
            }, {
              "label": "Data",
              "menu": [
                { "type": "xlsx", "label": "XLSX" },
                { "type": "pdf", "label": "PDF" }
              ]
            }, {
              "label": "Print", "type": "print"
            }
          ]
    }];

    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.opposite = false;

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inversed = false;
    // valueAxis.title.text = "Place taken";
    valueAxis.renderer.minLabelPosition = 0.01;

    // Create series
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "visitor";
    series1.dataFields.categoryX = "year";
    series1.name = "Total Visitor";
    series1.bullets.push(new am4charts.CircleBullet());
    series1.tooltipText = "{name}: {valueY}";
    series1.legendSettings.valueText = "{valueY}";
    series1.strokeWidth = 3; // 3px
    series1.visible = false;

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "unique";
    series2.dataFields.categoryX = "year";
    series2.name = "Unique Visitor";
    series2.bullets.push(new am4charts.CircleBullet());
    series2.tooltipText = "{name}: {valueY}";
    series2.legendSettings.valueText = "{valueY}";

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomY";

    let hs1 = series1.segments.template.states.create("hover");
    hs1.properties.strokeWidth = 5;
    series1.segments.template.strokeWidth = 1;

    let hs2 = series2.segments.template.states.create("hover");
    hs2.properties.strokeWidth = 5;
    series2.segments.template.strokeWidth = 1;

    this.chart = chart;
  }

  getChart2() {
    let chart = am4core.create("systemChart", am4charts.XYChart);

    chart.data = this.chartData

    chart.exporting.menu = new am4core.ExportMenu();

    chart.exporting.menu.items = [{
          "label": "...",
          "menu": [
            {
              "label": "Image",
              "menu": [
                { "type": "png", "label": "PNG" },
                { "type": "jpg", "label": "JPG" },
                { "type": "svg", "label": "SVG" },
                { "type": "pdf", "label": "PDF" }
              ]
            }, {
              "label": "Data",
              "menu": [
                { "type": "xlsx", "label": "XLSX" },
                { "type": "pdf", "label": "PDF" }
              ]
            }, {
              "label": "Print", "type": "print"
            }
          ]
    }];

    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.opposite = false;
    categoryAxis.renderer.minGridDistance = 30;

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inversed = false;
    // valueAxis.title.text = "Place taken";
    valueAxis.renderer.minLabelPosition = 0.01;

    // Create series
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "visitor";
    series1.dataFields.categoryX = "year";
    series1.name = "Total Visitor";
    series1.bullets.push(new am4charts.CircleBullet());
    series1.tooltipText = "{name}: {valueY}";
    series1.legendSettings.valueText = "{valueY}";
    series1.visible = false;

    let series3 = chart.series.push(new am4charts.ColumnSeries());
    series3.dataFields.valueY = "search";
    series3.dataFields.categoryX = "year";
    series3.name = "Total Search";
    series3.tooltipText = "{name}: {valueY}";
    series3.legendSettings.valueText = "{valueY}";

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomY";

    let hs1 = series1.segments.template.states.create("hover");
    hs1.properties.strokeWidth = 5;
    series1.segments.template.strokeWidth = 1;

    this.chart2 = chart;
  }

  calculateCharts() {
    this.subscription = forkJoin([
      this.SearchCounterService.getSearchMonthly(),
      this.SearchCounterService.getSearchMonth()
    ]).subscribe(
      (res) => {
        this.searchMonthly = res[0]
        console.log('searchMonthly', this.searchMonthly)
        this.searchMonth = res[1]
      })

  }

  getChart3() {
    let chart = am4core.create("totalSearch", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.exporting.menu = new am4core.ExportMenu();

    chart.exporting.menu.items = [{
          "label": "...",
          "menu": [
            {
              "label": "Image",
              "menu": [
                { "type": "png", "label": "PNG" },
                { "type": "jpg", "label": "JPG" },
                { "type": "svg", "label": "SVG" },
                { "type": "pdf", "label": "PDF" }
              ]
            }, {
              "label": "Data",
              "menu": [
                { "type": "xlsx", "label": "XLSX" },
                { "type": "pdf", "label": "PDF" }
              ]
            }, {
              "label": "Print", "type": "print"
            }
          ]
    }];

    chart.data = this.chartdata3

    console.log("chart.data", chart.data);
    chart.radius = am4core.percent(70);
    chart.innerRadius = am4core.percent(40);
    chart.startAngle = 0;
    chart.endAngle = 360;

    let series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "item";
    series.ticks.template.disabled = true;
    series.labels.template.disabled = true;

    series.slices.template.cornerRadius = 10;
    series.slices.template.innerCornerRadius = 7;
    series.slices.template.draggable = true;
    series.slices.template.inert = true;
    series.alignLabels = false;

    series.hiddenState.properties.startAngle = 0;
    series.hiddenState.properties.endAngle = 360;

    this.chart3 = chart;
  }

  MasterChart1() {
    let chart = am4core.create("MasterGraphChart", am4charts.XYChart);

    // Add data
    chart.data = this.chartdataMaster

    chart.exporting.menu = new am4core.ExportMenu();
    chart.scrollbarX = new am4core.Scrollbar();

    chart.exporting.menu.items = [{
          "label": "...",
          "menu": [
            {
              "label": "Image",
              "menu": [
                { "type": "png", "label": "PNG" },
                { "type": "jpg", "label": "JPG" },
                { "type": "svg", "label": "SVG" },
                { "type": "pdf", "label": "PDF" }
              ]
            }, {
              "label": "Data",
              "menu": [
                { "type": "xlsx", "label": "XLSX" },
                { "type": "pdf", "label": "PDF" }
              ]
            }, {
              "label": "Print", "type": "print"
            }
          ]
    }];

    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.opposite = false;
    categoryAxis.renderer.minGridDistance = 40;

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inversed = false;
    valueAxis.renderer.minLabelPosition = 0.01;

    // Create series
    // let series1 = chart.series.push(new am4charts.LineSeries());
    // series1.dataFields.valueY = "TAC";
    // series1.dataFields.categoryX = "year";
    // series1.name = "TAC";
    // series1.bullets.push(new am4charts.CircleBullet());
    // series1.tooltipText = "{name}: {valueY}";
    // series1.legendSettings.valueText = "{valueY}";
    // series1.visible = false;
    // series1.fill = am4core.color("yellow");
    // series1.strokeWidth = 3;

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = "IMEI";
    series2.dataFields.categoryX = "year";
    series2.name = "IMEI";
    series2.tooltipText = "{name}: {valueY}";
    series2.legendSettings.valueText = "{valueY}";
    series2.fill = am4core.color("#ff5733")

    let series3 = chart.series.push(new am4charts.ColumnSeries());
    series3.dataFields.valueY = "Serial";
    series3.dataFields.categoryX = "year";
    series3.name = "Serial";
    series3.tooltipText = "{name}: {valueY}";
    series3.legendSettings.valueText = "{valueY}";
    series3.fill = am4core.color("#355C7D")

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomY";

    // let hs1 = series1.segments.template.states.create("hover");
    // hs1.properties.strokeWidth = 5;
    // series1.segments.template.strokeWidth = 1;

    chart.legend = new am4charts.Legend()
    chart.legend.position = 'top'
    chart.legend.paddingBottom = 20
    chart.legend.labels.template.maxWidth = 95


    this.chart4 = chart;
  }

  MasterChart2() {
    let chart = am4core.create("MasterGraphChart2", am4charts.XYChart);

    // Add data
    chart.data = this.chartdataMaster2

    chart.exporting.menu = new am4core.ExportMenu();

    chart.exporting.menu.items = [{
          "label": "...",
          "menu": [
            {
              "label": "Image",
              "menu": [
                { "type": "png", "label": "PNG" },
                { "type": "jpg", "label": "JPG" },
                { "type": "svg", "label": "SVG" },
                { "type": "pdf", "label": "PDF" }
              ]
            }, {
              "label": "Data",
              "menu": [
                { "type": "xlsx", "label": "XLSX" },
                { "type": "pdf", "label": "PDF" }
              ]
            }, {
              "label": "Print", "type": "print"
            }
          ]
    }];

    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.opposite = false;
    categoryAxis.renderer.minGridDistance = 40;
    chart.scrollbarX = new am4core.Scrollbar();

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inversed = false;
    valueAxis.renderer.minLabelPosition = 0.01;

    // Create series
    let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.dataFields.valueY = "Hybrid";
    series1.dataFields.categoryX = "year";
    series1.name = "Hybrid";
    series1.tooltipText = "{name}: {valueY}";
    series1.legendSettings.valueText = "{valueY}";
    series1.fill = am4core.color("yellow");

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = "Telephony";
    series2.dataFields.categoryX = "year";
    series2.name = "Telephony";
    series2.tooltipText = "{name}: {valueY}";
    series2.legendSettings.valueText = "{valueY}";
    series2.fill = am4core.color("#ff5733")

    let series3 = chart.series.push(new am4charts.ColumnSeries());
    series3.dataFields.valueY = "Radio";
    series3.dataFields.categoryX = "year";
    series3.name = "Radio";
    series3.dataFields.valueY = "Radio";
    series3.tooltipText = "{name}: {valueY}";
    series3.legendSettings.valueText = "{valueY}";
    series3.fill = am4core.color("#355C7D")

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomY";

    chart.legend = new am4charts.Legend()
    chart.legend.position = 'top'
    chart.legend.paddingBottom = 20
    chart.legend.labels.template.maxWidth = 95

    // let hs1 = series1.segments.template.states.create("hover");
    // hs1.properties.strokeWidth = 5;
    // series1.segments.template.strokeWidth = 1;


    this.chart4 = chart;
  }

  // MasterChart2() {
  //   let chart = am4core.create("MasterGraphChart2", am4charts.XYChart);
  //   chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

  //   chart.data = this.certByDate

  //   console.log('data chart bar', chart.data)

  //   chart.dateFormatter.inputDateFormat = "yyyy-MM-dd"

  //   chart.colors.step = 2;
  //   chart.padding(30, 30, 10, 30);
  //   chart.legend = new am4charts.Legend();

  //   let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  //   dateAxis.dataFields.date = "date";
  //   dateAxis.renderer.grid.template.location = 0;

  //   let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  //   valueAxis.min = 0;
  //   valueAxis.max = 100;
  //   valueAxis.strictMinMax = true;
  //   valueAxis.calculateTotals = true;
  //   valueAxis.renderer.minWidth = 100;


  //   let series1 = chart.series.push(new am4charts.ColumnSeries());
  //   series1.columns.template.width = am4core.percent(80);
  //   series1.columns.template.tooltipText =
  //     "{name}: {valueY}";
  //   series1.name = "Telephony";
  //   series1.dataFields.dateX = "date";
  //   series1.dataFields.valueY = "telephony_c";
  //   series1.dataFields.valueYShow = "totalPercent";
  //   series1.dataItems.template.locations.categoryX = 0.5;
  //   series1.stacked = true;
  //   series1.tooltip.pointerOrientation = "vertical";

  //   let bullet1 = series1.bullets.push(new am4charts.LabelBullet());
  //   bullet1.interactionsEnabled = false;
  //   bullet1.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
  //   bullet1.label.fill = am4core.color("#ffffff");
  //   bullet1.locationY = 0.5;

  //   let series2 = chart.series.push(new am4charts.ColumnSeries());
  //   series2.columns.template.width = am4core.percent(80);
  //   series2.columns.template.tooltipText =
  //     "{name}: {valueY}";
  //   series2.name = "Radio";
  //   series2.dataFields.dateX = "date";
  //   series2.dataFields.valueY = "radio_c";
  //   series2.dataFields.valueYShow = "totalPercent";
  //   series2.dataItems.template.locations.categoryX = 0.5;
  //   series2.stacked = true;
  //   series2.tooltip.pointerOrientation = "vertical";

  //   let bullet2 = series2.bullets.push(new am4charts.LabelBullet());
  //   bullet2.interactionsEnabled = false;
  //   bullet2.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
  //   bullet2.locationY = 0.5;
  //   bullet2.label.fill = am4core.color("#ffffff");

  //   let series3 = chart.series.push(new am4charts.ColumnSeries());
  //   series3.columns.template.width = am4core.percent(80);
  //   series3.columns.template.tooltipText =
  //     "{name}: {valueY}";
  //   series3.name = "Hybrid";
  //   series3.dataFields.dateX = "date";
  //   series3.dataFields.valueY = "hybrid_c";
  //   series3.dataFields.valueYShow = "totalPercent";
  //   series3.dataItems.template.locations.categoryX = 0.5;
  //   series3.stacked = true;
  //   series3.tooltip.pointerOrientation = "vertical";

  //   let bullet3 = series3.bullets.push(new am4charts.LabelBullet());
  //   bullet3.interactionsEnabled = false;
  //   bullet3.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
  //   bullet3.locationY = 0.5;
  //   bullet3.label.fill = am4core.color("#ffffff");

  //   chart.scrollbarX = new am4core.Scrollbar();
  //   chart.cursor = new am4charts.XYCursor();
  // }

  // MasterChart2() {
  //   let chart = am4core.create("MasterGraphChart2", am4charts.XYChart);

  //   // Add data
  //   chart.data = this.certByDate

  //   chart.exporting.menu = new am4core.ExportMenu();

  //   chart.exporting.menu.items = [{
  //         "label": "...",
  //         "menu": [
  //           {
  //             "label": "Image",
  //             "menu": [
  //               { "type": "png", "label": "PNG" },
  //               { "type": "jpg", "label": "JPG" },
  //               { "type": "svg", "label": "SVG" },
  //               { "type": "pdf", "label": "PDF" }
  //             ]
  //           }, {
  //             "label": "Data",
  //             "menu": [
  //               { "type": "xlsx", "label": "XLSX" },
  //               { "type": "pdf", "label": "PDF" }
  //             ]
  //           }, {
  //             "label": "Print", "type": "print"
  //           }
  //         ]
  //   }];

  //   console.log("getChart2",  this.certByDate)
  //   // Set input format for the dates
  //   chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

  //   // Create axes
  //   let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  //   let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  //   // Create series
  //   let series = chart.series.push(new am4charts.LineSeries());
  //   series.dataFields.valueY = "radio_c";
  //   series.dataFields.dateX = "date";
  //   series.tooltipText = "Radio: {radio_c}";
  //   series.strokeWidth = 2;
  //   series.minBulletDistance = 15;

  //   let series2 = chart.series.push(new am4charts.LineSeries());
  //   series2.dataFields.valueY = "telephony_c";
  //   series2.dataFields.dateX = "date";
  //   series2.tooltipText = "Telephony: {telephony_c}";
  //   series2.strokeWidth = 2;
  //   series2.minBulletDistance = 15;
  //   series2.fill = am4core.color("yellow");

  //   let series3 = chart.series.push(new am4charts.LineSeries());
  //   series3.dataFields.valueY = "hybrid_c";
  //   series3.dataFields.dateX = "date";
  //   series3.tooltipText = "Hybrid: {hybrid_c}";
  //   series3.strokeWidth = 2;
  //   series3.minBulletDistance = 15;
  //   series3.fill = am4core.color("red");

  //   // Drop-shaped tooltips
  //   series.tooltip.background.cornerRadius = 20;
  //   series.tooltip.background.strokeOpacity = 0;
  //   series.tooltip.pointerOrientation = "vertical";
  //   series.tooltip.label.minWidth = 40;
  //   series.tooltip.label.minHeight = 40;
  //   series.tooltip.label.textAlign = "middle";
  //   series.tooltip.label.textValign = "middle";

  //   series2.tooltip.background.cornerRadius = 20;
  //   series2.tooltip.background.strokeOpacity = 0;
  //   series2.tooltip.pointerOrientation = "vertical";
  //   series2.tooltip.label.minWidth = 40;
  //   series2.tooltip.label.minHeight = 40;
  //   series2.tooltip.label.textAlign = "middle";
  //   series2.tooltip.label.textValign = "middle";

  //   // Make bullets grow on hover
  //   let bullet = series.bullets.push(new am4charts.CircleBullet());
  //   bullet.circle.strokeWidth = 2;
  //   bullet.circle.radius = 4;
  //   bullet.circle.fill = am4core.color("#fff");

  //   let bullet2 = series2.bullets.push(new am4charts.CircleBullet());
  //   bullet2.circle.strokeWidth = 2;
  //   bullet2.circle.radius = 4;
  //   bullet2.circle.fill = am4core.color("#fff");

  //   let bullethover = bullet.states.create("hover");
  //   bullethover.properties.scale = 1.3;

  //   let bullethover2 = bullet2.states.create("hover");
  //   bullethover2.properties.scale = 1.3;

  //   // Make a panning cursor
  //   chart.cursor = new am4charts.XYCursor();
  //   chart.cursor.behavior = "panXY";
  //   chart.cursor.xAxis = dateAxis;
  //   chart.cursor.snapToSeries = series;

  //   chart.cursor = new am4charts.XYCursor();
  //   chart.cursor.behavior = "zoomY";

  //   // Create vertical scrollbar and place it before the value axis
  //   // chart.scrollbarY = new am4core.Scrollbar();
  //   // chart.scrollbarY.parent = chart.leftAxesContainer;
  //   // chart.scrollbarY.toBack();

  //   // Create a horizontal scrollbar with previe and place it underneath the date axis
  //   // chart.scrollbarX = new am4charts.XYChartScrollbar();
  //   // let scrollbarX = new am4charts.XYChartScrollbar();
  //   // scrollbarX.series.push(series);
  //   // chart.scrollbarX = scrollbarX;
  //   // chart.scrollbarX.parent = chart.bottomAxesContainer;

  //   // dateAxis.start = 0.79;
  //   // dateAxis.keepSelection = true;

  //   this.chart4 = chart;
  // }

  isAllowed = (optional) => {
    return optional === 0 ? true : this.state;
  };

  changeState = () => {
    this.state = !this.state;
    this.chartdataMaster = [
      {
        year: "Jan",
        IMEI: 1048576,
        Serial: 1048578,
      },
      {
        year: "Feb",
        IMEI: 1048579,
        Serial: 170450,
      },
      {
        year: "Mar",
        IMEI: 909617,
        Serial: 709651,
      },
      {
        year: "Apr",
        IMEI: 1048576,
        Serial: 1048576,
      },
      {
        year: "May",
        IMEI: 681583,
        Serial: 851451,
      },
      {
        year: "Jun",
        IMEI: 1048576,
        Serial: 753194,
      },
      {
        year: "Jul",
        IMEI: 1058576,
        Serial: 957519,
      },
      {
        year: "Aug",
        IMEI: 1048576,
        Serial: 0,
      },
      {
        year: "Sept",
        IMEI: 1048576,
        Serial: 0,
      },
      {
        year: "Oct",
        IMEI: 649996,
        Serial: 0,
      },
      {
        year: "Nov",
        IMEI: 238770,
        Serial: 0,
      },
      {
        year: "Dec",
        IMEI: 995056,
        Serial: 0,
      }
    ];
    this.chartdataMaster2 = [
      {
        year: "Jan",
        Radio: this.radioDatay2015['january'],
        Telephony: this.telephonyDatay2015['january'],
        Hybrid: this.hybridDatay2015['january']
      },
      {
        year: "Feb",
        Radio: this.radioDatay2015['february'],
        Telephony: this.telephonyDatay2015['february'],
        Hybrid: this.hybridDatay2015['february']
      },
      {
        year: "Mar",
        Radio: this.radioDatay2015['march'],
        Telephony: this.telephonyDatay2015['march'],
        Hybrid: this.hybridDatay2015['march']
      },
      {
        year: "Apr",
        Radio: this.radioDatay2015['april'],
        Telephony: this.telephonyDatay2015['april'],
        Hybrid: this.hybridDatay2015['april']
      },
      {
        year: "May",
        Radio: this.radioDatay2015['may'],
        Telephony: this.telephonyDatay2015['may'],
        Hybrid: this.hybridDatay2015['may']
      },
      {
        year: "Jun",
        Radio: this.radioDatay2015['june'],
        Telephony: this.telephonyDatay2015['june'],
        Hybrid: this.hybridDatay2015['june']
      },
      {
        year: "Jul",
        Radio: this.radioDatay2015['july'],
        Telephony: this.telephonyDatay2015['july'],
        Hybrid: this.hybridDatay2015['july']
      },
      {
        year: "Aug",
        Radio: this.radioDatay2015['august'],
        Telephony: this.telephonyDatay2015['august'],
        Hybrid: this.hybridDatay2015['august']
      },
      {
        year: "Sept",
        Radio: this.radioDatay2015['september'],
        Telephony: this.telephonyDatay2015['september'],
        Hybrid: this.hybridDatay2015['september']
      },
      {
        year: "Oct",
        Radio: this.radioDatay2015['october'],
        Telephony: this.telephonyDatay2015['october'],
        Hybrid: this.hybridDatay2015['october']
      },
      {
        year: "Nov",
        Radio: this.radioDatay2015['november'],
        Telephony: this.telephonyDatay2015['november'],
        Hybrid: this.hybridDatay2015['november']
      },
      {
        year: "Dec",
        Radio: this.radioDatay2015['december'],
        Telephony: this.telephonyDatay2015['december'],
        Hybrid: this.hybridDatay2015['december']
      }
    ];
    setTimeout(() => {
      this.MasterChart1()
      this.MasterChart2()
    }, 3000);
  };

  toggleEmail(event){
    console.log(event)
    if(event ==='new'){
      this.chartData = [
        {
          year: "Jan",
          search: 0,
        },
        {
          year: "Feb",
          search: 0,
        },
        {
          year: "Mar",
          search: 0,
        },
        {
          year: "Apr",
          search: 0,
        },
        {
          year: "May",
          search: 0,
        },
        {
          year: "Jun",
          search: 0,
        },
        {
          year: "Jul",
          search: 0,
        },
        {
          year: "Aug",
          search: 0,
        },
        {
          year: "Sept",
          search: 0,
        },
        {
          year: "Oct",
          search: 0,
        },
        {
          year: "Nov",
          search: 0,
        },
        {
          year: "Dec",
          search: 0
        }
      ]
        this.getChart2()
    }
    else if (event ==='total'){
      this.chartData = [
        {
          year: "2020",
          search: 0
        },
        {
          year:"2021",
          search: this.totalSearch
        },
        {
          year:"2022",
          search: 0
        }
      ]
      this.getChart2()
    }
    else if (event === 'y2022'){
      this.chartData = [
        {
          year: "Jan",
          search: this.searchby2022['january'],
        },
        {
          year: "Feb",
          search: this.searchby2022['february'],
        },
        {
          year: "Mar",
          search: this.searchby2022['march'],
        },
        {
          year: "Apr",
          search: this.searchby2022['april'],
        },
        {
          year: "May",
          search: this.searchby2022['may'],
        },
        {
          year: "Jun",
          search: this.searchby2022['june'],
        },
        {
          year: "Jul",
          search: this.searchby2022['july'],
        },
        {
          year: "Aug",
          search: this.searchby2022['august'],
        },
        {
          year: "Sept",
          search: this.searchby2022['september'],
        },
        {
          year: "Oct",
          search: this.searchby2022['october'],
        },
        {
          year: "Nov",
          search: this.searchby2022['november'],
        },
        {
          year: "Dec",
          search: this.searchby2022['december']
        }
      ]
        this.getChart2()
    }
    else if (event==='y2021'){
      this.chartData = [
        {
          year: "Jan",
          search: this.searchby2021['january'],
        },
        {
          year: "Feb",
          search: this.searchby2021['february'],
        },
        {
          year: "Mar",
          search: this.searchby2021['march'],
        },
        {
          year: "Apr",
          search: this.searchby2021['april'],
        },
        {
          year: "May",
          search: this.searchby2021['may'],
        },
        {
          year: "Jun",
          search: this.searchby2021['june'],
        },
        {
          year: "Jul",
          search: this.searchby2021['july'],
        },
        {
          year: "Aug",
          search: this.searchby2021['august'],
        },
        {
          year: "Sept",
          search: this.searchby2021['september'],
        },
        {
          year: "Oct",
          search: this.searchby2021['october'],
        },
        {
          year: "Nov",
          search: this.searchby2021['november'],
        },
        {
          year: "Dec",
          search: this.searchby2021['december']
        }
      ]
        this.getChart2()
    }
  }

  toggleEmail2(event){
    console.log(event)
    if(event ==='total'){
      this.chartData2 = [{
        year: "2020",
        visitor: 25,
      }, {
        "year": "2021",
        visitor: this.VisitorGetTable.length,
      },
      {
        "year": "2022",
        visitor: 0,
      }
      ];
        this.getChart()
    }
    else if(event === 'new') {
      this.chartData2 = [
        {
          year: "Jan",
          visitor: 0,
        },
        {
          year: "Feb",
          visitor: 0,
        },
        {
          year: "Mar",
          visitor: 0,
        },
        {
          year: "Apr",
          visitor: 0,
        },
        {
          year: "May",
          visitor:0,
        },
        {
          year: "Jun",
          visitor: 0,
        },
        {
          year: "Jul",
          visitor: 0,
        },
        {
          year: "Aug",
          visitor: 0,
        },
        {
          year: "Sept",
          visitor:0,
        },
        {
          year: "Oct",
          visitor: 0,
        },
        {
          year: "Nov",
          visitor: 0
        },
        {
          year: "Dec",
          visitor: 0
        }
      ]
        this.getChart()
    }
    else if (event ==='y2022') {
      this.chartData2 = [
        {
          year: "Jan",
          visitor: this.visitorby2022['january'],  
        },
        {
          year: "Feb",
          visitor: this.visitorby2022['february'],
        },
        {
          year: "Mar",
          visitor: this.visitorby2022['march'],
        },
        {
          year: "Apr",
          visitor: this.visitorby2022['april'],
        },
        {
          year: "May",
          visitor: this.visitorby2022['may'],
        },
        {
          year: "Jun",
          visitor: this.visitorby2022['june'],
        },
        {
          year: "Jul",
          visitor: this.visitorby2022['july'],
        },
        {
          year: "Aug",
          visitor: this.visitorby2022['august'],
        },
        {
          year: "Sept",
          visitor: this.visitorby2022['september'],
        },
        {
          year: "Oct",
          visitor: this.visitorby2022['october'],
        },
        {
          year: "Nov",
          visitor: this.visitorby2022['november']
        },
        {
          year: "Dec",
          visitor: this.visitorby2022['december']
        }
      ]
        this.getChart()
    }
    else{
      this.chartData2 = [
        {
          year: "Jan",
          visitor: this.visitorby2021['january'],  
        },
        {
          year: "Feb",
          visitor: this.visitorby2021['february'],
        },
        {
          year: "Mar",
          visitor: this.visitorby2021['march'],
        },
        {
          year: "Apr",
          visitor: this.visitorby2021['april'],
        },
        {
          year: "May",
          visitor: this.visitorby2021['may'],
        },
        {
          year: "Jun",
          visitor: this.visitorby2021['june'],
        },
        {
          year: "Jul",
          visitor: this.visitorby2021['july'],
        },
        {
          year: "Aug",
          visitor: this.visitorby2021['august'],
        },
        {
          year: "Sept",
          visitor: this.visitorby2021['september'],
        },
        {
          year: "Oct",
          visitor: this.visitorby2021['october'],
        },
        {
          year: "Nov",
          visitor: this.visitorby2021['november']
        },
        {
          year: "Dec",
          visitor: this.visitorby2021['december']
        }
      ]
        this.getChart()
    }
  }

  toggleEmail3(event){
    console.log(event)
    if(event ==='new'){
      this.chartdata3 = [
        {
          item: "Product Info",
          value: this.searchMonth['product'],
        },
        {
          item: "IMEI",
          value: this.searchMonth['imei'],
        },
        {
          item: "Serial",
          value: this.searchMonth['serial'],
        },
        {
          item: "SLP ID",
          value: this.searchMonth['label'],
        }
      ]
      this.getChart3()
    }
    else {
      this.chartdata3 = [
        {
          item: "Product Info",
          value: this.searchMonthly['product'],
        },
        {
          item: "IMEI",
          value: this.searchMonthly['imei'],
        },
        {
          item: "Serial",
          value: this.searchMonthly['serial'],
        },
        {
          item: "SLP ID",
          value: this.searchMonthly['label'],
        }
      ]
      this.getChart3()
    }
    // else{
    //   this.chartdata3 = [
    //     {
    //       item: "Product Info",
    //       value: 2,
    //     },
    //     {
    //       item: "IMEI",
    //       value: 2,
    //     },
    //     {
    //       item: "Serial",
    //       value: 2,
    //     },
    //     {
    //       item: "SLP ID",
    //       value: 2,
    //     },
    //   ]
    //     this.getChart3()
    // }
  }

  toggleEmail4(event){
    if(event ==='new'){
      this.chartdataMaster = [
        {
          year: "Jan",
          IMEI: 0,
          Serial: 0,
        },
        {
          year: "Feb",
          IMEI: 0,
          Serial: 0,
        },
        {
          year: "Mar",
          IMEI: 0,
          Serial: 0,
        },
        {
          year: "Apr",
          IMEI: 0,
          Serial: 0,
        },
        {
          year: "May",
          IMEI: 0,
          Serial: 0,
        },
        {
          year: "Jun",
          IMEI: 0,
          Serial: 0,
        },
        {
          year: "Jul",
          IMEI: 0,
          Serial: 0,
        },
        {
          year: "Aug",
          IMEI: 0,
          Serial: 0,
        },
        {
          year: "Sept",
          IMEI: 0,
          Serial: 0,
        },
        {
          year: "Oct",
          IMEI: 0,
          Serial: 0,
        },
        {
          year: "Nov",
          IMEI: 0,
          Serial: 0,
        },
        {
          year: "Dec",
          IMEI: 0,
          Serial: 0,
        }
      ];
      this.chartdataMaster2 = [
        {
          year: "Jan",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Feb",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Mar",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Apr",
          Radio: 0,
          Telephony: 0,
        },
        {
          year: "May",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Jun",
          Radio: 0,
          Telephony: 0,
        },
        {
          year: "Jul",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Aug",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Sept",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Oct",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Nov",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Dec",
          Radio: 0,
          Telephony: 0
        }
      ];
      this.MasterChart1()
    }
    else if (event === 'total') {
      this.chartdataMaster = [
        {
          year: "2015",
          IMEI: this.IMEIData,
          Serial: this.SERIALData,
        },
        {
          year: "2016",
          IMEI: 0,
          Serial: 0,
        },
      ]
      this.MasterChart1()
    }
    else{
      this.chartdataMaster = [
        {
          year: "Jan",
          IMEI: 1048576,
          Serial: 1048578,
        },
        {
          year: "Feb",
          IMEI: 1048579,
          Serial: 170450,
        },
        {
          year: "Mar",
          IMEI: 909617,
          Serial: 709651,
        },
        {
          year: "Apr",
          IMEI: 1048576,
          Serial: 1048576,
        },
        {
          year: "May",
          IMEI: 681583,
          Serial: 851451,
        },
        {
          year: "Jun",
          IMEI: 1048576,
          Serial: 753194,
        },
        {
          year: "Jul",
          IMEI: 1058576,
          Serial: 957519,
        },
        {
          year: "Aug",
          IMEI: 1048576,
          Serial: 0,
        },
        {
          year: "Sept",
          IMEI: 1048576,
          Serial: 0,
        },
        {
          year: "Oct",
          IMEI: 649996,
          Serial: 0,
        },
        {
          year: "Nov",
          IMEI: 238770,
          Serial: 0,
        },
        {
          year: "Dec",
          IMEI: 995056,
          Serial: 0,
        }
      ];
      this.MasterChart1()

    }
  }
  toggleEmail5(event){
    if(event ==='new'){
      this.chartdataMaster2 = [
        {
          year: "Jan",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Feb",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Mar",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Apr",
          Radio: 0,
          Telephony: 0,
        },
        {
          year: "May",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Jun",
          Radio: 0,
          Telephony: 0,
        },
        {
          year: "Jul",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Aug",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Sept",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Oct",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Nov",
          Radio: 0,
          Telephony: 0
        },
        {
          year: "Dec",
          Radio: 0,
          Telephony: 0
        }
      ]
      this.MasterChart2()
    }
    else if (event === 'total') {
      this.chartdataMaster2 = this.dataTotal
      console.log('chartmaster2', this.chartdataMaster2)

      this.MasterChart2()
    }
    else if (event === 'y2015'){
      this.chartdataMaster2 = [
        {
          year: "Jan",
          Radio: this.radioDatay2015['january'],
          Telephony: this.telephonyDatay2015['january'],
          Hybrid: this.hybridDatay2015['january']
        },
        {
          year: "Feb",
          Radio: this.radioDatay2015['february'],
          Telephony: this.telephonyDatay2015['february'],
          Hybrid: this.hybridDatay2015['february']
        },
        {
          year: "Mar",
          Radio: this.radioDatay2015['march'],
          Telephony: this.telephonyDatay2015['march'],
          Hybrid: this.hybridDatay2015['march']
        },
        {
          year: "Apr",
          Radio: this.radioDatay2015['april'],
          Telephony: this.telephonyDatay2015['april'],
          Hybrid: this.hybridDatay2015['april']
        },
        {
          year: "May",
          Radio: this.radioDatay2015['may'],
          Telephony: this.telephonyDatay2015['may'],
          Hybrid: this.hybridDatay2015['may']
        },
        {
          year: "Jun",
          Radio: this.radioDatay2015['june'],
          Telephony: this.telephonyDatay2015['june'],
          Hybrid: this.hybridDatay2015['june']
        },
        {
          year: "Jul",
          Radio: this.radioDatay2015['july'],
          Telephony: this.telephonyDatay2015['july'],
          Hybrid: this.hybridDatay2015['july']
        },
        {
          year: "Aug",
          Radio: this.radioDatay2015['august'],
          Telephony: this.telephonyDatay2015['august'],
          Hybrid: this.hybridDatay2015['august']
        },
        {
          year: "Sept",
          Radio: this.radioDatay2015['september'],
          Telephony: this.telephonyDatay2015['september'],
          Hybrid: this.hybridDatay2015['september']
        },
        {
          year: "Oct",
          Radio: this.radioDatay2015['october'],
          Telephony: this.telephonyDatay2015['october'],
          Hybrid: this.hybridDatay2015['october']
        },
        {
          year: "Nov",
          Radio: this.radioDatay2015['november'],
          Telephony: this.telephonyDatay2015['november'],
          Hybrid: this.hybridDatay2015['november']
        },
        {
          year: "Dec",
          Radio: this.radioDatay2015['december'],
          Telephony: this.telephonyDatay2015['december'],
          Hybrid: this.hybridDatay2015['december']
        }
      ];

      this.MasterChart2()
    }
    else if (event ==='y2016') {
      this.chartdataMaster2 = [
        {
          year: "Jan",
          Radio: this.radioDatay2016['january'],
          Telephony: this.telephonyDatay2016['january'],
          Hybrid: this.hybridDatay2016['january']
        },
        {
          year: "Feb",
          Radio: this.radioDatay2016['february'],
          Telephony: this.telephonyDatay2016['february'],
          Hybrid: this.hybridDatay2016['february']
        },
        {
          year: "Mar",
          Radio: this.radioDatay2016['march'],
          Telephony: this.telephonyDatay2016['march'],
          Hybrid: this.hybridDatay2016['march']
        },
        {
          year: "Apr",
          Radio: this.radioDatay2016['april'],
          Telephony: this.telephonyDatay2016['april'],
          Hybrid: this.hybridDatay2016['april']
        },
        {
          year: "May",
          Radio: this.radioDatay2016['may'],
          Telephony: this.telephonyDatay2016['may'],
          Hybrid: this.hybridDatay2016['may']
        },
        {
          year: "Jun",
          Radio: this.radioDatay2016['june'],
          Telephony: this.telephonyDatay2016['june'],
          Hybrid: this.hybridDatay2016['june']
        },
        {
          year: "Jul",
          Radio: this.radioDatay2016['july'],
          Telephony: this.telephonyDatay2016['july'],
          Hybrid: this.hybridDatay2016['july']
        },
        {
          year: "Aug",
          Radio: this.radioDatay2016['august'],
          Telephony: this.telephonyDatay2016['august'],
          Hybrid: this.hybridDatay2016['august']
        },
        {
          year: "Sept",
          Radio: this.radioDatay2016['september'],
          Telephony: this.telephonyDatay2016['september'],
          Hybrid: this.hybridDatay2016['september']
        },
        {
          year: "Oct",
          Radio: this.radioDatay2016['october'],
          Telephony: this.telephonyDatay2016['october'],
          Hybrid: this.hybridDatay2016['october']
        },
        {
          year: "Nov",
          Radio: this.radioDatay2016['november'],
          Telephony: this.telephonyDatay2016['november'],
          Hybrid: this.hybridDatay2016['november']
        },
        {
          year: "Dec",
          Radio: this.radioDatay2016['december'],
          Telephony: this.telephonyDatay2016['december'],
          Hybrid: this.hybridDatay2016['december']
        }
      ];

      this.MasterChart2()
    }
    else if (event ==='y2017') {
      this.chartdataMaster2 = [
        {
          year: "Jan",
          Radio: this.radioDatay2017['january'],
          Telephony: this.telephonyDatay2017['january'],
          Hybrid: this.hybridDatay2017['january']
        },
        {
          year: "Feb",
          Radio: this.radioDatay2017['february'],
          Telephony: this.telephonyDatay2017['february'],
          Hybrid: this.hybridDatay2017['february']
        },
        {
          year: "Mar",
          Radio: this.radioDatay2017['march'],
          Telephony: this.telephonyDatay2017['march'],
          Hybrid: this.hybridDatay2017['march']
        },
        {
          year: "Apr",
          Radio: this.radioDatay2017['april'],
          Telephony: this.telephonyDatay2017['april'],
          Hybrid: this.hybridDatay2017['april']
        },
        {
          year: "May",
          Radio: this.radioDatay2017['may'],
          Telephony: this.telephonyDatay2017['may'],
          Hybrid: this.hybridDatay2017['may']
        },
        {
          year: "Jun",
          Radio: this.radioDatay2017['june'],
          Telephony: this.telephonyDatay2017['june'],
          Hybrid: this.hybridDatay2017['june']
        },
        {
          year: "Jul",
          Radio: this.radioDatay2017['july'],
          Telephony: this.telephonyDatay2017['july'],
          Hybrid: this.hybridDatay2017['july']
        },
        {
          year: "Aug",
          Radio: this.radioDatay2017['august'],
          Telephony: this.telephonyDatay2017['august'],
          Hybrid: this.hybridDatay2017['august']
        },
        {
          year: "Sept",
          Radio: this.radioDatay2017['september'],
          Telephony: this.telephonyDatay2017['september'],
          Hybrid: this.hybridDatay2017['september']
        },
        {
          year: "Oct",
          Radio: this.radioDatay2017['october'],
          Telephony: this.telephonyDatay2017['october'],
          Hybrid: this.hybridDatay2017['october']
        },
        {
          year: "Nov",
          Radio: this.radioDatay2017['november'],
          Telephony: this.telephonyDatay2017['november'],
          Hybrid: this.hybridDatay2017['november']
        },
        {
          year: "Dec",
          Radio: this.radioDatay2017['december'],
          Telephony: this.telephonyDatay2017['december'],
          Hybrid: this.hybridDatay2017['december']
        }
      ];

      this.MasterChart2()
    }
    else if (event ==='y2018') {
      this.chartdataMaster2 = [
        {
          year: "Jan",
          Radio: this.radioDatay2018['january'],
          Telephony: this.telephonyDatay2018['january'],
          Hybrid: this.hybridDatay2018['january']
        },
        {
          year: "Feb",
          Radio: this.radioDatay2018['february'],
          Telephony: this.telephonyDatay2018['february'],
          Hybrid: this.hybridDatay2018['february']
        },
        {
          year: "Mar",
          Radio: this.radioDatay2018['march'],
          Telephony: this.telephonyDatay2018['march'],
          Hybrid: this.hybridDatay2018['march']
        },
        {
          year: "Apr",
          Radio: this.radioDatay2018['april'],
          Telephony: this.telephonyDatay2018['april'],
          Hybrid: this.hybridDatay2018['april']
        },
        {
          year: "May",
          Radio: this.radioDatay2018['may'],
          Telephony: this.telephonyDatay2018['may'],
          Hybrid: this.hybridDatay2018['may']
        },
        {
          year: "Jun",
          Radio: this.radioDatay2018['june'],
          Telephony: this.telephonyDatay2018['june'],
          Hybrid: this.hybridDatay2018['june']
        },
        {
          year: "Jul",
          Radio: this.radioDatay2018['july'],
          Telephony: this.telephonyDatay2018['july'],
          Hybrid: this.hybridDatay2018['july']
        },
        {
          year: "Aug",
          Radio: this.radioDatay2018['august'],
          Telephony: this.telephonyDatay2018['august'],
          Hybrid: this.hybridDatay2018['august']
        },
        {
          year: "Sept",
          Radio: this.radioDatay2018['september'],
          Telephony: this.telephonyDatay2018['september'],
          Hybrid: this.hybridDatay2018['september']
        },
        {
          year: "Oct",
          Radio: this.radioDatay2018['october'],
          Telephony: this.telephonyDatay2018['october'],
          Hybrid: this.hybridDatay2018['october']
        },
        {
          year: "Nov",
          Radio: this.radioDatay2018['november'],
          Telephony: this.telephonyDatay2018['november'],
          Hybrid: this.hybridDatay2018['november']
        },
        {
          year: "Dec",
          Radio: this.radioDatay2018['december'],
          Telephony: this.telephonyDatay2018['december'],
          Hybrid: this.hybridDatay2018['december']
        }
      ];

      this.MasterChart2()
    }
    else if (event ==='y2019') {
      this.chartdataMaster2 = [
        {
          year: "Jan",
          Radio: this.radioDatay2019['january'],
          Telephony: this.telephonyDatay2019['january'],
          Hybrid: this.hybridDatay2019['january']
        },
        {
          year: "Feb",
          Radio: this.radioDatay2019['february'],
          Telephony: this.telephonyDatay2019['february'],
          Hybrid: this.hybridDatay2019['february']
        },
        {
          year: "Mar",
          Radio: this.radioDatay2019['march'],
          Telephony: this.telephonyDatay2019['march'],
          Hybrid: this.hybridDatay2019['march']
        },
        {
          year: "Apr",
          Radio: this.radioDatay2019['april'],
          Telephony: this.telephonyDatay2019['april'],
          Hybrid: this.hybridDatay2019['april']
        },
        {
          year: "May",
          Radio: this.radioDatay2019['may'],
          Telephony: this.telephonyDatay2019['may'],
          Hybrid: this.hybridDatay2019['may']
        },
        {
          year: "Jun",
          Radio: this.radioDatay2019['june'],
          Telephony: this.telephonyDatay2019['june'],
          Hybrid: this.hybridDatay2019['june']
        },
        {
          year: "Jul",
          Radio: this.radioDatay2019['july'],
          Telephony: this.telephonyDatay2019['july'],
          Hybrid: this.hybridDatay2019['july']
        },
        {
          year: "Aug",
          Radio: this.radioDatay2019['august'],
          Telephony: this.telephonyDatay2019['august'],
          Hybrid: this.hybridDatay2019['august']
        },
        {
          year: "Sept",
          Radio: this.radioDatay2019['september'],
          Telephony: this.telephonyDatay2019['september'],
          Hybrid: this.hybridDatay2019['september']
        },
        {
          year: "Oct",
          Radio: this.radioDatay2019['october'],
          Telephony: this.telephonyDatay2019['october'],
          Hybrid: this.hybridDatay2019['october']
        },
        {
          year: "Nov",
          Radio: this.radioDatay2019['november'],
          Telephony: this.telephonyDatay2019['november'],
          Hybrid: this.hybridDatay2019['november']
        },
        {
          year: "Dec",
          Radio: this.radioDatay2019['december'],
          Telephony: this.telephonyDatay2019['december'],
          Hybrid: this.hybridDatay2019['december']
        }
      ];

      this.MasterChart2()
    }
    else if (event ==='y2020') {
      this.chartdataMaster2 = [
        {
          year: "Jan",
          Radio: this.radioDatay2020['january'],
          Telephony: this.telephonyDatay2020['january'],
          Hybrid: this.hybridDatay2020['january']
        },
        {
          year: "Feb",
          Radio: this.radioDatay2020['february'],
          Telephony: this.telephonyDatay2020['february'],
          Hybrid: this.hybridDatay2020['february']
        },
        {
          year: "Mar",
          Radio: this.radioDatay2020['march'],
          Telephony: this.telephonyDatay2020['march'],
          Hybrid: this.hybridDatay2020['march']
        },
        {
          year: "Apr",
          Radio: this.radioDatay2020['april'],
          Telephony: this.telephonyDatay2020['april'],
          Hybrid: this.hybridDatay2020['april']
        },
        {
          year: "May",
          Radio: this.radioDatay2020['may'],
          Telephony: this.telephonyDatay2020['may'],
          Hybrid: this.hybridDatay2020['may']
        },
        {
          year: "Jun",
          Radio: this.radioDatay2020['june'],
          Telephony: this.telephonyDatay2020['june'],
          Hybrid: this.hybridDatay2020['june']
        },
        {
          year: "Jul",
          Radio: this.radioDatay2020['july'],
          Telephony: this.telephonyDatay2020['july'],
          Hybrid: this.hybridDatay2020['july']
        },
        {
          year: "Aug",
          Radio: this.radioDatay2020['august'],
          Telephony: this.telephonyDatay2020['august'],
          Hybrid: this.hybridDatay2020['august']
        },
        {
          year: "Sept",
          Radio: this.radioDatay2020['september'],
          Telephony: this.telephonyDatay2020['september'],
          Hybrid: this.hybridDatay2020['september']
        },
        {
          year: "Oct",
          Radio: this.radioDatay2020['october'],
          Telephony: this.telephonyDatay2020['october'],
          Hybrid: this.hybridDatay2020['october']
        },
        {
          year: "Nov",
          Radio: this.radioDatay2020['november'],
          Telephony: this.telephonyDatay2020['november'],
          Hybrid: this.hybridDatay2020['november']
        },
        {
          year: "Dec",
          Radio: this.radioDatay2020['december'],
          Telephony: this.telephonyDatay2020['december'],
          Hybrid: this.hybridDatay2020['december']
        }
      ];

      this.MasterChart2()
    }
    else{
      this.chartdataMaster2 = [
        {
          year: "Jan",
          Radio: this.radioDatay2021['january'],
          Telephony: this.telephonyDatay2021['january'],
          Hybrid: this.hybridDatay2021['january']
        },
        {
          year: "Feb",
          Radio: this.radioDatay2021['february'],
          Telephony: this.telephonyDatay2021['february'],
          Hybrid: this.hybridDatay2021['february']
        },
        {
          year: "Mar",
          Radio: this.radioDatay2021['march'],
          Telephony: this.telephonyDatay2021['march'],
          Hybrid: this.hybridDatay2021['march']
        },
        {
          year: "Apr",
          Radio: this.radioDatay2021['april'],
          Telephony: this.telephonyDatay2021['april'],
          Hybrid: this.hybridDatay2021['april']
        },
        {
          year: "May",
          Radio: this.radioDatay2021['may'],
          Telephony: this.telephonyDatay2021['may'],
          Hybrid: this.hybridDatay2021['may']
        },
        {
          year: "Jun",
          Radio: this.radioDatay2021['june'],
          Telephony: this.telephonyDatay2021['june'],
          Hybrid: this.hybridDatay2021['june']
        },
        {
          year: "Jul",
          Radio: this.radioDatay2021['july'],
          Telephony: this.telephonyDatay2021['july'],
          Hybrid: this.hybridDatay2021['july']
        },
        {
          year: "Aug",
          Radio: this.radioDatay2021['august'],
          Telephony: this.telephonyDatay2021['august'],
          Hybrid: this.hybridDatay2021['august']
        },
        {
          year: "Sept",
          Radio: this.radioDatay2021['september'],
          Telephony: this.telephonyDatay2021['september'],
          Hybrid: this.hybridDatay2021['september']
        },
        {
          year: "Oct",
          Radio: this.radioDatay2021['october'],
          Telephony: this.telephonyDatay2021['october'],
          Hybrid: this.hybridDatay2021['october']
        },
        {
          year: "Nov",
          Radio: this.radioDatay2021['november'],
          Telephony: this.telephonyDatay2021['november'],
          Hybrid: this.hybridDatay2021['november']
        },
        {
          year: "Dec",
          Radio: this.radioDatay2021['december'],
          Telephony: this.telephonyDatay2021['december'],
          Hybrid: this.hybridDatay2021['december']
        }
      ];

      this.MasterChart2()
    }
  }

  entryChange($event) {
    this.tableEntries = $event.target.value;
  }

  onSelect({ selected }) {
    this.tableSelected.splice(0, this.tableSelected.length);
    this.tableSelected.push(...selected);
  }

  onActivate(event) {
    this.tableActiveRow = event.row;
  }

  exportexcel() {
    /* table id is passed over here */
    let element = document.getElementById("excel-table");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    console.log("export", element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  counterChart() {
    let filterIMEI = "Name=IMEI";
    this.SearchCounterService.filter(filterIMEI).subscribe(
      (res) => {
        this.filterIMEI = res;
      },
      (err) => {},
      () => {}
    );

    let filterSERIAL = "Name=SERIAL";
    this.SearchCounterService.filter(filterSERIAL).subscribe(
      (res) => {
        this.filterSERIAL = res;
      },
      (err) => {},
      () => {}
    );

    var filterPRODUCT = "Name=PRODUCT";
    this.SearchCounterService.filter(filterPRODUCT).subscribe(
      (res) => {
        this.filterPRODUCT = res;
      },
      (err) => {},
      () => {}
    );

    var filterLABEL = "Name=LABEL";
    this.SearchCounterService.filter(filterLABEL).subscribe(
      (res) => {
        this.filterLABEL = res;
        console.log("label", this.filterLABEL.length);
      },
      (err) => {},
      () => {}
    );
  }

  // VisitorCounterGet() {
  //   this.VisitorCounterService.get().subscribe(
  //     (res) => {
  //       this.VisitorGetTable = res;
  //       console.log("counter visitor", this.VisitorGetTable.length);
  //     },
  //     (err) => {},
  //     () => {
  //       console.log("HTTP request completed.");
  //     }
  //   )

  //   this.productCertificationService.get_TAC().subscribe(
  //     (res)=>{
  //       this.TACcount = res['TAC_count']

  //     },
  //   )

  //   this.ProductGenerationService.get_IMEI().subscribe(
  //     (res)=>{
  //       this.IMEIcount = res['IMEI_count']
  //     }
  //   )

  //   this.ProductGenerationService.get_serial().subscribe(
  //     (res)=>{
  //       this.SERIALcount = res['serial_count']
  //       this.currentProduct = res['current_product']
  //     }
  //   )

  //   this.SearchCounterService.getSearchCounter().subscribe(
  //     (res) => {
  //       this.thisMonthSearch = res['get_current_counter']
  //       this.totalSearch = res['get_counter']
  //     }
  //   )

  //   this.usersService.getAll().subscribe(
  //     (res)=>{
  //       this.userdata = res
  //     }
  //   )
  // }

  widgetDataGet() {
    this.subscription = forkJoin([
      this.VisitorCounterService.get(),
      this.productCertificationService.get_TAC(),
      this.ProductGenerationService.getWidget(),
      this.SearchCounterService.getSearchCounter(),
      this.usersService.getAll(),
      this.productCertificationService.getProductChart()
    ]).subscribe(
      (res)=>{
        this.VisitorGetTable = res[0]
        this.TACData = res[1]['TAC_count']
        this.getDataDB = res[2]
        this.thisMonthSearch = res[3]['get_current_counter']
        this.totalSearch = res[3]['get_counter']
        this.userdata = res[4]
        this.IMEIData = this.getDataDB[0]['imei_count']
        this.SERIALData = this.getDataDB[0]['serial_count']
        this.TOTALData = this.getDataDB[0]['total_product']
        this.currentProduct = this.getDataDB[0]['total_product_month']
        this.certByDate = res[5]['product_by_month']
        console.log('dateCert', this .certByDate)
      }
    );
  }

  calculate(){
    this.percent = (this.thisMonthSearch/this.totalSearch*100).toFixed(2)
  }

}
