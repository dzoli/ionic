import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
    selector: 'app-camera',
    templateUrl: './camera.page.html',
    styleUrls: ['./camera.page.scss'],
})
export class CameraPage {
    constructor() {
        Camera.getPhoto({
            quality: 90,
            source: CameraSource.Prompt,
            correctOrientation: true,
            height: 720,
            width: 600,
            resultType: CameraResultType.Base64,
        })
            .then((img) => {
                console.log(img.base64String);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}
