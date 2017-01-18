import { Component, OnInit }   from '@angular/core';
import {CurrentUserService} from "../services/current-user.service";
import {AngularFire} from "angularfire2";
import {RouteService} from "../services/route.service";
import * as moment from 'moment'
import * as firebase from 'firebase';

@Component({
  selector: 'app-compare-sentences',
  templateUrl: './compare-sentences.component.html',
  styleUrls: ['./compare-sentences.component.scss']
})

export class CompareSentencesComponent implements OnInit {


  answer_format = [1,2,3,4,5,6,7];
  answer_tooltip = ['Not at all different',
    'Almost not at all different', 'A little different',
    'Moderately different', 'Very different',
    'Almost completely different',
    'Completely different'];
  answers = [[0,0,0],[0,0,0],[0,0,0]];
  grid_colors = [['lightgrey','lightgrey','lightgrey'],
    ['lightgrey','lightgrey','lightgrey'],
    ['lightgrey','lightgrey','lightgrey']];

  userIdeas = ['','','']; partnerIdeas = ['','','']; ideas = [this.partnerIdeas, this.userIdeas];

  private comparisonInstructions =
     `How different are your ideas to your partners? Rate each pair on a scale from 1 (Not at all different) to 7 (Completely different).`;

  private instructionsTop = `On this page, you will make judgements about`;
  private allAnswered = false;
  private submitButtonText = 'Submit: need to answer all questions.';

  constructor(public af: AngularFire, private _routeService: RouteService) {
  }

  ngOnInit() {
    const user_ref = firebase.database().ref("/users/" + CurrentUserService.userKey);
    user_ref.onDisconnect().update({offlineAt: moment().format('YYYY_MMDD_HH:mm:ss:SSS'), isOnline: false})

    let userIdeas$ = this.af.database.object('/users/' + CurrentUserService.userKey + '/favIdeas');
    userIdeas$.subscribe(ideas => {
         this.userIdeas = ideas;
         this.ideas = [this.partnerIdeas, this.userIdeas];
       }
    );

    let partnerIdeas$ = this.af.database.object('/users/' + CurrentUserService.partnerKey + '/favIdeas');
    partnerIdeas$.subscribe(ideas => {

      this.partnerIdeas = ideas;
      this.ideas = [this.partnerIdeas, this.userIdeas];

    });
  }

  onChange(q1,q){
    this.grid_colors[q1][q] = 'lightgreen';
    var flat_answers = this.answers.reduce(function(a, b) {
      return a.concat(b);
    });
    if (flat_answers.filter(x => x === 0).length === 0){
      this.allAnswered = true;
      this.submitButtonText = 'All answered. Click here to continue'
    }
  }

  onSubmit(){
    if (this.allAnswered) {

      let comparisonData$ = this.af.database.object('/users/' + CurrentUserService.userKey + '/compareIdeasData');
      comparisonData$.set(this.answers);

      var ideaText = [['','',''],['','',''],['','','']];
      for (var i = 0; i < this.ideas[0].length; i++) {
        var obj = this.ideas[0][i];
        for (var j = 0; j < this.ideas[1].length; j++) {
          var obj1 = this.ideas[1][j];
          ideaText[i][j] = obj + ' _vs_ ' + obj1; //matches the data structure. so we know what the data means.
        }
      }

      let comparisonText$ = this.af.database.object('/users/' + CurrentUserService.userKey + '/compareIdeasText');
      comparisonText$.set(ideaText);
      this._routeService.nextPage();
    }
  }
}
