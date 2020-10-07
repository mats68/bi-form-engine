import { IValueType, SchemaManager } from './schemaManager';

describe('SchemaManager', () => {
    const schemaManager = new SchemaManager();

    it('test checkValueType', () => {
        let res;
        let x = undefined;
        res = schemaManager.checkValueType(x);
        expect(res).toEqual(IValueType.undefined);
        x = null;
        res = schemaManager.checkValueType(x);
        expect(res).toEqual(IValueType.null);
        x = 'aa';
        res = schemaManager.checkValueType(x);
        expect(res).toEqual(IValueType.string);
        x = 1;
        res = schemaManager.checkValueType(x);
        expect(res).toEqual(IValueType.number);
        x = 1.5;
        res = schemaManager.checkValueType(x);
        expect(res).toEqual(IValueType.number);
        x = true;
        res = schemaManager.checkValueType(x);
        expect(res).toEqual(IValueType.boolean);
        x = y => y+1;
        res = schemaManager.checkValueType(x);
        expect(res).toEqual(IValueType.function);
        x = [];
        res = schemaManager.checkValueType(x);
        expect(res).toEqual(IValueType.array);
        x = {a: 1};
        res = schemaManager.checkValueType(x);
        expect(res).toEqual(IValueType.object);
        x = {type: 'button'};
        res = schemaManager.checkValueType(x);
        expect(res).toEqual(IValueType.component);
    });
});
