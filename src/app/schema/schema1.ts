import { SchemaManager, ComponentType, IComponent, ISchema } from '@next-gen/formular-engine';

export const schema1: ISchema = {
    type: 'panel',
    label: 'Formular',
    children: [
        {
            type: 'label',
            label: 'Art des Geräts / Anlage',
            cols: 'xs-2'
        },
        {
            type: 'input',
            field: 'ErstesFeld',
            appearance: 'outline',
            label: '',
            cols: 'xs-4'
        },
        {
            type: 'panel',
            cols: 'xs-10'
        },
        {
            type: 'label',
            label: 'Art des alters',
            cols: 'xs-2'
        },
        {
            type: 'input',
            field: 'ErstesFeld',
            appearance: 'outline',
            label: 'PLZ',
            cols: 'xs-2'
        },
        {
            type: 'input',
            field: 'ErstesFeld',
            appearance: 'outline',
            label: '',
            cols: 'xs-4'
        },
        {
            type: 'panel',
            cols: 'xs-10'
        },

        {
            type: 'datatable',
            field: 'table1',
            width: '500px',
            label: 'Tabelle',
            onChange(sm, comp, val) {
                console.log(comp.field, val);
            },
            summaryCard(sm, comp, val) {
                return val.Adresse;
            },
            children: [
                {
                    type: 'input',
                    label: 'Name',
                    required: true,
                    field: 'Name',

                },
                {
                    type: 'input',
                    label: 'Vorname',
                    field: 'Vorname',

                },
                {
                    type: 'input',
                    label: 'Adresse',
                    multiline: true,
                    field: 'Adresse',
                    validate(sm, comp, value) {
                        if (value.length < 10) return 'Mindestens 10 Zeichen eingeben'
                    }

                },
                {
                    type: 'checkbox',
                    label: 'Done',
                    field: 'done',
                    summaryCellTitle() {
                        return {
                            type: 'icon',
                            icon: 'done'
                        }
                    },
                    summaryCellValue(sm, comp, val) {
                        if (val) {
                            return {
                                type: 'icon',
                                icon: 'done'
                            }
                        } else {
                            return 'Nein danke';
                        }
                    },

                },
            ]
        },
        {
            type: 'errorpanel',
            label: 'Fehler'
        },
        {
            type: 'button',
            label: 'Validate',
            onClick(sm) {
                sm.validateAll();
                console.log(sm.Errors);
            }

        }
    ]
}

export const values1 = {
    "table1": [{ "Name": "Thaler", "Vorname": "Matthias", "Adresse": "Bonzenstr. 11\n5001 Bern", "done": false }, { "Name": "", "Vorname": "Matthias", "Adresse": "Bonzenstr. 12\n5001 Bern", "done": false }]
}
