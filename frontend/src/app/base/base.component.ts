import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent {
constructor(private readonly authService:LoginService){}
isWhiteBackground = true;
  logOut():void{
    this.authService.logOut();
  }

  changeColor(){
    console.log("black")
    this.isWhiteBackground = !this.isWhiteBackground;
  }
}
