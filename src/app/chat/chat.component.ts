import {Component, OnInit, OnChanges, ElementRef, ViewChild, AfterViewChecked} from '@angular/core';
import {CurrentUserService} from "../services/current-user.service";
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {RouteService} from "../services/route.service";
import {Router} from "@angular/router";
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';
import * as firebase from 'firebase';

@Component({
  selector: 'chat',
  templateUrl: 'chat.component.html',
  styleUrls: [ 'chat.component.scss']
})

export class ChatComponent implements OnInit, OnChanges, AfterViewChecked {
  private secondsLeft = CurrentUserService.chatSeconds;

  roomKey; partnerKey; userKey;
  title = 'Chat';
  instructionsTop = `Using the chat panel, work with your partner to author a new idea for the writing challenge before the timer runs out.
  Create new ideas that blend the strengths of each your three ideas, don't just copy/paste one of them.<br>
  Writing challenge: Write a question that would get your friends on Facebook discussing the challenges and benefits
  of casting a well informed vote. Image you both are going to post one new question to your friends online, which one do you think
  your friends would find most interesting? 
  <br><br> 
  <strong>We will check the chat log to see that each of you followed the instructions and chatted the entire time.</strong>`;

  instructionsChat =  `Discuss the challenge with your partner here.`;
  instructionsFinal = `Your team's idea for the writing challenge:`;
  // private chatMessages$:  FirebaseListObservable<any>;
  private chatMessages$;
  private finalAnswer$:   FirebaseObjectObservable<any>;
  private finalAnswer; finalAnsSub;
  private finalAnswerHistory$: FirebaseListObservable<any>;
  private timesUp = false;
  private duration$;

  userIdeas = ['','','']; partnerIdeas = ['','','']; ideas = [this.partnerIdeas, this.userIdeas];

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  private messages = [''];


  constructor(public  af: AngularFire, public _routeService: RouteService, public _router: Router) {
    // CurrentUserService.roomKey    = '-KQawfBsOPAyar55aQeW';
    // CurrentUserService.userKey    = "-KQawf9fAS91FGd0fhLK";
    // CurrentUserService.partnerKey = "-KQawgm9xT-MeSmixapc";

    this.roomKey         = CurrentUserService.roomKey;
    this.userKey         = CurrentUserService.userKey;
    this.partnerKey      = CurrentUserService.partnerKey;
    // this.chatMessages$          = af.database.list(  '/chat_rooms/'   + this.roomKey + "/chatMessages");
    this.chatMessages$ = af.database.list('/chat_rooms/'   + this.roomKey + "/chatMessages", {query: {
      orderByChild: 'time', //this reverses the order so new messages are on the bottom
    }});
    this.finalAnswer$           = af.database.object('/chat_rooms/'   + this.roomKey + '/finalAnswer');
    this.finalAnswerHistory$    = af.database.list(  '/chat_rooms/'   + this.roomKey + '/finalAnswerHistory');
  }

  ngOnInit() {
    // alert("Chat ready. Please continue.");
    const user_ref = firebase.database().ref("/users/" + CurrentUserService.userKey);
    user_ref.onDisconnect().update({offlineAt: moment().format('YYYY_MMDD_HH:mm:ss:SSS'), isOnline: false});

    let second = 1000;
    this.duration$ = Observable.interval(second)
       .subscribe(_ =>{
         this.secondsLeft = this.secondsLeft-1;
         if (this.secondsLeft < 0) {
           this.secondsLeft = 0;
           this.timesUp = true;

           this.finalAnsSub = this.finalAnswer$.subscribe(x => {
             if (x.$value !== null && x.$value !== '') {
               this._routeService.nextPage();
             }
           });

           this.duration$.unsubscribe();
         }
       });



    let currentPage$ = this.af.database.object('/users/' + CurrentUserService.userKey + '/currentPage');
    currentPage$.set(this._router.url);

    this.finalAnswer$.subscribe(x => {
      this.finalAnswer = x.$value;
    });

    let userIdeas$ = this.af.database.object('/users/' + CurrentUserService.userKey + '/favIdeas');
    userIdeas$.subscribe(ideas => {
      this.userIdeas = ideas;
      this.ideas = [this.partnerIdeas, this.userIdeas];
      // console.log("user ideas", this.ideas)
    }
  );

  let partnerIdeas$ = this.af.database.object('/users/' + CurrentUserService.partnerKey + '/favIdeas');
  partnerIdeas$.subscribe(ideas => {
  this.partnerIdeas = ideas;
  this.ideas = [this.partnerIdeas, this.userIdeas];
  // console.log("partner ideas", this.ideas)
});
}

ngAfterViewChecked(){
  this.scrollToBottom();
}

ngOnChanges(){
  if (this.timesUp && this.finalAnswer !== '') {
    // console.log("would route")
  }
    this.scrollToBottom();
  }

  onMessageEnter(chatMessage){
    this.chatMessages$.push({userKey: this.userKey, message: chatMessage, time: firebase.database.ServerValue.TIMESTAMP});
    this.scrollToBottom()
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.log(err)
    }
  }

  onSubmit(bestIdea) {
    const finalAnswer_ref = firebase.database().ref('/chat_rooms/'   + this.roomKey + '/finalAnswer');
    finalAnswer_ref.transaction(_ => { //this is atomic
      return bestIdea;
    });
  }

  ngOnDestroy(){
    this.finalAnsSub.unsubscribe();
  }

}
