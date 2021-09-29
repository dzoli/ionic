import { Photo } from './photo.model';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PhotosService {
    private _photos: Photo[] = [
        new Photo('2', 'Test2', 'Description 2 ...', './assets/1.jpg'),
        new Photo('1', 'Test1', 'Description 1 ...', './assets/2.jpg'),
        new Photo('3', 'Test3', 'Description 3 ...', './assets/3.jpg'),
    ];

    constructor() {}

    get photos() {
        return [...this._photos];
    }

    findPhoto(photoId: string) {
        return this.photos.find((p) => {
            return p.id === photoId;
        });
    }
}
