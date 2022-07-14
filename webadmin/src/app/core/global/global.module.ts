import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  AccordionModule,
  BsDropdownModule,
  ModalModule,
  ProgressbarModule, 
  RatingModule, 
  TabsModule,
  TooltipModule
} from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { RouterModule } from '@angular/router';
import { GlobalRoutes } from './global.routing';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { PublicComponent } from './public/public.component';
import { EmeiComponent } from './emei/emei.component';
import { LabelComponent } from './label/label.component';
import { ProductInfoComponent } from './productInfo/productInfo.component';
import { SerialComponent } from './serial/serial.component';
import { FaqComponent } from './faq/faq.component';
import { NgxCaptchaModule } from 'ngx-captcha';

@NgModule({
  declarations: [
    NotificationsComponent,
    ProfileComponent,
    SettingsComponent,
    PublicComponent,
    EmeiComponent,
    LabelComponent,
    ProductInfoComponent,
    SerialComponent,
    FaqComponent,

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
    RouterModule.forChild(GlobalRoutes),
    RatingModule,
    NgxCaptchaModule,
  ]
})
export class GlobalModule { }
