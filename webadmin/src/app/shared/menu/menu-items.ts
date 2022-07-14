export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    isCollapsed?: boolean;
    isCollapsing?: any;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    type?: string;
    collapse?: string;
    children?: ChildrenItems2[];
    isCollapsed?: boolean;
}
export interface ChildrenItems2 {
    path?: string;
    title?: string;
    type?: string;
}

// Menu Items
export const ROUTES: RouteInfo[] = [
  {
    path: '/admin/dashboard',
    title: 'Dashboard',
    type: 'link',
    icontype: 'fas fa-home text-blue'
  },
  {
    path: '/admin/data-search',
    title: 'Data Search',
    type: 'link',
    icontype: 'fas fa-chart-bar text-blue'
  },
  {
    path: '/admin/report',
    title: 'Reporting',
    type: 'link',
    icontype: 'fas fa-chart-pie text-blue'
  },
  {
    path: '/admin/system',
    title: 'System Configuration',
    type: 'sub',
    icontype: 'fas fa-wrench text-blue',
    collapse: 'system',
    isCollapsed: true,
    children :[
      { path:'api', title:'API Configuration', type: 'link' },
      { path:'variable', title:'System Variables', type: 'link'},
      { path: 'notification', title: 'Notification Configuration', type: 'link'},
      { path: 'faq', title: 'FAQ Configuration', type: 'link'},
    ]
  },
  {
    path: '/admin/management',
    title: 'Management',
    type: 'sub',
    icontype: 'fas fa-list text-blue',
    collapse: 'management',
    isCollapsed: true,
    children: [
      { path: 'user', title: 'User Configuration', type: 'link' },
      // { path: 'access', title: 'Role-Based Access Control', type: 'link' },
    ]
  },
  {
    path: '/admin/utility',
    title: 'Utility',
    type: 'sub',
    icontype: 'fas fa-file-invoice text-blue',
    collapse: 'management',
    isCollapsed: true,
    children: [
      { path: 'audit-trails', title: 'Audit Trails', type: 'link' },
    ]
  },
  // {
  //   path: window.open(url, '_blank'),
  //   title: 'Back to Public Portal',
  //   type: 'link',
  //   icontype: 'fas fa-sign-out-alt text-blue'
  // },
  /*
  {
    path: '/helpdesk',
    title: 'Helpdesk',
    type: 'link',
    icontype: 'fas fa-life-ring text-blue'
  },
  {
    path: '/audit',
    title: 'Audit Trail',
    type: 'link',
    icontype: 'fas fa-braille text-indigo'
  }
  */
];

export const ROUTESUSER: RouteInfo[] = [
  {
    path: '/admin/dashboard',
    title: 'Dashboard',
    type: 'link',
    icontype: 'fas fa-home text-blue'
  },
  {
    path: '/admin/data-search',
    title: 'Data Search',
    type: 'link',
    icontype: 'fas fa-chart-bar text-blue'
  },
  {
    path: '/admin/report',
    title: 'Reporting',
    type: 'link',
    icontype: 'fas fa-chart-pie text-blue'
  },
  {
    path: '/admin/system',
    title: 'System Configuration',
    type: 'sub',
    icontype: 'fas fa-wrench text-blue',
    collapse: 'system',
    isCollapsed: true,
    children :[
      // { path:'api', title:'API Configuration', type: 'link' },
      // { path:'variable', title:'System Variables', type: 'link'},
      { path: 'notification', title: 'Notification Configuration', type: 'link'},
      { path: 'faq', title: 'FAQ Configuration', type: 'link'},
    ]
  },
  {
    path: '/admin/management',
    title: 'Management',
    type: 'sub',
    icontype: 'fas fa-list text-blue',
    collapse: 'management',
    isCollapsed: true,
    children: [
      { path: 'user', title: 'User Configuration', type: 'link' },
      // { path: 'access', title: 'Role-Based Access Control', type: 'link' },
    ]
  },
  {
    path: '/admin/utility',
    title: 'Utility',
    type: 'sub',
    icontype: 'fas fa-file-invoice text-blue',
    collapse: 'management',
    isCollapsed: true,
    children: [
      { path: 'audit-trails', title: 'Audit Trails', type: 'link' },
    ]
  },
  // {
  //   path: 'href="http://recce.mcmc.gov.my/"',
  //   title: 'Back to Public Portal',
  //   type: 'link',
  //   icontype: 'fas fa-sign-out-alt text-blue'
  // },
];