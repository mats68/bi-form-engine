import { SchemaManager, ComponentType, IComponent, ISchema } from '@next-gen/formular-engine';

export const schema1: ISchema = {
    type: 'panel',
    style: 'margin-left: 5px',
    children: [
        {
            type: 'inputraw',
            classContainer: 'grid-3',
            classLabel: 'col-1',
            class: 'col-2 col-span-2',
            field: 'feld1',
            label: 'Feld1',
        },
        {
            type: 'selectraw',
            classContainer: 'grid-3',
            classLabel: 'col-1',
            class: 'col-2 col-span-2',
            field: 'select',
            label: 'Select',
            options: ['BMW', 'Saab', 'Volvo']
        },
    ]
}

export const values1 = {
    feld1: '', select: 'Saab',
}
