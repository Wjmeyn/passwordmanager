import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {Credential} from '../_models/Credential';
import {NotificationService} from '../_services/notification.service';
import {UserService} from '../_services/user.service';
import {CredentialService} from '../_services/credential.service';
import {AuthService} from '../_services/auth.service';
import { first } from 'rxjs/operators';
import { PAType } from '../_models/PAType';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {


  credential: { owner: any; password: string; createdDate: Date; domain: string; username: string , access: string[]};
  username;


  constructor(private credentialservice: CredentialService, private notifService: NotificationService , private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.authService.currentUser.pipe(first()).subscribe(
      user => {
        this.username = user.username;

    });

    this.credential = {
      owner: this.username,
      domain: '',
      username: '',
      password: '',
      access: [],
      createdDate: new Date(),
    };
  }

  save() {
    if ((this.credential.domain !== '' || this.credential.username !== '') || this.credential.password !== '') {
      this.credentialservice.add(this.credential).pipe(first()).subscribe(
        resp => {
          this.notifService.showNotif(resp, 'response');

        }, error => {
          this.notifService.showNotif(error); });
    } else {
      this.notifService.showNotif('Fill in all fields', 'warning');
    }


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
