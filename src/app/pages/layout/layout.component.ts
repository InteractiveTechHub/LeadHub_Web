import { Component, OnInit } from '@angular/core';
import { PRIME_NG_MODULES } from '../../core/utils/primeng-modules';
import { NgClass } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '@authentication/services';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout',
  imports: [
    NgClass,
    TranslatePipe,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ...PRIME_NG_MODULES
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  collapsed: boolean = true;
  currentRoute: string = '';

  // TODO: Move to a file
  menuItems = [
    {
      label: 'menu.dashboard',
      icon: 'pi pi-th-large',
      route: '/dashboard',
      expanded: false,
      roles: ['SysAdmin', 'Owner', 'Support', 'Manager', 'Consultant'],
      children: []
    },
    {
      label: 'menu.leads',
      icon: 'pi pi-users',
      route: '/leads',
      expanded: false,
      roles: ['SysAdmin', 'Owner', 'Support', 'Manager', 'Consultant'],
      children: []
    },
    {
      label: 'menu.salespipelines',
      icon: 'pi pi-filter',
      route: '/salespipelines',
      expanded: false,
      roles: ['SysAdmin', 'Owner', 'Support', 'Manager', 'Consultant'],
      children: []
    },
    {
      label: 'menu.schedule',
      icon: 'pi pi-calendar',
      route: '/calendar',
      expanded: false,
      roles: ['SysAdmin', 'Owner', 'Support', 'Manager', 'Consultant'],
      children: []
    },
    {
      label: 'menu.report',
      icon: 'pi pi-file',
      expanded: false,
      roles: ['SysAdmin', 'Owner', 'Support', 'Manager', 'Consultant'],
      children: [
        {
          label: 'menu.analytics',
          icon: 'pi pi-chart-line',
          route: '/analytics'
        },
        {
          label: 'menu.graphics',
          icon: 'pi pi-chart-bar',
          route: '/graphics'
        },
      ]
    },
    {
      label: 'menu.admin',
      icon: 'pi-cog',
      expanded: false,
      roles: ['SysAdmin', 'Owner', 'Support', 'Manager'],
      children: [
        {
          label: 'menu.company',
          icon: 'pi pi-building',
          route: '/admin/companies'
        },
        {
          label: 'menu.consultants',
          icon: 'pi pi-users',
          route: '/admin/consultants'
        }
      ]
    }
  ];

  userMenuItems: MenuItem[] = [
    {
      label: 'Editar Perfil',
      icon: 'pi pi-user-edit',
      //command: () => this.onEditProfile()
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      //command: () => this.onLogout()
    }
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // It always updates the current route when navigation changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });

    const userRoles = this.authService.getUserRoles();
    this.menuItems = this.filterMenuItemsByRoles(this.menuItems, userRoles);
  }

  isActive(route: string | undefined): boolean {
    return this.currentRoute === route;
  }

  filterMenuItemsByRoles(menu: any[], roles: string[]): any[] {
    return menu
      .filter(item => !item.roles || item.roles.some((role: string) => roles.includes(role)))
      .map(item => ({
        ...item,
        children: item.children ? this.filterMenuItemsByRoles(item.children, roles) : [],
      }));
  }

  toggleSubMenu(item: any) {
    item.expanded = !item.expanded;
  }

  onMouseEnter() {
    this.collapsed = false;
  }

  onMouseLeave() {
    this.collapsed = true;
  }
}
