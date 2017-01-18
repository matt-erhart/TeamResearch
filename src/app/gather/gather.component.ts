import {Component, OnInit} from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {Observable, Subject} from 'rxjs/Rx';
// declare var firebase: any;
import * as moment from 'moment';
import * as firebase from 'firebase';

import {RouteService} from "../services/route.service";
import {Router, ActivatedRoute} from "@angular/router";
import {CurrentUserService} from "../services/current-user.service";
declare var Notification: any;

@Component({
  selector: 'app-gather',
  template: `
    <h1> {{text2Show}} </h1>
    <button *ngIf="showButtons" class="btn btn-success" (click)="continueCancelButton.next($event)" id="continue" name="continue">Start Bonus Task</button>
    <button *ngIf="showButtons" class="btn btn-danger"  (click)="continueCancelButton.next($event)" id="cancel" name="cancel">Leave</button>
    `
})
export class GatherComponent implements OnInit {
  private users$: FirebaseListObservable<any>;
  private currentUser$: FirebaseObjectObservable<any>;

  currentUserKey;
  private continueCancelButton;
  private showButtons = false;
  private text2Show = '';
  private rollCallResponse;
  private waitForRespTime;
  private cohortSize;
  private teamSize;

  constructor(public af: AngularFire, public _routeService: RouteService, private _router:Router, private route: ActivatedRoute) {
    this.users$ = af.database.list('/users')
  }

  ngOnInit() {
    this.currentUserKey = CurrentUserService.userKey;
    this.currentUser$ = this.af.database.object('/users/' + this.currentUserKey);
    console.log('currentUser', CurrentUserService.userKey);
    const user_ref = firebase.database().ref("/users/" + this.currentUserKey);
    user_ref.onDisconnect().update({time_offline: moment().format('YYYY_MMDD_HH:mm:ss:SSS'), userState: 'offline', debug: this.currentUserKey});


    this.waitForRespTime = 25*1000;
    this.currentUserKey = CurrentUserService.userKey;
    this.cohortSize = 2;
    this.teamSize   = 2;

    this.route.params.filter(params =>  params['id'] === 'rollCallIfEnough').take(1).subscribe(params => this.rollCallIfEnough());
    this.route.params.filter(params =>  params['id'] === 'teamFormation').take(1).subscribe(params    => this.teamFormation());


    //wait for partner to be on the same page
    // partnerAhead, partnerBehind, partnerSame?
    this.currentUser$.do(user => console.log('partner/user page index', user.partnerPageIndex, user.currentPageIndex))
       .do(user => {
         if (user.partnerPage) {this.text2Show = "Please wait for your partner to finish up page: " + user.partnerPage}
       })
       .filter(user => /partner/.test(user.currentPage) && user.partnerPageIndex >= user.currentPageIndex).take(1)
    .subscribe(user => {

      console.log('user waiting:', user)
      this._routeService.nextPage()
    });

  }
  // let partner$ = this.af.database.object('/users/' + CurrentUserService.partnerKey)
  //  .do(partner=>this.text2Show='Waiting for your partner to finish up.')
  //  .filter(partner=>partner.userState==='offline' || partner.currentPage.split('/')[2] === params['id'])
  //  .take(1).subscribe( partner => {
  //    if (partner.currentPage.split('/')[2] === params['id']) {//todo: or the next page, maybe a list?
  //      console.log('partner', partner);
  //      this.text2Show = 'Ready. Moving forward.';
  //      this._routeService.nextPage()
  //    }
  //    if (partner.userState === 'offline') {
  //      this.text2Show = 'Your teammate left. You can close this window.';
  //    }
  //  })
  teamFormation(){
    this.cohortSize = CurrentUserService.numSinglesNeeded;
    this.teamSize   = CurrentUserService.teamSize;
    let lastOdd: boolean;
    // const stop$    = Observable.timer(1000).take(1);
    // const lastOdd$ = this.regexGetList('users', 'userState', /startExperiment/).filter(list=>list.length>=this.teamSize)
    //    .do(x=>console.log('length',x.length)).takeUntil(stop$)
    //    .map(keys=>((keys.indexOf(this.currentUserKey)+1)===keys.length && (keys.length%2!=0)))// keys.indexOf(this.currentUserKey)+1===keys.length &&
    //    .do(bool=>lastOdd=bool).take(1).do(x=>console.log('lastodd',x));

    //at this point we have an even amount of people
    const stillWithUs = this.regexGetList('users', 'userState', /startExperiment/).do(x=>console.log('indexof',x))
       .filter(list=>list.length>=2).take(1)
       .do(cohort=> {
/// THIS IS WHERE TEAM FORMATION HAPPENS
         let userPosition = cohort.indexOf(this.currentUserKey);
         if (userPosition%2 === 0){
           let partnerKey = cohort[userPosition+1];
           //noinspection TypeScriptUnresolvedVariable
           let roomKey = this.af.database.list('/chat_rooms').push({creator: this.currentUserKey, joiner: partnerKey }).key;
           this.af.database.object('/users/' + this.currentUserKey).update({roomKey: roomKey, partnerKey: partnerKey, userState: 'matched'});
           this.af.database.object('/users/' + partnerKey).update({roomKey: roomKey, partnerKey: this.currentUserKey, userState: 'matched'});
           CurrentUserService.partnerKey = partnerKey;
           CurrentUserService.roomKey = roomKey;
           //todo: route to next page
           console.log('route creator');
           this._routeService.nextPage();

         } else {
           let partnerKey = cohort[userPosition-1];
           this.af.database.object('/users/' + this.currentUserKey + '/userState')
              .filter(state => state.$value==='matched').take(1).subscribe(state => {
             this.af.database.object('/users/' + this.currentUserKey).take(1).subscribe(user =>{
               CurrentUserService.partnerKey = user.partnerKey;
               CurrentUserService.roomKey    = user.roomKey;
             });
             console.log('route joiner');
             this._routeService.nextPage();

           });
         };
       });

    const teamFormationSteam$ = Observable.concat(stillWithUs).subscribe(stream => { //todo: add lastodd detection for larger groups
      if (lastOdd){
        this.text2Show = 'last odd';
        this.af.database.object('/users/' + this.currentUserKey).update({userState: 'offline'});
      } else {
        this.text2Show = 'Matching you up now. One moment.';
      }
    })
  }

