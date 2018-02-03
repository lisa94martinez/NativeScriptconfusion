import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { Page } from 'ui/page';
import { Slider } from "ui/slider";
import { TextField } from 'ui/text-field';

@Component({
    selector: 'app-comment',
    moduleId: module.id,
    templateUrl: './comment.component.html'
})

export class CommentComponent implements OnInit {

  feedbackForm:FormGroup;
  comment: Comment;
  dish: Dish;

  constructor(private page: Page,
    private params: ModalDialogParams,
      private formBuilder: FormBuilder) {


      this.feedbackForm = this.formBuilder.group({
        author: ['', [Validators.required, Validators.minLength(2)] ],
        comment: ['', Validators.required],
        rating: 5
      });
  }

  ngOnInit() {

    this.dish = this.params.context;

  }


  onSliderValueChange(args) {
      let slider = <Slider>args.object;

      this.feedbackForm.patchValue({ rating: slider.value});

  }

  onAuthorChange(args) {
      let textField = <TextField>args.object;

      this.feedbackForm.patchValue({ author: textField.text});
  }

  onCommentChange(args) {
      let textField = <TextField>args.object;

      this.feedbackForm.patchValue({ comment: textField.text});
  }

  onSubmit() {
    this.comment = this.feedbackForm.value;
    this.comment.date = new Date().toISOString();
    console.log('CommentsPage - onSubmit - this.dish.id = ', this.dish.id);
    this.params.closeCallback(this.comment);
  }
}
