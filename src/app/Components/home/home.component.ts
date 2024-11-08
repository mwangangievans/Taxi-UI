import { Component } from '@angular/core';
import { UsersComponent } from '../users/users.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { UserSessionService } from '../../service/user-session.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface NavigationItem {
  routerLink: string;
  label: string;
  icon: string;
  toggled: boolean;
  children: NavigationItem[]; // Recursive reference to the same type
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    UsersComponent,
    SidebarComponent,
    RouterModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  isSidebarOpen = false;

  ngOnInit() {}
  constructor(private sessionService: UserSessionService) {}

  navigationItems: NavigationItem[] = [
    {
      routerLink: 'dashboard',
      label: 'Home',
      icon: 'home',
      toggled: false,
      children: [],
    },
    {
      routerLink: 'users',
      label: 'Users',
      icon: 'group',
      toggled: false,
      children: [
        {
          routerLink: 'users/drivers',
          label: 'Drivers',
          icon: 'settings',
          toggled: false,
          children: [],
        },
        {
          routerLink: 'users/passagers',
          label: 'Passagers',
          icon: 'settings',
          toggled: false,
          children: [],
        },
      ],
    },
    {
      routerLink: 'reports',
      label: 'Reports',
      icon: 'view_list',
      toggled: false,
      children: [],
    },
    {
      routerLink: 'trips',
      label: 'Trips',
      icon: 'airport_shuttle',
      toggled: false,
      children: [],
    },
    {
      routerLink: 'settings',
      label: 'Settings',
      icon: 'settings',
      toggled: false,
      children: [],
    },
  ];

  logout() {
    this.sessionService.logout();
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleItem(item: any) {
    console.log({ item });

    // Close all other items
    this.navigationItems.forEach((navItem) => {
      if (navItem !== item) {
        navItem.toggled = false;
      }
    });

    // Toggle the selected item
    item.toggled = !item.toggled;
  }
}
