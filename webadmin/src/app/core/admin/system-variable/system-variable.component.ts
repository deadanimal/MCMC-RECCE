import { Component, OnInit, OnDestroy, NgZone, TemplateRef } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { variableConfigureService } from 'src/app/shared/services/variableConfigure/variableConfigure.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

am4core.useTheme(am4themes_animated);

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: 'app-system-variable',
  templateUrl: './system-variable.component.html',
  styleUrls: ['./system-variable.component.scss']
})
export class SystemVariableComponent implements OnInit {

  editVariableForm: FormGroup
  variableTable = [];

  private chart: any
  private chart1: any
  private chart2: any

  fileName= 'MasterTable.xlsx'; 

  modal: BsModalRef;
  modalConfig = {
    keyboard: true,
    class: "modal-dialog-centered modal-sm"
  };

  tableEntries: number = 5;
  tableSelected: any[] = [];
  tableActiveRow: any;
  SelectionType = SelectionType;

  constructor(
    private zone: NgZone,
    private variableConfigureService: variableConfigureService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.editVariableForm = this.formBuilder.group({
      Id: new FormControl(""),
      variable_name: new FormControl(""),
      is_enable: new FormControl(""),
    });

    // this.getCharts() 
    this.variableGet()
  }

  // ngOnDestroy() {
  //   this.zone.runOutsideAngular(() => {
  //     if (this.chart) {
  //       this.chart.dispose()
  //     }
  //     if (this.chart1) {
  //       this.chart1.dispose()
  //     }
  //     if (this.chart2) {
  //       this.chart2.dispose()
  //     }
  //   })
  // }

  // editMessage() {
  //   swal.fire({
  //     title: "Success",
  //     text: "Data editor has been save!",
  //     type: "success",
  //     buttonsStyling: false,
  //     confirmButtonClass: "btn btn-success",
  //     confirmButtonText: "Close"
  //   }).then((result) => {
  //     if (result.value) {
  //     }
  //   })
  // }

  // getCharts() {
  //   this.zone.runOutsideAngular(() => {
  //     this.getChart2()
  //   })
  // }

  // getChart2(){
  //   let chart = am4core.create("bounceVar", am4charts.XYChart);
  //   chart.paddingRight = 20;

  //   chart.data = generateChartData();

  //   let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  //   dateAxis.baseInterval = {
  //     "timeUnit": "minute",
  //     "count": 1
  //   };
  //   dateAxis.tooltipDateFormat = "HH:mm, d MMMM";

  //   let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  //   valueAxis.tooltip.disabled = false;
  //   // valueAxis.title.text = "Unique visitors";

  //   let series = chart.series.push(new am4charts.LineSeries());
  //   series.dataFields.dateX = "date";
  //   series.dataFields.valueY = "visits";
  //   series.tooltipText = "Visits: [bold]{valueY}[/]";
  //   series.fillOpacity = 0.3;


  //   chart.cursor = new am4charts.XYCursor();
  //   chart.cursor.lineY.opacity = 0;

  //   dateAxis.start = 0.8;
  //   dateAxis.keepSelection = true;



  //   function generateChartData() {
  //       let chartData = [];
  //       // current date
  //       let firstDate = new Date();
  //       // now set 500 minutes back
  //       firstDate.setMinutes(firstDate.getDate() - 500);

  //       // and generate 500 data items
  //       let visits = 500;
  //       for (var i = 0; i < 500; i++) {
  //           let newDate = new Date(firstDate);
  //           // each time we add one minute
  //           newDate.setMinutes(newDate.getMinutes() + i);
  //           // some random number
  //           visits += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
  //           // add data item to the array
  //           chartData.push({
  //               date: newDate,
  //               visits: visits
  //           });
  //       }
  //       return chartData;
  //   }
  //   this.chart2 = chart
  // }

  exportexcel() {
    /* table id is passed over here */   
    let element = document.getElementById('excel-table'); 
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    console.log("export",element)
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
   
  }

 variableGet() {
  this.variableConfigureService.get().subscribe(
    (res) => {
      this.variableTable=res
      console.log("wewe",this.variableTable)
    },
    (err) => {
      // this.loadingBar.complete();
      // this.errorMessage();
      // console.log("HTTP Error", err), this.errorMessage();
    },
    () => console.log("HTTP request completed.")
  );
}

update(){
  console.log(this.editVariableForm.value.is_enable)
  console.log(this.editVariableForm.value.Id)
  this.spinner.show()
  this.variableConfigureService.update({'is_enable': this.editVariableForm.value.is_enable},this.editVariableForm.value.Id).subscribe(
    (res) => {
      console.log("success",res)
      this.spinner.hide()
      this.editMessage()
    },
    () => {

    },
    () => {
      // After
      // this.notifyService.openToastr("Success", "Welcome back");
      // this.navigateHomePage();
    }
  );

}

editMessage() {
  swal.fire({
    title: "Success",
    text: "A variable has been update!",
    type: "success",
    buttonsStyling: false,
    confirmButtonClass: "btn btn-success",
    confirmButtonText: "Close"
  }).then((result) => {
    if (result.value) {
      this.modal.hide()
      this.variableGet()
      this.editVariableForm.reset()
    }
  })
}

openModal(modalRef: TemplateRef<any>, process: string, row) {
  if (process == "edit"){
    console.log("loop edit")
    this.editVariableForm.patchValue({
      ...row,
    });
  }
  this.modal = this.modalService.show(modalRef, this.modalConfig);
}

closeModal() {
  this.modal.hide()
}

entryChange($event) {
  this.tableEntries = $event.target.value;
}


}