import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParcelsPage } from './parcels.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: ParcelsPage,
        children: [
            {
                path: 'album',
                loadChildren: () => import('./album/album.module').then((m) => m.AlbumPageModule),
            },
            {
                path: 'map',
                loadChildren: () => import('./map/map.module').then((m) => m.MapPageModule),
            },
            {
                path: '',
                redirectTo: '/parcels/tabs/album',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '',
        redirectTo: '/parcels/tabs/album',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ParcelsPageRoutingModule {}
