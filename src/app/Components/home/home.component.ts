import { Component } from '@angular/core';
import { UsersComponent } from '../users/users.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { UserSessionService } from '../../service/user-session.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UsersComponent, SidebarComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  ngOnInit() {}
  constructor(private sessionService: UserSessionService) {}

  logout() {
    this.sessionService.logout();
  }
}
