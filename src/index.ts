export type OnStatusChange = (name: string, status: Status) => void;

export function startViewModel(prefix: string, viewModel: ViewModel, onStatusChange: OnStatusChange) {
    viewModel.onInit(onStatusChange);
}


// function ID(id: string) {
//     return function (constructor: Function) {
//         constructor.prototype.viewModelID = id;
//     }
// }

export abstract class ViewModel {
    private onStatusChange: OnStatusChange | null = null;

    onInit(onStatusChange: OnStatusChange) {
        this.onStatusChange = onStatusChange;
        const self: any = this;
        Object.keys(self).forEach((key: string) => {
            const property = self[key];
            if (property instanceof Input) {
                property.registerViewModel(key, this);
            }
        });
    }

    public set(state: any) {
        const self: any = this;
        Object.keys(state).forEach((key: string) => {
            const property = self[key];
            if (!property || !(property instanceof Input)) {
                throw new Error(`Invalid key ${key}`);
            }
            property.value = state[key];
        });
    }

    newStatus(input: Input<any>) {
        if (!this.onStatusChange) {
            throw new Error('Callback onStatusChange not set for ViewModelClient');
        }
        this.onStatusChange(input.name, input.status);
    }
}

export class Status { }
export class OK extends Status {
}
export class WARNING extends Status {
    constructor(public label: string) { super(); }
}

export class ERROR extends Status {
    constructor(public label: string) { super(); }
}

export class UNKNOWN extends Status {
    constructor(public message: string) { super(); }
}

interface Event {
    value: any;
}

type AfterInput<T> = (_val: T) => boolean | void;
abstract class Input<T> {

    private vm: ViewModel | null = null;
    private _name: string = "";
    public _status: Status = new OK();
    private _val: T | null = null;
    private _afterInput: AfterInput<T>;
    constructor(fn: AfterInput<T> | null = null) {
        this._afterInput = fn || (v => { });
    }

    public set value(value: T | null) {
        this._val = value;
    }
    public get value(): T | null {
        return this._val;
    }
    public get status() {
        return this._status;
    }
    public get name() {
        return this._name;
    }

    public set afterInput(fn: AfterInput<T>) {
        this._afterInput = fn;
    }

    registerViewModel(name: string, vm: ViewModel) {
        this.vm = vm;
        this._name = name;
    }

    triggerAfterInput(event: Event) {
        let newStatus: Status = new OK();
        let result: boolean | void = true;
        if (this._afterInput) {
            try {
                result = this._afterInput(event.value as T);
            } catch (error: any) {
                if (error instanceof WARNING || error instanceof ERROR) {
                    newStatus = error;
                } else {
                    newStatus = new UNKNOWN(error.message);
                }
            }
        }
        if (result !== false) {
            this._val = event.value;
        }
        if (this.status.constructor !== newStatus.constructor ||
            (newStatus instanceof WARNING && (newStatus.label !== (this.status as WARNING).label)) ||
            (newStatus instanceof ERROR && (newStatus.label !== (this.status as ERROR).label)) ||
            (newStatus instanceof UNKNOWN && (newStatus.message !== (this.status as UNKNOWN).message))) {
            this._status = newStatus;
            if (this.vm) {
                this.vm.newStatus(this);
            }
        }
    }
}

export class IText extends Input<string>{
}

export class INumber extends Input<number>{
}

export class IDate extends Input<Date>{
}
