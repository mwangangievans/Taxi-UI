import { Component } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { NotificationService } from '../../service/notification.service';
import { error } from 'console';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  ngOnInit() {
    this.getUsers();
  }

  constructor(private api: HttpService, private notify: NotificationService) {}
  getUsers() {
    this.api.get('user').subscribe({
      next: (response) => {
        console.log('User data retrieved:', response);
        // You can process the response here, e.g., update the state or UI
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        // Handle any errors here, such as showing an error message to the user
      },
      complete: () => {
        console.log('Completed the request to get users.');
        // Optional: Execute any additional code after the request completes
      },
    });
  }
}
