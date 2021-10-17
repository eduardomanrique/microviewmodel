import { ViewModel, ERROR, MaxSize, Max, Mandatory, startViewModel, Input, StatusChangeEvent, AfterInput } from '../index';

class TestViewModel extends ViewModel {
    @Input()
    id?: string;

    @Input() @MaxSize(10) @Mandatory()
    name?: string;

    @AfterInput('name')
    inputName(val: string) {
        if (val && !val[0].match(/^[A-Za-z]+$/)) {
            return new ERROR('invalid-chars');
        } else if (val === 'TEST') {
            return false;
        }
    }

    @Input() @Max(100)
    age?: number;

    constructor(id: string | null) {
        super();
        if (id === 'A') {
            this.id = id;
            this.name = 'Test';
            this.age = 30;
        } else if (id !== null) {
            this.id = id;
        }
    }
}

test('ViewModelClient no id', () => {
    const tvm = new TestViewModel(null);
    let invalidChars = false;
    const onChangeStatus = (e: StatusChangeEvent) => {
        invalidChars = e.property === 'name' && e.containsError('invalid-chars');
    };
    startViewModel('test', tvm, onChangeStatus);

    expect(tvm.id).toBe(undefined);
    expect(tvm.name).toBe(undefined);
    expect(tvm.age).toBe(undefined);
    expect(tvm.isViewModelValid()).toBe(true);

    tvm.triggerAfterInput('age', 10);
    tvm.triggerAfterInput('name', 'Test 123');

    expect(tvm.name).toBe('Test 123');
    expect(tvm.isViewModelValid()).toBe(true);
    expect(tvm.age).toBe(10);
    expect(tvm.isViewModelValid()).toBe(true);

    tvm.triggerAfterInput('age', 999);

    expect(tvm.age).toBe(999);
    expect(tvm.isViewModelValid()).toBe(false);

    tvm.triggerAfterInput('name', '1234qwerasdfzxdf');
    expect(tvm.name).toBe('1234qwerasdfzxdf');
    expect(tvm.isViewModelValid()).toBe(false);
    expect(invalidChars).toBe(true);


    tvm.triggerAfterInput('name', 'qwer');
    expect(tvm.name).toBe('qwer');
    expect(tvm.isViewModelValid()).toBe(false);
    expect(invalidChars).toBe(false);

    tvm.age = 90;
    expect(tvm.age).toBe(90);
    expect(tvm.isViewModelValid()).toBe(true);

    tvm.triggerAfterInput('name', '');
    expect(tvm.name).toBe('');
    expect(tvm.isViewModelValid()).toBe(false);
    expect(invalidChars).toBe(false);

});
