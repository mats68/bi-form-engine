import { IValueType, SchemaManager } from '../schemaManager';
import { ISchema, IComponent, ComponentType, ISelectOptionItems, DataType, IScreenSize, IAppearance, SchemaKeys, ComponentKeys } from '../types';

export const schemaErr: ISchema = {
    type: 'form',
    children: [
        {
            // @ts-ignore
            type: 'wrongtype',
            name: 'wrongtype',
        },
        // @ts-ignore
        {
            name: 'notype',
        },
        {
            type: 'panel',
            name: 'noChild',

        },
        {
            type: 'panel',
            name: 'noChild1',
            children: [

            ]

        },
        {
            type: 'input',
            name: 'nofield',

        },
        {
            type: 'input',
            field: 'hasfield',
            name: 'hasfield',

        },
        {
            type: 'select',
            name: 'noLabelnoField',

        },
        {
            type: 'divider',
            name: 'divider',

        },
    ]
}


