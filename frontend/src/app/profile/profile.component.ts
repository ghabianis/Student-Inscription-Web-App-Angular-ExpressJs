import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userData:any
  username:any
  name:any
  email:any
  ngOnInit() {
    this.userCredentials()
  }

  userCredentials(){
    const user = localStorage.getItem('user');
    const userData = JSON.parse(user!);
    this.email = userData.email;
    this.username = userData.username
    this.name = userData.name
  }

}
