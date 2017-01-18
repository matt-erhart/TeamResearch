import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import { CurrentUserService } from  "../services/current-user.service";
import { RouteService } from        "../services/route.service";
import { Observable } from 'rxjs/Rx';
import { Router } from  "@angular/router";
import * as moment from 'moment';
import * as firebase from 'firebase';

@Component({
  selector:    'ideate',
  templateUrl: 'ideate.component.html',
  styleUrls: [ 'ideate.component.scss']
})

export class IdeateComponent implements OnInit {
  private numIdeas = 0;
  private secondsLeft = CurrentUserService.ideateSeconds;
  private timesUp = false;
  private numIdeas2Select = 3;
  private ready2submit;
  private duration$;
  private favoriteIdeas;

instructionsTop = `
  In the 2012 US election, 62% of 18-24 year olds did not vote. 30% of those 65 and older did not vote.
  Research has shown that simply discussing the challenges and benefits of voting with a non-voter is
  the best way to get them to vote.
  <br><br>
  So, we want you to write questions that would get your friends on Facebook discussing the challenges and benefits
  of casting a well informed vote. Try to write interesting, novel questions that your friends haven't heard before and would enjoy discussing.
  
  For example, a common discussion question is 'Does your vote matter?' A more novel question would be, for example, 
  'Two friends learn their votes would perfectly cancel out, why should they vote?' One asks a yes/no question while the 
  other presents something novel, requires people to think about trade-offs, and asks for explanations.
  
  <br><br>
  Write as many discussion question ideas as you can for ` + (this.secondsLeft/60) + ` minutes. `;

  private ideas = {
    text: [],
    favorite: []
  };


  constructor(public af: AngularFire, public _routeService: RouteService, public _router: Router) {
  }

  ngOnInit() {
    // alert("Time to brainstorm!");
    const user_ref = firebase.database().ref("/users/" + CurrentUserService.userKey);
    user_ref.onDisconnect().update({offlineAt: moment().format('YYYY_MMDD_HH:mm:ss:SSS'), isOnline: false})

    let currentPage$ = this.af.database.object('/users/' + CurrentUserService.userKey + '/currentPage');
    currentPage$.set(this._router.url);

    let second = 1000;
    this.duration$ = Observable.interval(second)
                      .subscribe(_ =>{
                        this.secondsLeft = this.secondsLeft-1;
                        if (this.secondsLeft <= 0) {
                          this.secondsLeft = 0;
                          this.timesUp = true;
                          this.duration$.unsubscribe();
                        }
                      });
  }

  onEnter(idea){
    this.ideas.text.push(idea);
    this.ideas.favorite.push(false);
    this.numIdeas++;
  }

  onChange(i,event){
    this.ideas.favorite[i] = event; // shouldn't be necessary due to ngmodel
    var trues = this.ideas.favorite.filter(f => f == true);
    this.favoriteIdeas = this.getAllFavorites(this.ideas);
    if (trues.length === this.numIdeas2Select){
      this.ready2submit = true;
    } else {
      this.ready2submit = false;
    }
  }

  onSubmit(){
    let idea_obj = {
      userKey: CurrentUserService.userKey,
      ideas: this.favoriteIdeas};

    let userPath = '/users/' + CurrentUserService.userKey;

    let allIdeas$ = this.af.database.object(userPath + '/ideas');
    allIdeas$.set(this.ideas);

    let favIdeas$ = this.af.database.object(userPath + '/favIdeas');
    favIdeas$.set(this.favoriteIdeas);

    this._routeService.nextPage();
  }

  getAllFavorites(ideas) {
  var favIdeas = []; var i;
    for(i = 0; i < ideas.favorite.length; i++){
      if (ideas.favorite[i] === true)
        favIdeas.push(ideas.text[i]);
    }
  return favIdeas;
  }
}
