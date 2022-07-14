import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footerPublic',
  templateUrl: './footerPublic.component.html',
  styleUrls: ['./footerPublic.component.scss']
})
export class FooterPublicComponent implements OnInit {
  test: Date = new Date();
  constructor() { }

  ngOnInit() {
  }

}
