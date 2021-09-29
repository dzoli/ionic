import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlbumPage } from './album.page';

const routes: Routes = [
    {
        path: '',
        component: AlbumPage,
    },
    {
        path: 'camera',
        loadChildren: () => import('./camera/camera.module').then((m) => m.CameraPageModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AlbumPageRoutingModule {}
