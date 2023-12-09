import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { StudentComponent } from './student/student.component';
import { LoginComponent } from './login/login.component';
import { CoursesComponent } from './courses/courses.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './services/auth-guard.service';
import { PartnersComponent } from './partners/partners.component';
import { CalanderComponent } from './calander/calander.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'home',component:HomeComponent ,canActivate: [AuthGuardService]},
  {path:'students' , component:StudentComponent,canActivate: [AuthGuardService] },
  {path:'courses' , component:CoursesComponent,canActivate: [AuthGuardService]},
  {path:'partners' , component:PartnersComponent,canActivate: [AuthGuardService]},
  {path:'calander' , component:CalanderComponent,canActivate: [AuthGuardService]},
  {path:'profile' , component:ProfileComponent,canActivate: [AuthGuardService]},
  {path:'settings' , canActivate: [AuthGuardService] , children : [
    {path : 'Security' ,component:SettingsComponent },
    {path : 'notification' ,component:NotificationComponent },
    {path : 'profile' ,component:ProfileComponent }
  ]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }