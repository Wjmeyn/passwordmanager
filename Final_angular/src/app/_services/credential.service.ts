
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {AuthService} from './auth.service';
import {Credential} from '../_models/credential';
import { User } from '../_models/user';
import { PAType } from '../_models/PAType';




@Injectable({ providedIn: 'root' })
export class CredentialService {
  constructor(private http: HttpClient, private auth: AuthService) { }
  get() {
    return this.http.get<Credential[]>(`http://localhost:3030/user/getcredentials`);
  }

  getSharedWithMe() {
    return this.http.get<Credential[]>(`http://localhost:3030/user/getsharedwithme`);
  }


  add(credential) {

    return this.http.post(`http://localhost:3030/user/addcredential`, credential);

  }

  share(user, credential) {


    return this.http.post(`http://localhost:3030/user/sharecredential`, [user, credential]);

  }

  edit(credential) {


    return this.http.post(`http://localhost:3030/user/edit`, credential);

  }


  delete(domain: string) {
    return this.http.delete(`http://localhost:3030/user/${domain}`);

  }



}
