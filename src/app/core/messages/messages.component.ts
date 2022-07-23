import { CoreService, Message } from './../core.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  message: string;
  errorMessageClass: string = 'msg-error';
  private sub: Subscription;

  constructor(private coreService: CoreService) {

   }


  ngOnInit() {
    this.sub = this.coreService.getMessage().subscribe(
      (message: Message) => {
        console.log ('New message received', message.msg);
        if (message?.msg) {
          this.message = message.msg;
          this.errorMessageClass = message.msgClass;
        }else {
          this.message = null;
        }

      }, err=> {
        console.log('Error in message subscription', err);
      });
  }

  close() {
    this.message = null;
  }

  ngOnDestroy(): void {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

}
