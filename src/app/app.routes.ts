import { Routes } from '@angular/router';
import { authGuard } from '@authentication/shared';
import { CompanyFormComponent, CompanyListComponent } from '@page/admin/company';
import { ConsultantFormComponent, ConsultantListComponent } from '@page/admin/consultant';
import { LayoutComponent } from '@page/layout';
import { LeadsManagerComponent } from '@page/leads-manager';
import { LoginComponent } from '@authentication/login';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
          path: '',
          redirectTo: 'leads',
          pathMatch: 'full'
      },
      {
        path: 'leads',
        loadComponent: () => import('./pages/leads-manager/leads-manager.component').then(m => m.LeadsManagerComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'admin/companies',
        loadComponent: () => import('./pages/admin/company/company-list/company-list.component').then(c => c.CompanyListComponent),
        data: { roles: ['SysAdmin'] },
        canActivate: [authGuard]
      },
      {
        path: 'admin/company',
        loadComponent: () => import('./pages/admin/company/company-form/company-form.component').then(c => c.CompanyFormComponent),
        data: { roles: ['SysAdmin'] },
        canActivate: [authGuard]
      },
      {
        path: 'admin/company/:id',
        loadComponent: () => import('./pages/admin/company/company-form/company-form.component').then(c => c.CompanyFormComponent),
        data: { roles: ['SysAdmin'] },
        canActivate: [authGuard]
      },
      {
        path: 'admin/consultants',
        loadComponent: () => import('./pages/admin/consultant/consultant-list/consultant-list.component').then(c => c.ConsultantListComponent),
        data: { roles: ['SysAdmin'] },
        canActivate: [authGuard]
      },
      {
        path: 'admin/consultant',
        loadComponent: () => import('./pages/admin/consultant/consultant-form/consultant-form.component').then(c => c.ConsultantFormComponent),
        data: { roles: ['SysAdmin'] },
        canActivate: [authGuard]
      },
      {
        path: 'admin/consultant/:id',
        loadComponent: () => import('./pages/admin/consultant/consultant-form/consultant-form.component').then(c => c.ConsultantFormComponent),
        data: { roles: ['SysAdmin'] },
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./authentication/login/login.component').then(a => a.LoginComponent),
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];
