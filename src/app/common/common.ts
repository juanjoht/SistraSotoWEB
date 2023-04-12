import { environment } from '../../environments/environment';

export class Common {
    private static token: string | null;
    private static userId: number;

    public static get Token(): any {
        if (this.token === undefined && localStorage.getItem('token') !== undefined) {
                this.token = localStorage.getItem('token');
        }
        return this.token;
    }

    public static set Token(token: string) {
        localStorage.setItem('token', token);
        this.token = token;
    }


    public static get urlBaseApi(): string {
        const result: string = environment.urlBaseApi;
        return result;
    }
}
