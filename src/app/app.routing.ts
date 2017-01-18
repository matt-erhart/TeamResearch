/**
 * Created by me on 9/18/2016.
 */
import {Router, RouterModule} from '@angular/router'

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { GatherComponent } from './gather/gather.component';
import { CompareSentencesComponent } from './compare-sentences/compare-sentences.component';
import { FinalPageComponent } from './final-page/final-page.component';
import { QuestionsComponent } from './questions/questions.component';
import { IdeateComponent } from './ideate/ideate.component';


export const routing = RouterModule.forRoot([
{ path:'',                    component: AppComponent},
{ path:'login',               component: LoginComponent},
{ path:'questions/:id',       component: QuestionsComponent},
{ path:'chat/:id',            component: ChatComponent},
{ path:'ideate',              component: IdeateComponent},
{ path:'gather/:id',          component: GatherComponent},
{ path:'compare-sentences/:id',    component: CompareSentencesComponent},
{ path:'final-page',               component: FinalPageComponent}

]);