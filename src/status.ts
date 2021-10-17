export class Status { constructor(public label: string, public isError: boolean) { } }
// tslint:disable-next-line: max-classes-per-file
export const OK = new Status('OK', false);
export const CANCEL = new Status('CANCEL', false);

// tslint:disable-next-line: max-classes-per-file
export class WARNING extends Status {
    constructor(public label: string) { super(label, false); }
}
// tslint:disable-next-line: max-classes-per-file
export class ERROR extends Status {
    constructor(public label: string) { super(label, true); }
}
// tslint:disable-next-line: max-classes-per-file
export class UNKNOWNERROR extends Status {
    constructor(public message: string) { super('unknown-error', true); }
}

// tslint:disable-next-line: max-classes-per-file
export class StatusChangeEvent {
    constructor(
        private propertyKey: string,
        private newStatusList: Status[],
        private added: Status[],
        private removed: Status[]
    ) { }
    public get property() {
        return this.propertyKey;
    };
    public get statusList(): Status[] {
        return [...this.newStatusList];
    }
    public get addedStatusList(): Status[] {
        return [...this.added];
    }
    public get removedStatusList(): Status[] {
        return [...this.removed];
    }
    public hasErrors(): boolean {
        return !!this.newStatusList.find(s => s.isError);
    }
    public hasUnknownErrors(): boolean {
        return !!this.newStatusList.find(s => s instanceof UNKNOWNERROR);
    }
    public hasWarnings(): boolean {
        return !!this.newStatusList.find(s => s instanceof WARNING);
    }
    public getAllErrors(): string[] {
        return this.newStatusList.filter(s => s.isError).map(s => s.label);
    }
    public getAllUnknownErrors(): string[] {
        return this.newStatusList.filter(s => s instanceof UNKNOWNERROR).map(s => s.label)
    }
    public getAllWarnings(): string[] {
        return this.newStatusList.filter(s => s instanceof WARNING).map(s => s.label)
    }
    public containsError(label: string): boolean {
        return !!this.newStatusList.find(s => s.isError && s.label === label);
    }
    public containsWarning(label: string): boolean {
        return !!this.newStatusList.find(s => s instanceof WARNING && s.label === label);
    }
}