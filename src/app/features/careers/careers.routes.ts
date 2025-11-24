import { Routes } from '@angular/router';
import { CareerListContainerComponent } from './pages/career-list-container/career-list-container.component';
import { CareerDetailPageComponent } from './pages/career-detail-page/career-detail-page.component';

export const CAREERS_ROUTES: Routes = [
    {
        path: '',
        component: CareerListContainerComponent
    },
    {
        path: ':id',
        component: CareerDetailPageComponent
    }
];
