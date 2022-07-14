import { Component, OnInit, NgZone, OnDestroy } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Router } from "@angular/router";
import { SearchCounterService } from "src/app/shared/services/SearchCounter/SearchCounter.service";
import { ProductGenerationService } from "src/app/shared/services/ProductRegistration/ProductGeneration.service";
import { productCertificationService } from "src/app/shared/services/productCertification/productCertification.service";
import { VisitorCounterService } from "src/app/shared/services/VisitorCounter/VisitorCounter.service";
import { forkJoin, Subscription } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';

am4core.useTheme(am4themes_animated);
am4core.addLicense('ch-custom-attribution');

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Chart
  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  private chart: any;
  private chart1: any;
  private chart2: any;
  private chart3: any;

  test: number = new Date().getMonth() + 1;
  test2: number = new Date().getFullYear()

  counter: any
  visitorbymonth: any
  searchbymonth: any
  productData: any
  visitorby2021: any
  visitorby2022: any
  searchby2021:any
  searchby2022: any

  IMEITable = [];
  portalChartData = []
  SerialTable = [];
  CertTable = [];
  CounterTable = [];
  SLPTable = [];
  VisitorGetTable = [];
  filterIMEI = [];
  filterSERIAL = [];
  filterPRODUCT = [];
  filterLABEL = [];
  checkerDate = []
  TACData: number
  getDataDB = []
  serialData: number
  IMEIData: number
  searchMonthly = []
  totalSearch = []

  subscription: Subscription;

  constructor(
    private zone: NgZone,
    private SearchCounterService: SearchCounterService,
    private productGenerationService: ProductGenerationService,
    private productCertificationService: productCertificationService,
    private VisitorCounterService: VisitorCounterService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit() {
    this.widgetDataGet();
    this.getData();
    setTimeout(() => {
      this.portalChartData =  [
        {
          year: "Jan",
          visitor: this.visitorby2022['january'],
          search: this.searchby2022['january'],
        },
        {
          year: "Feb",
          visitor:this.visitorby2022['february'],
          search:this.searchby2022['february'],
        },
        {
          year: "Mar",
          visitor:this.visitorby2022['march'],
          search:this.searchby2022['march'],
        },
        {
          year: "Apr",
          visitor:this.visitorby2022['april'],
          search:this.searchby2022['april'],
        },
        {
          year: "May",
          visitor:this.visitorby2022['may'],
          search:this.searchby2022['may'],
        },
        {
          year: "Jun",
          visitor: this.visitorby2022['june'],
          search: this.searchby2022['june'],
        },
        {
          year: "Jul",
          visitor: this.visitorby2022['july'],
          search: this.searchby2022['july'],
        },
        {
          year: "Aug",
          visitor: this.visitorby2022['august'],
          search: this.searchby2022['august'],
        },
        {
          year: "Sept",
          visitor: this.visitorby2022['september'],
          search: this.searchby2022['september'],
        },
        {
          year: "Oct",
          visitor: this.visitorby2022['october'],
          search: this.searchby2022['october'],
        },
        {
          year: "Nov",
          visitor: this.visitorby2022['november'],
          search: this.searchby2022['november'],
        },
        {
          year: "Dec",
          visitor: this.visitorby2022['december'],
          search: this.searchby2022['december'],
        },
      ];
      this.getCharts()
    }, 32000);
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart1) {
        this.chart1.dispose();
      }
      if (this.chart2) {
        this.chart2.dispose();
      }
      if (this.chart3) {
        this.chart3.dispose();
      }
    });
  }

  getCharts() {
    this.zone.runOutsideAngular(() => {
      this.getChart1();
      this.getChart2();
      this.getChart3();
    });
  }

  getData(){
    this.subscription = forkJoin([
      this.productGenerationService.getProductChart(),
      this.VisitorCounterService.getVisitorChartNew(),
      this.SearchCounterService.getSearchChartNew(),
      this.SearchCounterService.getSearchMonthly(),
      this.SearchCounterService.getSearchCounter()
    ]).subscribe(
      (res) => {
        this.productData = res[0]['product_by_month']
        this.visitorby2021 = res[1].visitor_chart.y2021
        this.visitorby2022 = res[1].visitor_chart.y2022
        this.searchby2021 = res[2].search_chart.y2021
        this.searchby2022 = res[2].search_chart.y2022
        this.searchMonthly = res[3]
        this.totalSearch = res[4]['get_counter']
      }
    )
  }

  getChart1() {
    let chart = am4core.create("chartdiv1", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [
      {
        item:"Product Info",
        value: this.searchMonthly['product'],
        color: am4core.color("#007ac0")
      },
      {
        item:"IMEI",
        value: this.searchMonthly['imei'],
        color: am4core.color("#fabb00")
      },
      {
        item:"Serial",
        value: this.searchMonthly['serial'],
        color: am4core.color("#c7f0ff")
      },
      {
        item:"SLP ID",
        value: this.searchMonthly['label'],
        color: am4core.color("#e64687")
      }
    ]

    console.log("chart.data", chart.data);
    chart.radius = am4core.percent(70);
    chart.innerRadius = am4core.percent(40);
    chart.startAngle = 0;
    chart.endAngle = 360;

    let series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "item";
    series.slices.template.propertyFields.fill = "color";
    series.ticks.template.disabled = true;
    series.labels.template.disabled = true;

    series.slices.template.cornerRadius = 10;
    series.slices.template.innerCornerRadius = 7;
    series.slices.template.draggable = true;
    series.slices.template.inert = true;
    series.alignLabels = false;

    series.hiddenState.properties.startAngle = 90;
    series.hiddenState.properties.endAngle = 90;
    this.chart1 = chart;
  }

  getChart2() {
    let chart = am4core.create("data", am4charts.XYChart);

    // Add data
    chart.data = this.productData
    console.log("getChart2", this.productData)
    // Set input format for the dates
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "count";
    series.dataFields.dateX = "date";
    series.tooltipText = "{count}";
    series.strokeWidth = 2;
    series.minBulletDistance = 15;

    // Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.strokeOpacity = 0;
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.label.minWidth = 40;
    series.tooltip.label.minHeight = 40;
    series.tooltip.label.textAlign = "middle";
    series.tooltip.label.textValign = "middle";

    // Make bullets grow on hover
    let bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color("#fff");

    let bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.3;

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panXY";
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

    // Create vertical scrollbar and place it before the value axis
    // chart.scrollbarY = new am4core.Scrollbar();
    // chart.scrollbarY.parent = chart.leftAxesContainer;
    // chart.scrollbarY.toBack();

    // Create a horizontal scrollbar with previe and place it underneath the date axis
    // chart.scrollbarX = new am4charts.XYChartScrollbar();
    // let scrollbarX = new am4charts.XYChartScrollbar();
    // scrollbarX.series.push(series);
    // chart.scrollbarX = scrollbarX;
    // chart.scrollbarX.parent = chart.bottomAxesContainer;

    // dateAxis.start = 0.79;
    // dateAxis.keepSelection = true;

    this.chart2 = chart;
  }

  getChart3() {
    let chart = am4core.create("portal", am4charts.XYChart);

    // Add data
    chart.data = this.portalChartData

    console.log("getChart3", chart.data)

    chart.exporting.menu = new am4core.ExportMenu();

    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.opposite = false;
    categoryAxis.renderer.minGridDistance = 40;

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
    series1.strokeWidth = 3;

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "unique";
    series2.dataFields.categoryX = "year";
    series2.name = "Unique Visitor";
    series2.bullets.push(new am4charts.CircleBullet());
    series2.tooltipText = "{name}: {valueY}";
    series2.legendSettings.valueText = "{valueY}";

    let series3 = chart.series.push(new am4charts.ColumnSeries());
    series3.dataFields.valueY = "search";
    series3.dataFields.categoryX = "year";
    series3.name = "Total Search";
    series3.tooltipText = "{name}: {valueY}";
    series3.legendSettings.valueText = "{valueY}";
    series3.fill = am4core.color("#ff4d4d")

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomY";

    let hs1 = series1.segments.template.states.create("hover");
    hs1.properties.strokeWidth = 5;
    series1.segments.template.strokeWidth = 1;

    let hs2 = series2.segments.template.states.create("hover");
    hs2.properties.strokeWidth = 5;
    series2.segments.template.strokeWidth = 1;

    // let hs3 = series3.segments.template.states.create("hover");
    // hs3.properties.strokeWidth = 5;
    // series3.segments.template.strokeWidth = 1;

    // // Add legend
    // chart.legend = new am4charts.Legend();
    // chart.legend.itemContainers.template.events.on("over", function(event){
    //   let segments = event.target.dataItem.dataContext.segments;
    //   segments.each(function(segment){
    //     segment.isHover = true;
    //   })
    // })

    // chart.legend.itemContainers.template.events.on("out", function(event){
    //   let segments = event.target.dataItem.dataContext.segments;
    //   segments.each(function(segment){
    //     segment.isHover = false;
    //   })
    // })
  }

  toggleEmail2(event){
    console.log(event)
    if(event ==='total'){
      this.portalChartData = [{
        year: "2020",
        visitor: 0,
        search: 0,
      }, {
        "year": "2021",
        visitor: this.VisitorGetTable.length,
        search: this.totalSearch,
      },
      {
        "year": "2022",
        visitor: 0,
        search: 0,
      }
      ];
        this.getChart3()
    }
    else if(event === 'new') {
      this.portalChartData = [
        {
          year: "Jan",
          visitor:0,
          search: 0,
        },
        {
          year: "Feb",
          visitor: 0,
          search: 0,
        },
        {
          year: "Mar",
          visitor: 0,
          search: 0,
        },
        {
          year: "Apr",
          visitor: 0,
          search: 0,
        },
        {
          year: "May",
          visitor: 0,
          search: 0,
        },
        {
          year: "Jun",
          visitor: 0,
          search: 0,
        },
        {
          year: "Jul",
          visitor: 0,
          search: 0,
        },
        {
          year: "Aug",
          visitor: 0,
          search: 0,
        },
        {
          year: "Sept",
          visitor: 0,
          search: 0,
        },
        {
          year: "Oct",
          visitor: 0,
          search: 0,
        },
        {
          year: "Nov",
          visitor: 0,
          search: 0,
        },
        {
          year: "Dec",
          visitor: 0,
          search: 0,
        },
      ];
        this.getChart3()
    }
    else if(event ==='y2022'){
      this.portalChartData =  [
        {
          year: "Jan",
          visitor: this.visitorby2022['january'],
          search: this.searchby2022['january'],
        },
        {
          year: "Feb",
          visitor:this.visitorby2022['february'],
          search:this.searchby2022['february'],
        },
        {
          year: "Mar",
          visitor:this.visitorby2022['march'],
          search:this.searchby2022['march'],
        },
        {
          year: "Apr",
          visitor:this.visitorby2022['april'],
          search:this.searchby2022['april'],
        },
        {
          year: "May",
          visitor:this.visitorby2022['may'],
          search:this.searchby2022['may'],
        },
        {
          year: "Jun",
          visitor: this.visitorby2022['june'],
          search: this.searchby2022['june'],
        },
        {
          year: "Jul",
          visitor: this.visitorby2022['july'],
          search: this.searchby2022['july'],
        },
        {
          year: "Aug",
          visitor: this.visitorby2022['august'],
          search: this.searchby2022['august'],
        },
        {
          year: "Sept",
          visitor: this.visitorby2022['september'],
          search: this.searchby2022['september'],
        },
        {
          year: "Oct",
          visitor: this.visitorby2022['october'],
          search: this.searchby2022['october'],
        },
        {
          year: "Nov",
          visitor: this.visitorby2022['november'],
          search: this.searchby2022['november'],
        },
        {
          year: "Dec",
          visitor: this.visitorby2022['december'],
          search: this.searchby2022['december'],
        },
      ];
        this.getChart3()
    }
    else if (event==='y2021'){
      this.portalChartData =  [
        {
          year: "Jan",
          visitor: this.visitorby2021['january'],
          search: this.searchby2021['january'],
        },
        {
          year: "Feb",
          visitor:this.visitorby2021['february'],
          search:this.searchby2021['february'],
        },
        {
          year: "Mar",
          visitor:this.visitorby2021['march'],
          search:this.searchby2021['march'],
        },
        {
          year: "Apr",
          visitor:this.visitorby2021['april'],
          search:this.searchby2021['april'],
        },
        {
          year: "May",
          visitor:this.visitorby2021['may'],
          search:this.searchby2021['may'],
        },
        {
          year: "Jun",
          visitor: this.visitorby2021['june'],
          search: this.searchby2021['june'],
        },
        {
          year: "Jul",
          visitor: this.visitorby2021['july'],
          search: this.searchby2021['july'],
        },
        {
          year: "Aug",
          visitor: this.visitorby2021['august'],
          search: this.searchby2021['august'],
        },
        {
          year: "Sept",
          visitor: this.visitorby2021['september'],
          search: this.searchby2021['september'],
        },
        {
          year: "Oct",
          visitor: this.visitorby2021['october'],
          search: this.searchby2021['october'],
        },
        {
          year: "Nov",
          visitor: this.visitorby2021['november'],
          search: this.searchby2021['november'],
        },
        {
          year: "Dec",
          visitor: this.visitorby2021['december'],
          search: this.searchby2021['december'],
        },
      ];
        this.getChart3()
    }
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
}
