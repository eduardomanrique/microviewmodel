import { IText, INumber, startViewModel, ViewModel, ERROR, OK, Status } from '../index';

class TestViewModel extends ViewModel {
    id = new IText();
    name = new IText(val => {
        if (val.length > 10) {
            throw new ERROR('too.big');
        }
    });
    age = new INumber(val => {
        if (val > 100) {
            return false;
        }
    });

    constructor(id: string | null) {
        super();
        if (id === 'A') {
            this.set({
                id: id,
                name: 'Test',
                age: 30
            });
        } else {
            this.set({ id });
        }
    }
}

test('ViewModelClient no id', () => {
    const tvm = new TestViewModel(null);
    let tooBigError = false;
    const onChangeStatus = (name: string, status: Status) => {
        if (name === 'name') {
            tooBigError = status instanceof ERROR;
        }
    };
    startViewModel('test', tvm, onChangeStatus);

    expect(tvm.id.value).toBe(null);
    expect(tvm.id.status instanceof OK).toBe(true);
    expect(tvm.name.value).toBe(null);
    expect(tvm.name.status instanceof OK).toBe(true);
    expect(tvm.age.value).toBe(null);
    expect(tvm.age.status instanceof OK).toBe(true);

    tvm.age.triggerAfterInput({ value: 10 });
    tvm.name.triggerAfterInput({ value: 'Test 123' });

    expect(tvm.name.value).toBe('Test 123');
    expect(tvm.name.status instanceof OK).toBe(true);
    expect(tvm.age.value).toBe(10);
    expect(tvm.age.status instanceof OK).toBe(true);

    tvm.age.triggerAfterInput({ value: 999 });
    tvm.name.triggerAfterInput({ value: '1234qwerasdfzxdf' });

    expect(tvm.id.value).toBe(null);
    expect(tvm.name.value).toBe('1234qwerasdfzxdf');
    expect(tvm.name.status instanceof ERROR).toBe(true);
    expect(tooBigError).toBe(true);
    expect(tvm.age.value).toBe(10);
    expect(tvm.age.status instanceof OK).toBe(true);

    tvm.name.triggerAfterInput({ value: 'qwer' });
    expect(tvm.name.value).toBe('qwer');
    expect(tvm.name.status instanceof OK).toBe(true);
    expect(tooBigError).toBe(false);

});
