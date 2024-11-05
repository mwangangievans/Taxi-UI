import { Component } from '@angular/core';
import { UsersComponent } from '../users/users.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { UserSessionService } from '../../service/user-session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UsersComponent, SidebarComponent, RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  isSidebarOpen = false;

  ngOnInit() {}
  constructor(private sessionService: UserSessionService) {}
  navigationItems = [
    {
      routerLink: 'dashboard',
      label: 'Home',
      svgPath:
        'M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z',
      children: [],
    },
    {
      routerLink: 'users',
      label: 'Users',
      svgPath:
        'M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z',
      children: [
        {
          name: 'Active Users',
          routerLink: 'users/active',
          icon: `
              <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path fill="white" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" />
              </svg>
            `,
        },
        {
          name: 'Inactive Users',
          routerLink: 'users/inactive',
          icon: `
              <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path fill="white" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2ZM7 10h10v4H7Z" />
              </svg>
            `,
        },
      ],
    },
    {
      routerLink: 'reports',
      label: 'Reports',
      svgPath: 'M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5',
      isStroke: true, // Specify this for SVG paths needing a stroke instead of a fill
      children: [
        {
          name: 'Active Users',
          routerLink: 'users/active',
          icon: `
            <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path fill="white" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" />
            </svg>
          `,
        },
        {
          name: 'Inactive Users',
          routerLink: 'users/inactive',
          icon: `
            <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path fill="white" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2ZM7 10h10v4H7Z" />
            </svg>
          `,
        },
      ],
    },
    {
      routerLink: 'trips',
      label: 'Trips',
      svgPath:
        'M4 4a2 2 0 0 0-2 2v9a1 1 0 0 0 1 1h.535a3.5 3.5 0 1 0 6.93 0h3.07a3.5 3.5 0 1 0 6.93 0H21a1 1 0 0 0 1-1v-4a.999.999 0 0 0-.106-.447l-2-4A1 1 0 0 0 19 6h-5a2 2 0 0 0-2-2H4Zm14.192 11.59.016.02a1.5 1.5 0 1 1-.016-.021Zm-10 0 .016.02a1.5 1.5 0 1 1-.016-.021Zm5.806-5.572v-2.02h4.396l1 2.02h-5.396Z',
      children: [
        {
          name: 'Active Users',
          routerLink: 'users/active',
          icon: `
              <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path fill="white" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" />
              </svg>
            `,
        },
        {
          name: 'Inactive Users',
          routerLink: 'users/inactive',
          icon: `
              <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path fill="white" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2ZM7 10h10v4H7Z" />
              </svg>
            `,
        },
      ],
    },
    {
      routerLink: 'settings',
      label: 'Settings',
      svgPath:
        'M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z',
      extraPath: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
      children: [
        {
          name: 'Active Users',
          routerLink: 'users/active',
          icon: `
            <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path fill="white" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" />
            </svg>
          `,
        },
        {
          name: 'Inactive Users',
          routerLink: 'users/inactive',
          icon: `
            <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path fill="white" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2ZM7 10h10v4H7Z" />
            </svg>
          `,
        },
      ],
    },
  ];

  logout() {
    this.sessionService.logout();
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
