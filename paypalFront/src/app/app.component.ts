import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'paypalFront';

  constructor(private http: HttpClient) {

  }

  pay() {
    let data = {
      price: 5
    };
    return this.http.post('http://localhost:3000/pay', data)
      .subscribe(
        (result: any) => {
          window.open(result.link);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