  rollCallIfEnough(){
    this.text2Show = 'Waiting for more people to join in. A popup will tell you when the bonus group task is starting. You can do other things while this'+
       ' website is open in the background.';

    this.af.database.object('/users/' + CurrentUserService.userKey + '/userState').set('single');
    this.cohortSize = CurrentUserService.numSinglesNeeded;
    this.teamSize   = CurrentUserService.teamSize;
    this.continueCancelButton = new Subject();
    this.continueCancelButton.map(x=> x.target.id || x.srcElement.id);

    const singles$ = this.af.database.list('/users', {query: {orderByChild: 'userState', equalTo: 'single'}});

    const ifEnoughSingles$ = this.oneStateCount('users', 'userState', 'single').filter(x=>x === this.cohortSize).map(x=>'have enough. start rollCall').take(1);

    const respondOrTimeout$ = Observable.merge(
       Observable.timer(120*1000).map(x=>'times up. no response.').take(1),
       this.continueCancelButton.map(event=> event.target.id || event.srcElement.id).take(1)
    ).take(1);

    //todo: store current user response here
    const allResponded$ = this.regexGetList('users', 'userState', /rollCall/).map(x=>x.length).filter(count=>count===this.cohortSize).take(1).map(x=>'all responded');
    const numReady$     = this.oneStateCount('users', 'userState', 'rollCallContinue').do(x=>console.log(x)).take(1);

    const rollCallStream$ = Observable.concat(
       ifEnoughSingles$,
       respondOrTimeout$,
       allResponded$,
       numReady$
    ).subscribe(stage=> { //todo: structure responded and response, maybe exists?
      console.log('stage', stage);
      if (stage === 'have enough. start rollCall') {
        this.af.database.object('/users/' + this.currentUserKey + '/userState').set('checkReady');
        this.showButtons = true;
        this.text2Show = 'Ready to start the group bonus task?'
        this.showDesktopNotification();
      }
      if (stage === 'times up. no response.') {
        this.rollCallResponse = 'timeout';
        this.af.database.object('/users/' + this.currentUserKey + '/userState').set('rollCallTimeout');
        this.showButtons = false;
        this.text2Show = 'Group task already started. You can close this window.'
      }
      if (stage === 'continue') {
        this.rollCallResponse = 'continue';
        this.af.database.object('/users/' + this.currentUserKey + '/userState').set('rollCallContinue');
        this.showButtons = false;
        this.text2Show = 'Great! Getting people together now.'
      }
      if (stage === 'cancel') {
        this.rollCallResponse = 'cancel';
        this.af.database.object('/users/' + this.currentUserKey + '/userState').set('rollCallCancel');
        this.showButtons = false;
        this.text2Show = 'Thanks for waiting! You can close this window.'
      }

      if (Number(stage)){
        // console.log('is number',stage);
        if (stage >= 2){
          this.text2Show = 'Starting Experiment';
          this.af.database.object('/users/' + this.currentUserKey + '/userState').set('startExperiment');
          this._routeService.nextPage();
        } else {
          this.text2Show = 'Did not get enough people. You can close this window.';
          this.af.database.object('/users/' + this.currentUserKey + '/userState').set('offline'); //todo: recycle user
        }
      }
    });
  }


  addUser(event) {
    this.currentUserKey = this.users$.push({
      userState: 'single',
      time_login: firebase.database.ServerValue.TIMESTAMP
    }).key;
  }

  oneStateCount(list, key, state2Count): Observable<number> { //this one is more server side/efficient
    return Observable.create(observer => {
      let ref = firebase.database().ref(list);
      let listener = ref.orderByChild(key).equalTo(state2Count)
         .on("value", snapshot => {
           observer.next(snapshot.numChildren())
         }, observer.error);
      return () => {
        ref.off('value', listener);
      };
    });
  }

  regexGetList(list, key, regexPat) { //this one downloads the entire users tree
    return Observable.create(observer => {
      let ref = firebase.database().ref(list);
      let listener = ref.orderByKey().on("value", snapshot => {
        let list = [];
        console.log('snapshot', snapshot)
        snapshot.forEach(function (childSnapshot) {
          // console.log('key', childSnapshot.key, 'val()', childSnapshot.val());
          if (regexPat.test(childSnapshot.val()[key])) {
            list.push(childSnapshot.key);
          }
          return false;
        });
        observer.next(list);
      }, observer.error);
      return () => {
        ref.off('value', listener);
      }
    });
  }

  showDesktopNotification() {
    var date = new Date()
       ,  time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    Notification.requestPermission(function (perm) {
      if (perm == "granted") {
        var audio = new Audio();
        audio.src = "assets/bells.mp3";
        audio.load();
        audio.play();
        var notification = new Notification("Click here within two minutes for the group bonus task!", {
          dir: "auto",
          lang: "hi",
          tag: "testTag"+date.getTime(),
          icon: "assets/notification.png",
          body: time
        });
        notification.onclick = function () {
          window.focus();
          notification.close();
        };
      }
    })
  }


}


