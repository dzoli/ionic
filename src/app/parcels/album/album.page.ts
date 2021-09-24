import { Photo } from './photo.model';
import { PhotosService } from './photos.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-album',
    templateUrl: './album.page.html',
    styleUrls: ['./album.page.scss'],
})
export class AlbumPage implements OnInit {
    toShowPhoto: Photo;
    loadedPhotos: Photo[];

    constructor(private servicePhoto: PhotosService) {}

    ngOnInit() {
        this.loadedPhotos = this.servicePhoto.photos;
        this.toShowPhoto = this.loadedPhotos[0];
    }

    onItemClicked(photoId: string) {
        this.toShowPhoto = this.servicePhoto.findPhoto(photoId);
    }
}
