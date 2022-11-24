import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './_services/auth-guard.service';
import {AdminComponent} from './admin/admin.component';
import {AddComponent} from './add/add.component';
import {RegisterComponent} from './register/register.component';
import {EditComponent} from './edit/edit.component';
import {Role} from './_models/role';

//TODO: add the route to the 'settings' component.

// tslint:disable-next-line:max-line-length
const routes: Routes = [{path: '', component: HomeComponent, canActivate: [AuthGuard]}, {path: 'login', component: LoginComponent} , {path: 'add', component: AddComponent}, {path: 'edit', component: EditComponent} , { path: 'register', component: RegisterComponent },
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: [Role.admin]}},
  { path: '**', redirectTo: '' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
