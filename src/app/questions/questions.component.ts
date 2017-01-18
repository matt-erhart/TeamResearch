import {Component, OnDestroy} from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService }  from '../services/current-user.service' //remember this user
import { QuestionService }     from '../services/question.service';
import * as moment      from 'moment';
import { RouteService } from "../services/route.service";

@Component({
  selector:     'questions',
  templateUrl:  'questions.component.html',
  styleUrls: [  'questions.component.scss']
})

export class QuestionsComponent implements OnDestroy {
  //public anys
  answers; grid_colors; questions; route_sub;
  all_answered; answers_times; error; questions_data;
  questionSetName; analysis_names; instructions; answer_format; answer_tooltip;
  submitButtonText = 'Answer all questions to activate button.';
  //typed
  private user$: FirebaseObjectObservable<any>;
  private route_obs; QS: QuestionService;

  constructor(public af: AngularFire,
              private _routeService: RouteService,
              private _route: ActivatedRoute) {

    this.user$ = af.database.object('/users/' + CurrentUserService.userKey);
    this.route_sub      = this._route.params.subscribe(params => {
      this.questionSetName = params['id'];
      this.QS = new QuestionService();
      this.pick_question_set(this.questionSetName);
    });

  }

  onChange(q){
    this.grid_colors[q] = 'lightgreen';
    this.answers_times[q].unshift(moment().format('YYYY_MMDD_HH:mm:ss:SSS'));
    this.all_answered = this.answers.every(elem => elem !== '');
    if(this.all_answered){
      this.error = "";
      this.submitButtonText = "Click here to submit."
    }
  }

  onSubmit(){
    if (!this.all_answered) {
      this.error="Need to answer all the questions to continue."
    }else {
      this.error = ""
    }

      this.questions_data = this.af.database.object('/users/' + CurrentUserService.userKey +
        "/question_data/" + this.questionSetName);
      this.questions_data.update({
        answers:        this.answers,
        answers_times:  this.answers_times,
        questions:      this.questions,
        analysis_names: this.analysis_names,
      });

      this._routeService.nextPage()
    }

  pick_question_set(id){ //id will be subroute and variable in the question service

    this.instructions      = this.QS[id].instructions;
    this.questions         = this.QS[id].questions;
    this.analysis_names    = this.QS[id].analysis_names;
    this.answer_format     = this.QS[id].answer_format;
    this.answer_tooltip    = this.QS[id].answer_tooltip;

    this.answers       = Array.apply(null, Array(this.questions.length)).map(function () {return ''})
    this.answers_times = Array.apply(null, Array(this.questions.length)).map(function () {return []})
    this.grid_colors   = Array.apply(null, Array(this.questions.length)).map(function () {return 'lightgrey'})

    if (this.answer_format.length===1) {
      this.answer_format = Array.apply(this, Array(this.questions.length)).map(function () {
        return this.answer_text;
      })
    }
  }

  ngOnDestroy(){ //clean up
    if (this.route_sub){
      this.route_sub.unsubscribe();
    }
  }
}
