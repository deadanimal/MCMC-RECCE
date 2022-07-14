import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataSearchComponent } from './data-search/data-search.component';
import { ManagementAccessComponent } from './management-access/management-access.component';
import { ManagementAuditComponent } from './management-audit/management-audit.component';
import { ManagementUserComponent } from './management-user/management-user.component';
import { ReportComponent } from './report/report.component';
import { SystemAPIComponent } from './system-API/system-API.component';
import { SystemFaqComponent } from './system-faq/system-faq.component';
import { SystemNotiComponent } from './system-noti/system-noti.component';
import { SystemVariableComponent } from './system-variable/system-variable.component';
import { UtilityAuditComponent } from './utility-audit/utility-audit.component';

export const AdminRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'management',
                children: [
                    {
                        path: 'audit-trails',
                        component: ManagementAuditComponent
                    },
                    {
                        path: 'user',
                        component: ManagementUserComponent
                    },
                    {
                        path: 'access',
                        component: ManagementAccessComponent
                    }
                ]
            },
            {
                path: 'report',
                component: ReportComponent
            },
            {
                path: 'data-search',
                component: DataSearchComponent
            },
            {
                path: 'utility',
                children:[
                    {
                        path: 'audit-trails',
                        component: UtilityAuditComponent
                    }
                ]
            },
            {
                path: 'system',
                children:[
                    {
                        path: 'api',
                        component: SystemAPIComponent
                    },
                    {
                        path: 'variable',
                        component: SystemVariableComponent
                    },
                    {
                        path: 'notification',
                        component: SystemNotiComponent
                    },
                    {
                        path: 'faq',
                        component: SystemFaqComponent
                    }
                ]
            }
        ]
    }
]