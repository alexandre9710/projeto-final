import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { LancamentoComponent } from './lancamento/lancamento.component';


export const routes: Routes = [
    {path: "", pathMatch: 'full', redirectTo: 'login'},
    {path:'login', component: LoginComponent},
    {path:'home', component: HomeComponent},
    {path:'lancamento', component: LancamentoComponent},
    {path:'dashboard', component: DashboardComponent}
];
