import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import * as Email from 'nativescript-email';
import { DrawerPage } from '../shared/drawer/drawer.page';


@Component({
  selector: 'app-contact',
    moduleId: module.id,
  templateUrl: './contact.component.html'
//  styleUrls: ['./contact.component.css']
})

export class ContactComponent extends DrawerPage {


  constructor(private changeDetectorRef:ChangeDetectorRef,
    private fonticon: TNSFontIconService,
    @Inject('BaseURL') private BaseURL) {
      super(changeDetectorRef);
    }

    sendEmail() {
      Email.available()
        .then((avail: boolean) => {
          if (avail) {
            Email.compose({
              to: ['confusion@food.net'],
              subject: '[ConFusion]: Query',
              body: 'Dear Sir/Madam:'
            });
          }
          else
            console.log('No Email Configured');
        })
    }


}
