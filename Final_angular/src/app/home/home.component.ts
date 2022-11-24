import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import {first, mergeMap} from 'rxjs/operators';


import {NotificationService} from '../_services/notification.service';
import {Credential} from '../_models/credential';
import {CredentialService} from '../_services/credential.service';
import {UserService} from '../_services/user.service';


@Component({ templateUrl: 'home.component.html' ,

  styleUrls: ['home.component.css']})
export class HomeComponent implements OnInit {

  searchText = '';
  credentials: Credential[] = [];
  showcredentials: Credential[] = [];


  option = 0;

  constructor(
    private credentialService: CredentialService,
    private userService: UserService,

    private notifService: NotificationService,
  ) {}

  ngOnInit() {
    if (this.option === 0) {
      this.loadCredentials();
    } else if (this.option === 1) {
      this.loadShared();
    } else if (this.option === 2) {
      this.loadSharedWithMe();
    }

      }

      // Reload home page
  reload() {

      this.loadCredentials();
     if (this.option === 1) {
      this.loadShared();
    } else if (this.option === 2) {
      this.loadSharedWithMe();
    }
  }





  loadCredentials() {
    this.option = 0;
    this.credentialService.get().subscribe(
         credentials => {
           this.credentials = credentials;
           this.showcredentials = this.credentials;

         },
        error => {
            this.notifService.showNotif(error.toString(), 'warning'); });
  }

  // Load shared credentials
  loadShared() {
    this.showcredentials = [];
    this.option = 1;

    setTimeout(() => {

      for (let i = 0; i < this.credentials.length; i++) {

        if (this.credentials[i].access.length > 0) {
          this.showcredentials.push(this.credentials[i]);
        }
      }

      if (this.showcredentials.length === 0) {
        this.notifService.showNotif('No credentials found', 'warning');
      }
    }, 20);






  }

  // Load credentials with me
  loadSharedWithMe() {
    this.option = 2;
    this.showcredentials = null;
    this.credentialService.getSharedWithMe().subscribe(
      credentials => {
        this.showcredentials = credentials;

        if (this.showcredentials.length === 0) {
          this.notifService.showNotif('No credentials found', 'warning');
        }
      },
      error => {
        this.notifService.showNotif(error.toString(), 'warning'); });
  }


  // Delete credential
  deleteCredential(credential) {


    this.credentialService.delete(credential.domain).pipe(first()).subscribe(

      resp => {
        this.credentials = null;
        this.loadCredentials();
        this.notifService.showNotif(resp, 'response');
        }, error => {

        this.notifService.showNotif(error, 'error'); });
  }

  // Filter credential
  filterCredentials(event) {
    this.loadCredentials();
    setTimeout(() => {
      if (event.target.value !== '') {

          this.showcredentials = this.credentials.filter((credential) => {

              if (credential.domain.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) {
                return true;
              }
              return false;
            }
          );
        }



    }, 20);

  }

}

