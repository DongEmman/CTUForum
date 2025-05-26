import { Component } from '@angular/core';

@Component({
  selector: 'app-car',
  imports: [],
  templateUrl:'./car.Component.html',
  styleUrls: ['./car.component.css'],
})
export class CarComponent {
   car ={
    color: "red",
    sound: "Vroom",

   }
}
