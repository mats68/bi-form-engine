import { SchemaManager, ComponentType, IComponent, ISchema } from 'bi-formular-engine';

export const schema1: ISchema = {
    type: 'form',
    label: 'Formular',
    children: [
        {
            type: 'input',
            label: 'Div',
            field: 'Div',
            required: true,
           
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
    "table1": [{ "Name": "Thaler", "Vorname": "Matthias", "Adresse": "Bonzenstr. 11\n5001 Bern", "done": false }, { "Name": "Thaler2", "Vorname": "Matthias", "Adresse": "Bonzenstr. 12\n5001 Bern", "done": false }]
}
