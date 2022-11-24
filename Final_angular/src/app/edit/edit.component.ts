import { Input, Component, OnInit } from '@angular/core';
import { CredentialService } from '../_services/credential.service';
import { NotificationService } from '../_services/notification.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  credential: { owner: any; password: string; createdDate: Date; domain: string; username: string , access: string[]};
  username;



  constructor(private credentialservice: CredentialService, private notifService: NotificationService , private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.credential = history.state;
  }

  save() {

    this.credentialservice.edit(this.credential).pipe(first()).subscribe(
      resp => {
        this.notifService.showNotif(resp, 'response');

      }, error => {
        this.notifService.showNotif(error); });
  }

  updateDomain(event) {
    this.credential.domain = event.target.value;
  }
  updateUsername(event) {
    this.credential.username = event.target.value;
  }
  updatePassword(event) {
    this.credential.password = event.target.value;
  }
}
