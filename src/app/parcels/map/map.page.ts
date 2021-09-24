import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-map',
    templateUrl: './map.page.html',
    styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
    @ViewChild('googleMap') gmapElement: any;
    map: google.maps.Map;

    constructor() {}

    ionViewDidEnter() {
        var mapProp = {
            center: new google.maps.LatLng(28.4595, 77.0266),
            zoom: 14,
            // mapTypeId: google.maps.MapTypeId.ROADMAP
            mapTypeId: google.maps.MapTypeId.HYBRID,
            // mapTypeId: google.maps.MapTypeId.SATELLITE
            // mapTypeId: google.maps.MapTypeId.TERRAIN
            disableDefaultUI: true,
        };

        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
        var marker = new google.maps.Marker({ position: mapProp.center });
        marker.setMap(this.map);

        var infowindow = new google.maps.InfoWindow({
            content: 'asdf',
        });
        infowindow.open(this.map, marker);
    }

    ngOnInit() {}
}
