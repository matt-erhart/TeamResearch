import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseObjectObservable} from 'angularfire2';
import * as moment from 'moment';
import {CurrentUserService} from "../services/current-user.service";
import {Router} from "@angular/router"
import * as firebase from 'firebase';
@Component({
  selector: 'app-final-page',
  templateUrl: './final-page.component.html',
  styleUrls: ['./final-page.component.scss']
})

export class FinalPageComponent implements OnInit {
  show = true;

  private currentUser$: FirebaseObjectObservable<any>;

  constructor(public _router: Router, public af: AngularFire) {
    this.currentUser$ = this.af.database.object('/users/' + CurrentUserService.userKey)
  }

  ngOnInit() {
    const user_ref = firebase.database().ref("/users/" + CurrentUserService.userKey);
    user_ref.onDisconnect().update({offlineAt: moment().format('YYYY_MMDD_HH:mm:ss:SSS'), isOnline: false})
  }

  nextPage(suggestions, goodStuff){
    this.show = false;
    this.currentUser$.update({currentPage: this._router.url});
    var userTimingLog$ = this.af.database.list('/users/' + CurrentUserService.userKey + '/userTimingLog');
    userTimingLog$.push({clickOnPage: this._router.url,
      clickedNextPageAt: moment().format('YYYY_MMDD_HH:mm:ss:SSS')});
    this.currentUser$.update({
      suggestions: suggestions.value,
      whatTheyLiked: goodStuff.value})
  }
}
