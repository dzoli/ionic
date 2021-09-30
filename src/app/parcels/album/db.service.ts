import { Geoimg } from './geoimg.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class DbService {
    private storage: SQLiteObject;
    imgList = new BehaviorSubject([]);
    private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private platform: Platform, private sqlite: SQLite, private httpClient: HttpClient, private sqlPorter: SQLitePorter) {
        this.platform.ready().then(() => {
            this.sqlite
                .create({
                    name: 'positronx_db.db',
                    location: 'default',
                })
                .then((db: SQLiteObject) => {
                    this.storage = db;
                    this.getFakeData();
                });
        });
    }

    dbState() {
        return this.isDbReady.asObservable();
    }

    fetchImgs(): Observable<Geoimg[]> {
        return this.imgList.asObservable();
    }

    // Render fake data
    getFakeData() {
        this.httpClient.get('assets/dump.sql', { responseType: 'text' }).subscribe((data) => {
            this.sqlPorter
                .importSqlToDb(this.storage, data)
                .then((_) => {
                    this.getImgs();
                    this.isDbReady.next(true);
                })
                .catch((error) => console.error(error));
        });
    }

    // Get list
    getImgs() {
        return this.storage.executeSql('SELECT * FROM geoimg', []).then((res) => {
            let items: Geoimg[] = [];
            if (res.rows.length > 0) {
                for (var i = 0; i < res.rows.length; i++) {
                    items.push({
                        id: res.rows.item(i).id,
                        lat: res.rows.item(i).lat,
                        long: res.rows.item(i).long,
                        base_64: res.rows.item(i).base_64,
                    });
                }
            }
            this.imgList.next(items);
        });
    }

    // Add
    addImg(lat, long, base_64) {
        let data = [lat, long, base_64];
        return this.storage.executeSql('INSERT INTO geoimg (lat, long, base_64) VALUES (?, ?, ?)', data).then((res) => {
            this.getImgs();
        });
    }

    // Get single object
    getImg(id): Promise<Geoimg> {
        return this.storage.executeSql('SELECT * FROM geoimg WHERE id = ?', [id]).then((res) => {
            return {
                id: res.rows.item(0).id,
                lat: res.rows.item(0).lat,
                long: res.rows.item(0).long,
                base_64: res.rows.item(0).base_64,
            };
        });
    }
}
