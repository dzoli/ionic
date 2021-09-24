import { Photo } from './photo.model';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PhotosService {
    private _photos: Photo[] = [
        new Photo(
            '2',
            'Test2',
            'Description 2 ...',
            'https://media.threatpost.com/wp-content/uploads/sites/103/2019/09/26105755/fish-1.jpg'
        ),
        new Photo(
            '1',
            'Test1',
            'Description 1 ...',
            'https://t4.ftcdn.net/jpg/01/95/74/69/360_F_195746982_tNE5VRW3WxNgy15tJhgls7eQXDznvLSe.jpg'
        ),
        new Photo(
            '3',
            'Test3',
            'Description 3 ...',
            'https://image.shutterstock.com/image-photo/indian-white-breasted-kingfisher-bird-260nw-1903258540.jpg'
        ),
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
