import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FAQTitleService } from 'src/app/shared/services/FAQTitle/FAQTitle.service';
import { FAQCategoriesService } from 'src/app/shared/services/FAQCategories/FAQCategories.service';



@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  imgLogo = 'assets/img/logo/SKMM-MCMC-2014.png'
  test: Date = new Date();
  infoTable = []
  searchFAQForm: FormGroup
  value = ''
  isFirstOpen = true;

  @ViewChild('formRegistration') formRegistration: ElementRef;
  registerForm: FormGroup
  registerFormMessages = {
    'faq_categories': [
      { type: 'requirement', message: 'Attachment (official letter from government agency is required)' }
    ]
  }

  constructor(
    private router: Router,
    private FAQTitleService: FAQTitleService,
    private FAQCategoriesService: FAQCategoriesService,
  ) { 
    this.productGeneration2()
  }

  ngOnInit() {
  }

  navigatePage(path: String) {
    if (path == 'menu') {
      return this.router.navigate(['/global/public'])
    }
  }

  productGeneration() {
    this.FAQTitleService.get().subscribe(
      (res) => {
        this.infoTable = [...res]
        console.log("zzzzz = ",this.infoTable)
        // let qweqwe = []
        // this.infoTable.forEach( function(data){
        //   console.log('col- - ',data)
        //   qweqwe.push(data)

        // })
        // this.chartDataField = qweqwe
        // console.log('bbbbbbb = ',this.chartDataField)
        // this.calculateCharts()

        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key
          };
        });
        // console.log("xxxxxx = ",this.infoTable)
      },
      (err) => {
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
      () => {
        console.log("HTTP request completed.")
      //   this.infoTable = [res]
      //   console.log("zzzzz = ",this.infoTable)
      }
    );
  }

  productGeneration2() {
    this.FAQCategoriesService.filter("active=true").subscribe(
      (res) => {
        this.infoTable = [...res]
        console.log("zzzzz2 = ",this.infoTable)
        // let qweqwe = []
        // this.infoTable.forEach( function(data){
        //   console.log('col- - ',data)
        //   qweqwe.push(data)

        // })
        // this.chartDataField = qweqwe
        // console.log('bbbbbbb = ',this.chartDataField)
        // this.calculateCharts()

        this.infoTable = this.infoTable.map((prop, key) => {
          return {
            ...prop,
            id: key
          };
        });
        // console.log("xxxxxx = ",this.infoTable)
      },
      (err) => {
        // this.loadingBar.complete();
        // this.errorMessage();
        // console.log("HTTP Error", err), this.errorMessage();
      },
      () => {
        console.log("HTTP request completed.")
      //   this.infoTable = [res]
      //   console.log("zzzzz = ",this.infoTable)
      }
    );
  }

  dropdownFAQ(event){
    console.log('event = ',event)
  }
}
