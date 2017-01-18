import {Component, OnInit} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'app works!';
  public broadcast$: FirebaseObjectObservable<any>;

  constructor (af: AngularFire, private _router: Router){
    this.broadcast$ = af.database.object('/broadcast');
  }

  ngOnInit() {
    this._router.navigate(['/login']);
  }
}
