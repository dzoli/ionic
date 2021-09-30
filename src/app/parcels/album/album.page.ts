import { Geoimg } from './geoimg.model';
import { DbService } from './db.service';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { Photo } from './photo.model';
import { PhotosService } from './photos.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Geolocation } from '@capacitor/geolocation';

@Component({
    selector: 'app-album',
    templateUrl: './album.page.html',
    styleUrls: ['./album.page.scss'],
})
export class AlbumPage implements OnInit {
    toShowPhoto: Photo;
    loadedPhotos: Photo[];
    Data: Geoimg[];

    constructor(private servicePhoto: PhotosService, private db: DbService, private _sanitizer: DomSanitizer) {}

    ngOnInit() {
        this.loadedPhotos = this.servicePhoto.photos;
        this.toShowPhoto = this.loadedPhotos[0];
        this.db.dbState().subscribe((res) => {
            if (res) {
                this.db.fetchImgs().subscribe((item) => {
                    this.Data = item;
                });
            }
        });
    }

    decodeImage(base_64: string) {
        console.log('album = ', base_64.substring(0, 100));
        if (base_64.startsWith('data:image/jpeg;base64,')) {
            return this._sanitizer.bypassSecurityTrustResourceUrl(base_64);
        }
        return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + base_64);
    }

    onItemClicked(photoId: string) {
        this.toShowPhoto = this.servicePhoto.findPhoto(photoId);
    }

    onCameraClicked() {
        console.log('camera clicked');
        Camera.getPhoto({
            quality: 90,
            source: CameraSource.Prompt,
            correctOrientation: true,
            height: 720,
            width: 600,
            resultType: CameraResultType.Base64,
        })
            .then((img) => {
                console.log('img - ', img.base64String.substring(0, 100));
                Geolocation.getCurrentPosition()
                    .then((pos) => {
                        const { accuracy, latitude, longitude } = pos.coords;
                        console.log('onLocationSuccess--camera-', pos);
                        this.db
                            .addImg(latitude, longitude, img.base64String)
                            .then((res) => {
                                console.log('camera-success', res);
                            })
                            .catch((err) => {
                                console.log('camera-db-err', err);
                            });
                    })
                    .catch((err) => {
                        console.log('album-err-', err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }
}
