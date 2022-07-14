import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  AccordionModule,
  BsDropdownModule,
  ModalModule,
  ProgressbarModule, 
  TabsModule,
  TooltipModule
} from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { RouterModule } from '@angular/router';
import { AdminRoutes } from './admin.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagementAuditComponent } from './management-audit/management-audit.component';
import { ManagementUserComponent } from './management-user/management-user.component';
import { ReportComponent } from './report/report.component';
import { SystemAPIComponent} from './system-API/system-API.component';
import { SystemNotiComponent } from './system-noti/system-noti.component';
import { SystemVariableComponent } from './system-variable/system-variable.component';
import { ManagementAccessComponent } from './management-access/management-access.component';
import { UtilityAuditComponent } from './utility-audit/utility-audit.component';
import { DataSearchComponent } from './data-search/data-search.component';
import { SystemFaqComponent } from './system-faq/system-faq.component';
import { CalendarModule } from 'src/app/examples/calendar/calendar.module';
import { NgxPrintModule } from 'ngx-print';
import { QuillModule } from 'ngx-quill';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    DashboardComponent,
    ManagementAuditComponent,
    ManagementUserComponent,
    ReportComponent,
    SystemAPIComponent,
    SystemNotiComponent,
    SystemVariableComponent,
    ManagementAccessComponent,
    UtilityAuditComponent,
    DataSearchComponent,
    SystemFaqComponent
  ],
  imports: [
    CommonModule,
    AccordionModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    LoadingBarModule,
    NgxDatatableModule,
    RouterModule.forChild(AdminRoutes),
    CalendarModule,
    NgxPrintModule,
    QuillModule,
    NgCircleProgressModule,
    NgxSpinnerModule,
  ]
})
export class AdminModule { }
