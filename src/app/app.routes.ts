import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CheckoutComponent } from './components/checkout/checkout.component';



export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
    },
    {
        path: 'checkout',
        component: CheckoutComponent
    }
];
