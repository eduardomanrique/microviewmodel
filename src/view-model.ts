import { ERROR, WARNING } from './';
import { CANCEL, OK, Status, StatusChangeEvent, UNKNOWNERROR } from './status';

export type OnStatusChange = (event: StatusChangeEvent) => void;

export function startViewModel(prefix: string, viewModel: ViewModel, onStatusChange: OnStatusChange) {
    viewModel.__onStatusChange = onStatusChange;
}

export abstract class ViewModel {
    // tslint:disable-next-line: no-empty variable-name
    __onStatusChange: OnStatusChange = () => { };
    // tslint:disable-next-line: variable-name
    __validators: Record<string, Validation[]>;
    // tslint:disable-next-line: variable-name
    __afterInput: Record<string, Validation>;
    // tslint:disable-next-line: variable-name
    __fieldStatuses: Record<string, Status[]> = {};
    // tslint:disable-next-line: variable-name
    __fieldOverallStatus: Record<string, boolean>;
    // tslint:disable-next-line: variable-name
    __inputField: string | null = null;

    __getFieldOverallStatus() {
        if (!this.__fieldOverallStatus) {
            this.__fieldOverallStatus = {};
        }
        return this.__fieldOverallStatus;
    }

    __getAfterInput() {
        if (!this.__afterInput) {
            this.__afterInput = {};
        }
        return this.__afterInput;
    }

    __getFieldStatuses() {
        if (!this.__fieldStatuses) {
            this.__fieldStatuses = {};
        }
        return this.__fieldStatuses;
    }

    addValidator(name: string, validation: Validation) {
        if (!this.__validators) {
            this.__validators = {};
        }
        if (!this.__validators[name]) {
            this.__validators[name] = [];
        }
        this.__validators[name].push(validation);
    }

    triggerAfterInput(field: string, value: any) {
        this.__inputField = field;
        (this as any)[field] = value;
        this.__inputField = null;
    }

    public isViewModelValid() {
        const os = this.__getFieldOverallStatus();
        const values = Object.values(os);
        for (const isOk of values) {
            if (!isOk) {
                return false;
            }
        }
        return true;
    }
}

export type Validation = (val: any) => Status | Status[] | void;

export function Input() {
    return (target: any, key: string) => {
        function isTheSameStatus(s1: Status, s2: Status) {
            return s1.constructor === s2.constructor &&
                (s2 instanceof WARNING && (s2.label === (s1 as WARNING).label)) ||
                (s2 instanceof ERROR && (s2.label === (s1 as ERROR).label)) ||
                (s2 instanceof UNKNOWNERROR && (s2.message === (s1 as UNKNOWNERROR).message));
        }

        function prepareStatuses(vm: ViewModel, oldStatuses: Status[], newStatuses: Status[]) {
            const old = oldStatuses ? [...oldStatuses] : [];
            const added: Status[] = [];
            newStatuses.forEach((newStatus: Status) => {
                if (newStatus instanceof ERROR || newStatus instanceof UNKNOWNERROR) {
                    vm.__getFieldOverallStatus()[key] = false;
                }
                let foundIndex = -1;
                for (let i = 0; i < old.length; i++) {
                    if (isTheSameStatus(old[i], newStatus)) {
                        foundIndex = i;
                        break;
                    }
                }
                if (foundIndex >= 0) {
                    old.splice(foundIndex, 1);
                } else {
                    added.push(newStatus);
                }
            });
            return [newStatuses, added, old];
        }
        let value: string;
        const getter = () => {
            return value;
        };
        function setter(this: ViewModel, newVal: any) {

            if (key in this.__validators) {
                const validators = this.__validators[key];

                let newStatuses = validators.map(validator => {
                    try {
                        const result = validator(newVal);
                        if (result === undefined) {
                            return null;
                        }
                        return result;
                    } catch (e: any) {
                        return new UNKNOWNERROR(e.message);
                    }
                }).flat().filter(s => s !== null) as Status[];
                if (key === this.__inputField && key in this.__afterInput) {
                    let result = this.__afterInput[key](newVal);
                    if (result !== undefined) {
                        if (!Array.isArray(result)) {
                            result = [result];
                        }
                        newStatuses = newStatuses.concat(result);
                    }
                }

                if (!newStatuses.find(status => status === CANCEL)) {
                    value = newVal;
                    this.__getFieldOverallStatus()[key] = true;
                    const [status, added, removed] = prepareStatuses(this, this.__getFieldStatuses()[key], newStatuses);
                    this.__getFieldStatuses()[key] = newStatuses;
                    if (added.length > 0 || removed.length > 0) {
                        this.__onStatusChange(new StatusChangeEvent(key, status, added, removed));
                    }
                }

            };
        }
        Object.defineProperty(target, key, {
            get: getter,
            set: setter
        });
    }
}

export function AfterInput(property: string) {
    return (target: any, key: string) => {
        target.__getAfterInput()[property] = target[key] as Validation;
    }
}