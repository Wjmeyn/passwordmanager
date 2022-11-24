
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NotificationService} from '../_services/notification.service';
import {UserService} from '../_services/user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Credential} from '../_models/Credential';
import { CredentialService } from '../_services/credential.service';

@Component({
  selector: 'credential-component',
  templateUrl: './credential.component.html',
  styleUrls: ['./credential.component.css']
})
export class CredentialComponent implements OnInit {
  @Input() credential: Credential;
  @Output() deleteEvent = new EventEmitter<Credential>();
  @Output() eventEmitter = new EventEmitter<string>();

  users: string[] = [];

  constructor(private credentialService: CredentialService, private route: ActivatedRoute, private notifService: NotificationService, private userService: UserService) {
  }

  delete(credential) {
    this.deleteEvent.emit(credential);
  }

  edit(credential) {
    this.eventEmitter.emit(credential.domain);
  }

  ngOnInit(): void {

    this.userService.getUsernames().pipe().subscribe(
      names => {
        this.users = names;
      });


  }

  showPassword(id) {

    const txtPassword = document.getElementById(id) as HTMLInputElement | null;
    if (txtPassword.type === 'password') {
      txtPassword.type = 'string';
    } else {
      txtPassword.type = 'password';
    }


  }

  share(user, credential) {
    const shared = document.getElementById(user) as HTMLButtonElement | null;
    if (shared.value === '0') {
      shared.value = '1';
      shared.style.color = 'green';
    } else if (shared.value === '1') {
      shared.value = '0';
      shared.style.color = 'black';
    }

    this.credentialService.share(user, credential).subscribe(
      result => {
        this.eventEmitter.emit(credential.domain);
        this.notifService.showNotif(result.toString(), 'confirmation');
      },
      error => {
        this.notifService.showNotif(error.toString(), 'warning');
      });

    setTimeout(() => {}, 20);


  }

  // Get list of users that a credential can be shared with
  getShareable() {
    let canshare: string[] = [];
    for (let i = 0; i < this.users.length; i++) {
      if (this.credential.owner !== this.users[i]) {
        canshare.push(this.users[i]);
      }
    }
    return canshare;
  }

  // Update value of share buttons
  updateButtons(user) {

    const shared = document.getElementById(user) as HTMLButtonElement | null;
    if (this.credential.access.indexOf(user) === -1) {
      return 0;
    }
    return 1;

  }

  // Change color of the button based on value
  updateColor(user) {
    const shared = document.getElementById(user) as HTMLButtonElement | null;
    if (shared.value === '1') {

      shared.style.color = 'green';
    } else if (shared.value === '0') {

      shared.style.color = 'black';
    }


  }



}
