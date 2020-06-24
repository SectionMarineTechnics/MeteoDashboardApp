import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.css']
})
export class DisclaimerComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  closeForm(){
    this.router.navigateByUrl('/');
  }

  ShowOtaryWebSite() {
    let url: string = "https://www.otary.be"
    window.open(url, "_blank");
  }

  ShowEngieWebSite() {
    let url: string = "https://www.engie-fabricom.com/"
    window.open(url, "_blank");
  }
}
