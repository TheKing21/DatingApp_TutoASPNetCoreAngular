import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { MessagesComponent } from './components/messages/messages.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { ListsComponent } from './components/lists/lists.component';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'members', component: MemberListComponent },
            { path: 'messages', component: MessagesComponent },
            { path: 'lists', component: ListsComponent }
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
