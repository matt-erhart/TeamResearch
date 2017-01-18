import { Injectable } from '@angular/core';
import {CurrentUserService} from './current-user.service'
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import * as moment from 'moment';
import {Router} from "@angular/router";
import * as firebase from 'firebase';

@Injectable()
export class RouteService {
  private currentUser$: FirebaseObjectObservable<any>;

  constructor(public af: AngularFire, private _router:Router) {
  }

  nextPage() {
    this.currentUser$ = this.af.database.object('/users/' + CurrentUserService.userKey)

    if (!CurrentUserService.roomKey) {
      var room = 'tba'
    } else {
      var room = CurrentUserService.roomKey
    }

    let pageOrder = [
        '/',
        '/login',
        '/gather/rollCallIfEnough',
        '/gather/teamFormation',
        '/gather/partners1',
        '/questions/personality',
        '/questions/social_media',
        '/questions/demographics',
        '/gather/partners2',
        '/questions/creative_self_efficacy',
        '/questions/creative_writing',
        '/gather/partners3',
        '/ideate',
        '/gather/partners4',
        '/chat' + '/'   + room,
        '/questions/post_survey',
        '/final-page'
      ];

    let nextPage = pageOrder[pageOrder.indexOf(this._router.url) + 1];
    let pageIndex = pageOrder.indexOf(nextPage);
    console.log('nextPage', nextPage);
    if (CurrentUserService.partnerKey){
      this.af.database.object('/users/' + CurrentUserService.partnerKey).update({partnerPage: nextPage, partnerPageIndex: pageIndex});
    }
    this.currentUser$.update({currentPage: nextPage, currentPageIndex: pageIndex});
    var userTimingLog$ = this.af.database.list('/users/' + CurrentUserService.userKey + '/userTimingLog');
    userTimingLog$.push({clickOnPage: this._router.url,
      clickedNextPageAt: moment().format('YYYY_MMDD_HH:mm:ss:SSS')});
    this._router.navigate([nextPage]); // ROUTE

  }

}
