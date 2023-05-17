import { environment } from '../../environments/environment';

export class Common {
    private static token: string | null;
    private static userName: string | null;
    private static moduleStr: string | null;
    private static modules: any[];

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

    public static get UserName(): any {
        if (this.userName === undefined && localStorage.getItem('userName') !== undefined) {
                this.userName = localStorage.getItem('userName');
        }
        return this.userName;
    }

    public static set UserName(userName: string) {
        localStorage.setItem('userName', userName);
        this.userName = userName;
    }

    public static get Modules(): any[] {
        if (this.moduleStr === undefined && localStorage.getItem('modules') !== undefined) {
            this.moduleStr = localStorage.getItem('modules');
            this.modules = JSON.parse(this.moduleStr as string)
        }
        return this.modules;
    }

    public static set Modules(modulesInput: any[]) {
        this.moduleStr = JSON.stringify(modulesInput)
        localStorage.setItem('modules', this.moduleStr);
        this.modules = modulesInput;
    }


    public static get urlBaseApi(): string {
        const result: string = environment.urlBaseApi;
        return result;
    }


    public static checkPermissions(itemMenu: string, action: string) {
        let modules = Common.Modules;
        let moduleSearch = `${itemMenu}-${action}`;
        let module = modules.find(x => x.modulo === moduleSearch);
        let right: boolean = true;
        switch (action.toLocaleLowerCase()) {
          case 'consultar':
            right = module.permiso;
            break;
           case 'crear':
            right = module.permiso;
           break; 
           case 'editar':
            right = module.permiso;
           break; 
          default:
            break;
        }
        return right;
      }
}
