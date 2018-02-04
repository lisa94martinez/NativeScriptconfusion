import { Component, OnInit, Inject, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";
import { Page } from "ui/page";
import { Animation, AnimationDefinition } from "ui/animation";
import { View } from "ui/core/view";
import { SwipeGestureEventData, SwipeDirection } from "ui/gestures";
import { DatePipe } from '@angular/common';
import * as enums from "ui/enums";
import { CouchbaseService } from '../services/couchbase.service';

@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html'
})

export class ReservationComponent extends DrawerPage implements OnInit {

    reservation: FormGroup;
    textGuests: View;
    textDateTime: View;
    smoking: View;
    reservationLayout: View;

    showReservation: boolean = false;

    reservations: Array<any>;
    docId: string = "reservations";


    constructor(private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private modalService: ModalDialogService,
        private vcRef: ViewContainerRef,
        private couchbaseService: CouchbaseService,
        private page: Page) {
            super(changeDetectorRef);

            this.reservation = this.formBuilder.group({
                guests: 3,
                smoking: false,
                dateTime: ['', Validators.required]
            });

            this.reservations = [];

            let doc = this.couchbaseService.getDocument(this.docId);
            if( doc == null) {
              this.couchbaseService.createDocument({"reservations": []}, this.docId);
            }
            else {
              this.reservations = doc.reservations;
            }
    }

    ngOnInit() {

    }

    onSmokingChecked(args) {
        let smokingSwitch = <Switch>args.object;
        if (smokingSwitch.checked) {
            this.reservation.patchValue({ smoking: true });
        }
        else {
            this.reservation.patchValue({ smoking: false });
        }
    }

    onGuestChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ guests: textField.text});
    }

    onDateTimeChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ dateTime: textField.text});
    }

    createModalView(args) {
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: args,
            fullscreen: false
        };

        this.modalService.showModal(ReservationModalComponent, options)
            .then((result: any) => {
                if (args === "guest") {
                    this.reservation.patchValue({guests: result});
                }
                else if (args === "date-time") {
                    this.reservation.patchValue({ dateTime: result});
                }
            });
    }

    addReservation(reserv: any): void {
      this.reservations.push(reserv);
      this.couchbaseService.updateDocument(this.docId, {"reservations": this.reservations});
    }

    showDocument(docId: string){
      let doc = this.couchbaseService.getDocument(this.docId);
      console.log(JSON.stringify(doc));
    }

    onSubmit() {
        console.log("This is the first reservation");
        console.log(JSON.stringify(this.reservations));

        this.hideForm();
        this.showDocument('reservations');
        this.addReservation(this.reservation.value);
        this.showDocument('reservations');
    }

    hideForm(){
      this.reservationLayout = <View>this.page.getViewById<View>("reservationLayout");

      let definitions = new Array<AnimationDefinition>();
      let a1: AnimationDefinition = {
          target: this.reservationLayout,
          scale: { x: 0, y: 0 },
          opacity: 0,
          duration: 1500,
          curve: enums.AnimationCurve.easeIn
      };

      let a2: AnimationDefinition = {
          target: this.reservationLayout,
          scale: { x: 1, y: 1 },
          opacity: 1,
          duration: 1500,
          curve: enums.AnimationCurve.easeIn
      };

      definitions.push(a1);
      let animationSet = new Animation(definitions);
      animationSet.play().then(() => {

            this.showReservation = true;
            definitions.push(a2);
            let animationSet2 = new Animation(definitions);
            animationSet2.play().then(() => {
            })
            .catch((e) => {
                console.log('displayReservation Error');
            });

      })
      .catch((e) => {
          console.log('hideForm error');
      });
    }

}
