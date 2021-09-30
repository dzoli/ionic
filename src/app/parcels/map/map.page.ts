import { Toast } from '@capacitor/toast';
import { Component } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { circle, LayerGroup, Map as LMap, TileLayer } from 'leaflet';
import { BaseLayer } from './BaseLayer.enum';
import { placeLocationMarker } from './placeLocationMarker';
import { Network } from '@capacitor/network';
import { Geolocation } from '@capacitor/geolocation';

import PlaceResult = google.maps.places.PlaceResult;

@Component({
    selector: 'app-map',
    templateUrl: './map.page.html',
    styleUrls: ['./map.page.scss'],
})
export class MapPage {
    public map: LMap;
    public center = [45.2889, 19.7245]; // Novi Sad

    public options = {
        zoom: 12,
        maxZoom: 18,
        zoomControl: false,
        preferCanvas: true,
        attributionControl: true,
        center: this.center,
    };

    public baseMapUrls = {
        [BaseLayer.cycling]: 'http://c.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
        [BaseLayer.transport]: 'http://c.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
        [BaseLayer.osm]: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        [BaseLayer.offline]: './assets/map_test/{z}/{x}/{y}.png',
    };

    public selectedBaseLayer;
    public baseLayer = BaseLayer;
    public locating = false;
    private baseMapLayerGroup = new LayerGroup();
    private locationLayerGroup = new LayerGroup();
    private gpsLoadingEl: HTMLIonLoadingElement;

    constructor(
        private alertController: AlertController,
        private loadingController: LoadingController,
        private toastCtrl: ToastController
    ) {}

    ionViewDidEnter() {
        Network.addListener('networkStatusChange', (status) => {
            console.log('Network status changed', status);
            if (status.connected) {
                this.presentToast('Online mode');
                this.switchBaseLayer(BaseLayer.osm);
            } else {
                this.presentToast('Offline mode');
                this.switchBaseLayer(BaseLayer.offline);
            }
        });
    }

    presentToast(msg: string) {
        this.toastCtrl
            .create({
                message: msg,
                duration: 2000,
            })
            .then((toastEl) => {
                toastEl.present();
            });
    }

    public async onMapReady(lMap: LMap) {
        this.map = lMap;
        this.map.addLayer(this.baseMapLayerGroup);
        this.map.addLayer(this.locationLayerGroup);
        this.switchBaseLayer(BaseLayer.osm);
        setTimeout(() => lMap.invalidateSize(true), 0);
    }

    public switchBaseLayer(baseLayerName: string) {
        if (this.selectedBaseLayer === baseLayerName) {
            return;
        }
        this.baseMapLayerGroup.clearLayers();
        const baseMapTileLayer = new TileLayer(this.baseMapUrls[baseLayerName]);
        this.baseMapLayerGroup.addLayer(baseMapTileLayer);
        this.selectedBaseLayer = BaseLayer[baseLayerName];
    }

    public async locate() {
        this.locationLayerGroup.clearLayers();
        await this.presentLoading();
        Geolocation.getCurrentPosition()
            .then((pos) => {
                this.onLocationSuccess(pos);
            })
            .catch((err) => {
                this.onLocateError(err);
            });
    }

    public showAddressMarker(placeResult: PlaceResult) {
        const formattedAddress = placeResult.formatted_address;
        const [lat, lng] = [placeResult.geometry.location.lat(), placeResult.geometry.location.lng()];
        this.map.setView([lat, lng], 18);
        placeLocationMarker(this.locationLayerGroup, [lat, lng], formattedAddress);
    }

    private onLocationSuccess(position: GeolocationPosition) {
        const { accuracy, latitude, longitude } = position.coords;
        const latlng = [latitude, longitude];
        console.log('onLocationSuccess', position);
        this.hideLoading();
        this.map.setView(latlng, 12);
        const accuracyValue = accuracy > 1000 ? accuracy / 1000 : accuracy;
        const accuracyUnit = accuracy > 1000 ? 'km' : 'm';
        placeLocationMarker(this.locationLayerGroup, latlng, `Accuracy is ${accuracyValue} ${accuracyUnit}`);
        const locationCircle = circle(latlng, accuracy);
        this.locationLayerGroup.addLayer(locationCircle);
    }

    private async onLocateError(error) {
        this.hideLoading();
        const alert = await this.alertController.create({
            header: 'GPS error',
            message: error.message,
            buttons: ['OK'],
        });

        await alert.present();
    }

    private async presentLoading() {
        this.gpsLoadingEl = await this.loadingController.create({
            message: 'Locating device ...',
        });
        await this.gpsLoadingEl.present();
    }

    private hideLoading() {
        this.gpsLoadingEl.dismiss();
    }
}
