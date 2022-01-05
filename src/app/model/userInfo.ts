export class  UserInfo {
    name = '';
    role = '';

    constructor(name?: string, role?: string) {
        this.name = name || '';
        this.role = role || '';
    }
}