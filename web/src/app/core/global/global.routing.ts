import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PublicComponent } from './public/public.component';
import { LabelComponent } from './label/label.component';
import { ProductInfoComponent } from './productInfo/productInfo.component';
import { SerialComponent } from './serial/serial.component';
import { FaqComponent } from './faq/faq.component';
import { ImeiComponent } from './imei/imei.component';

export const GlobalRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'notifications',
                component: NotificationsComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'settings',
                component: SettingsComponent
            },
            {
                path: 'public',
                component: PublicComponent
            },
            {
                path: 'imei',
                component: ImeiComponent
            },
            {
                path: 'label',
                component: LabelComponent
            },
            {
                path: 'productInfo',
                component: ProductInfoComponent
            },
            {
                path: 'serial',
                component: SerialComponent
            },
            {
                path: 'faq',
                component: FaqComponent
            },
        ]
    }
]