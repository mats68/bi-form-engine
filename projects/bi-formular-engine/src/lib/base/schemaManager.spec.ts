import { IValueType, SchemaManager } from './schemaManager';
import { schemaErr } from './test/schemaErr'
import { err_schema, err_notype, err_typewrong, err_noChild, err_zeroChild, err_noField, err_noLabel, err_doubleField, err_doubleName, err_noSummary, err_noOptions, err_noIcon, err_unn } from './constants'

const hasError = (sm: SchemaManager, error: string, name?: string, field?: string ): boolean => {
    const f = sm.SchemaErrors.findIndex(e => {
        if (error === e.error) {
            if (name && e.comp.name !== name) return false
            if (field && e.comp.field !== field) return false
            return true
        }
        return false
    })
    return f > -1
}

describe('Schema is wrong', () => {
    const sm = new SchemaManager();

    it('schema error wrong type', () => {
        // @ts-ignore
        sm.InitSchema('ddd')
        expect(hasError(sm, err_schema)).toEqual(true);
    })

    it('schema error no type property', () => {
        // @ts-ignore
        sm.InitSchema({ label: 'dada'})
        expect(hasError(sm, err_schema)).toEqual(true);
    })

    it('schema ok', () => {
        sm.InitSchema({ type: 'label', label: 'dada'})
        expect(sm.SchemaErrors.length).toEqual(0);
    })
})

describe('Component has wrong properties', () => {
    const sm = new SchemaManager();
    sm.InitSchema(schemaErr)
    sm.CheckSchema()

    it('component no type', () => {
        expect(hasError(sm, err_notype, 'notype')).toEqual(true);
    })

    it('component wrong type', () => {
        expect(hasError(sm, err_typewrong, 'wrongtype')).toEqual(true);
    })

    it('container with no child', () => {
        expect(hasError(sm, err_noChild, 'noChild')).toEqual(true);
        expect(hasError(sm, err_noChild, 'noChild1')).toEqual(false);
        expect(hasError(sm, err_zeroChild, 'noChild1')).toEqual(true);
    })

    it('input has no field', () => {
        expect(hasError(sm, err_noField, 'nofield')).toEqual(true);
        expect(hasError(sm, err_noField, 'hasfield')).toEqual(false);
        expect(hasError(sm, err_noField, 'noLabelnoField')).toEqual(true);
    })

    it('input has no label', () => {
        expect(hasError(sm, err_noLabel, 'noLabelnoField')).toEqual(true);
    })

    it('input has no label and noi field', () => {
        expect(hasError(sm, err_noLabel, 'noLabelnoField')).toEqual(true);
        expect(hasError(sm, err_noField, 'noLabelnoField')).toEqual(true);
    })

    


})



describe('SchemaManager', () => {
    const sm = new SchemaManager();

    it('test checkValueType', () => {
        let res;
        let x = undefined;
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.undefined);
        x = null;
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.null);
        x = 'aa';
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.string);
        x = 1;
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.number);
        x = 1.5;
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.number);
        x = true;
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.boolean);
        x = y => y + 1;
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.function);
        x = [];
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.array);
        x = { a: 1 };
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.object);
        x = { type: 'button' };
        res = sm.checkValueType(x);
        expect(res).toEqual(IValueType.component);
    });
});


