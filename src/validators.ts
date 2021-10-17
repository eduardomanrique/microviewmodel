import { ViewModel } from "./view-model";
import { ERROR } from "./status";




export function Min(min: number) {
    return (vm: ViewModel, key: string) => {
        vm.addValidator(key, val => {
            if (val < min) {
                return new ERROR('min');
            }
        });
    }
}

export function Max(max: number) {
    return (vm: ViewModel, key: string) => {
        vm.addValidator(key, val => {
            if (val > max) {
                return new ERROR('max');
            }
        });
    }
}

export function MinSize(minSize: number) {
    return (vm: ViewModel, key: string) => {
        vm.addValidator(key, val => {
            if (val && val.length < minSize) {
                return new ERROR('min-size');
            }
        });
    }
}

export function MaxSize(maxSize: number) {
    return (vm: ViewModel, key: string) => {
        vm.addValidator(key, val => {
            if (val && val.length > maxSize) {
                return new ERROR('max-size');
            }
        });
    }
}

export function Mandatory() {
    return (vm: ViewModel, key: string) => {
        vm.addValidator(key, val => {
            if (val === null || val === undefined || val === "" || val.length === 0) {
                return new ERROR('mandatory');
            }
        });
    }
}