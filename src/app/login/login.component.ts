import {Component, OnInit} from '@angular/core';
import { AngularFire, FirebaseListObservable} from 'angularfire2';
import * as moment from 'moment';
import {CurrentUserService} from "../services/current-user.service";
import {RouteService} from "../services/route.service";
declare var Notification;

@Component({
  selector:    'app-login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.scss' ],
  providers: [RouteService]
})

export class LoginComponent implements OnInit {
  users$: FirebaseListObservable<any>;
  public currentUser;
  chatDuration = CurrentUserService.chatSeconds/60;
  ideationDuration = CurrentUserService.ideateSeconds/60;
  totalDuration = this.chatDuration+this.ideationDuration+5;
  mturkID = ''; //ngmodel
  debug;
  title = 'login';

  constructor(public   af: AngularFire, public _routeService: RouteService) {
    this.users$ = af.database.list('/users');
  }

  ngOnInit() {
    this.showDesktopNotification();
  }

  instructionsTop =
     `      Here's what you will do in this HIT: <br><br>
            <ul>
                <li>Read the consent text bellow.</li>
                <li>Allow notifications. Get your survey code in the first notification. </li>
                <li>Accept and submit HIT to get standard payment and be in the mturk bonus system.</li>
                <li>Enter turkID bellow</li>
                <li>Wait for the bonus task notification and sound.</li>
                <li>Brainstorm alone for ` + Math.round(this.ideationDuration) + ` minutes</li>
                <li>Answer a few short surveys</li>
                <li>Work with your partner in a chatroom for ` + Math.round(this.chatDuration) + ` minutes</li>
                <li>Give us some feedback</li>
            </ul>
            <br>
        We expect this will be about ` + Math.round(this.totalDuration) + ` minutes of active
        work plus a few minutes or more of waiting for
            your partner. <strong> You can do other things while waiting.</strong>
            This window just needs to be open in the background.
            A pop-up will tell you when the partner bonus task is starting.  <br><br>
        Remember to <strong>accept and submit the HIT</strong> on the MTurk site now before starting.
        Accepting/submitting the HIT is required for you to get the standard payment and for it to be possible for us to
        bonus you. <br>
          <p class=MsoNormal><span style='letter-spacing:-.15pt'><strong>If you are over 18 years
          old, have read and understand all information on this page, and want to participate in
          this research and continue, then enter your Mechanical Turk ID 
          to begin.</strong></span></p>
`;

  nextPage() {
    //login
    if (this.mturkID.length < 1){
      window.location.reload();
    } else {
      //noinspection TypeScriptUnresolvedVariable
      let currentUserKey = this.users$.push({
        mturkID: this.mturkID,
        time_login: moment().format('YYYY_MMDD_HH:mm:ss:SSS'),
        browserInfo: window.navigator.appVersion
      }).key;
      CurrentUserService.userKey = currentUserKey;
      this._routeService.nextPage();
    }
  }

  showDesktopNotification() {
  var date = new Date()
     ,  time = 'Enter this time as the survey code: ' + date.getHours() + ":" + date.getMinutes();

  Notification.requestPermission(function (perm) {
    var audio = new Audio();
    audio.src = "assets/bells.mp3";
    audio.load();
    audio.play();
    if (perm == "granted") {
      var notification = new Notification("Notification on! ", {
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