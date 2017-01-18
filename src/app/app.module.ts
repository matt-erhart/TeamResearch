import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import {AlertModule, ButtonsModule, TooltipModule} from 'ng2-bootstrap/ng2-bootstrap';
import * as firebase from 'firebase'
import * as moment from 'moment'
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { GatherComponent } from './gather/gather.component';
import { CompareSentencesComponent } from './compare-sentences/compare-sentences.component';
import { FinalPageComponent } from './final-page/final-page.component';
import { QuestionsComponent } from './questions/questions.component';
import { IdeateComponent } from './ideate/ideate.component';
import { routing } from './app.routing'
import { CurrentUserService } from  "./services/current-user.service";
import { RouteService } from        "./services/route.service";

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyCTSnOMhCok46tyX8UO29_4YjMtr_g1ve0",
  authDomain: "interactive-e6fad.firebaseapp.com",
  databaseURL: "https://interactive-e6fad.firebaseio.com",
  storageBucket: "interactive-e6fad.appspot.com"
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GatherComponent,
    CompareSentencesComponent,
    ChatComponent,
    QuestionsComponent,
    FinalPageComponent,
    IdeateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AlertModule.forRoot(), TooltipModule.forRoot(), ButtonsModule.forRoot(),
    routing
  ],
  providers: [CurrentUserService, RouteService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }