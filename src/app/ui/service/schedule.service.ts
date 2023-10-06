import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ScheduleService {
    constructor(private http: HttpClient) { }
    getSchedulesData() {
        return [
            {
                id: '1000',
                day: 'Lunes',
                receive: 'No',
                schedule: ''
            },
            {
                id: '1001',
                day: 'Martes',
                receive: 'No',
                schedule: ''
            },
            {
                id: '1002',
                day: 'Miércoles',
                receive: 'No',
                schedule: ''
            },
            {
                id: '1003',
                day: 'Jueves',
                receive: 'No',
                schedule: ''
            },
            {
                id: '1004',
                day: 'Viernes',
                receive: 'No',
                schedule: ''
            },
            {
                id: '1005',
                day: 'Sábado',
                receive: 'No',
                schedule: ''
            },
            {
                id: '1006',
                day: 'Domingo',
                receive: 'No',
                schedule: ''
            }
        ];
    }

    getSchedules() {
        return Promise.resolve(this.getSchedulesData());
    }

}