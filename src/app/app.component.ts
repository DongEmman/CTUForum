import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  imports: [RouterModule,ReactiveFormsModule,FormsModule],
  template: `
    <router-outlet></router-outlet>
    
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'CTU-DB Forum';
}

