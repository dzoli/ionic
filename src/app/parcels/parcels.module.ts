import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParcelsPageRoutingModule } from './parcels-routing.module';

import { ParcelsPage } from './parcels.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParcelsPageRoutingModule
  ],
  declarations: [ParcelsPage]
})
export class ParcelsPageModule {}
