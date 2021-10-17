import { ViewModel, startViewModel, Input, AfterInput } from "./view-model";
import { Status, OK, ERROR, WARNING, UNKNOWNERROR, StatusChangeEvent } from "./status";
import { Min, Max, MinSize, MaxSize, Mandatory } from "./validators";

export {
    Input,
    startViewModel,
    ViewModel,
    Status,
    OK,
    ERROR,
    WARNING,
    UNKNOWNERROR,
    Min,
    Max,
    MinSize,
    MaxSize,
    Mandatory,
    StatusChangeEvent,
    AfterInput
};

// function expect(v1: any, v2: any) {
//     console.log("EXPECT " + v1 + " = " + v2 + " => " + (v1 === v2))
// }

// class TestViewModel extends ViewModel {
//     @Input()
//     id?: string;

//     @Input() @MaxSize(10) @Mandatory()
//     name?: string;

//     @AfterInput('name')
//     inputName(val: string) {
//         if (val && !val[0].match(/^[A-Za-z]+$/)) {
//             return new ERROR('invalid-chars');
//         } else if (val === 'TEST') {
//             return false;
//         }
//     }

//     @Input() @Max(100)
//     age?: number;

//     constructor(id: string | null) {
//         super();
//         if (id === 'A') {
//             this.id = id;
//             this.name = 'Test';
//             this.age = 30;
//         } else if (id !== null) {
//             this.id = id;
//         }
//     }
// }

// const tvm = new TestViewModel(null);
// let invalidChars = false;
// const onChangeStatus = (e: StatusChangeEvent) => {
//     invalidChars = e.property === 'name' && e.containsError('invalid-chars');
// };
// startViewModel('test', tvm, onChangeStatus);

// expect(tvm.id, undefined);
// expect(tvm.name, undefined);
// expect(tvm.age, undefined);
// expect(tvm.isViewModelValid(), true);

// tvm.triggerAfterInput('age', 10);
// tvm.triggerAfterInput('name', 'Test 123');

// expect(tvm.name, 'Test 123');
// expect(tvm.isViewModelValid(), true);
// expect(tvm.age, 10);
// expect(tvm.isViewModelValid(), true);

// tvm.triggerAfterInput('age', 999);

// expect(tvm.age, 999);
// expect(tvm.isViewModelValid(), false);

// tvm.triggerAfterInput('name', '1234qwerasdfzxdf');
// expect(tvm.name, '1234qwerasdfzxdf');
// expect(tvm.isViewModelValid(), false);
// expect(invalidChars, true);


// tvm.triggerAfterInput('name', 'qwer');
// expect(tvm.name, 'qwer');
// expect(tvm.isViewModelValid(), true);
// expect(invalidChars, false);

// tvm.triggerAfterInput('name', '');
// expect(tvm.name, '');
// expect(tvm.isViewModelValid(), false);
// expect(invalidChars, false);

