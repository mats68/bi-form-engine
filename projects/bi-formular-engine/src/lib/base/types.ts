import { SchemaManager } from './schemaManager';

export type IComponentStringFunction = (sm: SchemaManager, comp: IComponent, value?: any) => string;
export type IComponentBoolFunction = (sm: SchemaManager, comp: IComponent, value?: any) => boolean;
export type IComponentComponentFunction = (sm: SchemaManager, comp: IComponent, value?: any) => IComponent;
export type IComponentAnyFunction = (sm: SchemaManager, comp: IComponent, value?: any) => any;
export type IComponentVoidFunction = (sm: SchemaManager, comp: IComponent, value?: any) => void;
export type ISchemaVoidFunction = (sm: SchemaManager) => void;
export type ISelectOptionItemsFunction = (sm: SchemaManager, comp: IComponent, value?: any) => ISelectOptionItems | string[];
// export type IPartialSchema = Partial<ISchema>;
// export type IPartialComponent = Partial<IComponent>;


export type IScreenSize = 'xs' | 'sm' | 'md' | 'lg';
export type IAppearance = 'legacy' | 'standard' | 'fill' | 'outline';

export interface ISelectOptionItem {
    value: string | number,
    text: string,
  }

export interface ISelectOptionItems extends Array<ISelectOptionItem> { }

export interface ISchema extends ISchemaProps, IComponent {
  [key: string]: any,
}

export interface ISchemaPartial extends ISchemaProps, IComponentPartial {
  [key: string]: any,
}

export interface ISchemaProps  {
  onSubmit?: ISchemaVoidFunction,
  onInitSchema?: ISchemaVoidFunction,
  onInitValues?: ISchemaVoidFunction,
  onResize?: ISchemaVoidFunction,
  onMakeVisible?: IComponentVoidFunction,
  inheritFrom?: ISchema;
}

export interface IComponent extends IComponentProps {
  type: keyof typeof ComponentType;
  children?: Array<IComponent>;
}

export interface IComponentPartial extends IComponentProps {
  type?: keyof typeof ComponentType;
  children?: Array<IComponentPartial>;
}

export interface IComponentProps {
    dataType?: keyof typeof DataType;
    label?: string | IComponentStringFunction,
    name?: string;
    field?: string,
    style?: string | IComponentStringFunction,
    styles?: any,
    class?: string | IComponentStringFunction,
    hidden?: boolean | IComponentBoolFunction,
    tooltip?: string | IComponentStringFunction,
    hint?: string | IComponentStringFunction,
    placeholder?: string | IComponentStringFunction,    
    default?: any,
    inputType?: string,
    width?: string,
    suffix?: string,
    prefix?: string,
    mask?: string | IComponentStringFunction,
    maskOptions?: IMaskOptions,
    rows?: number,
    multiline?: boolean,
    required?: boolean,
    min?: number,
    max?: number,
    step?: number,
    thumbLabel?: boolean,
    color?: Color,
    autofocus?: boolean, 
    multiselect?: boolean, 
    validate?: IComponentStringFunction,
    onChange?: IComponentVoidFunction,
    summary?: IComponentStringFunction | IComponentComponentFunction,
    dragdrop?: boolean,
    onClick?: IComponentVoidFunction,
    disabled?: boolean | IComponentBoolFunction,
    options?: ISelectOptionItems | ISelectOptionItemsFunction | string[],
    appearance?: IAppearance,
    cols?: string | IComponentStringFunction,
    datacols?: string | IComponentStringFunction,
    curRowInd?: number,
    kind?: keyof typeof ButtonKind,
    icon?: string,
    expanded?: boolean,
    toolbarColor?: Color,
    menuView?: boolean,
    cardView?: boolean,
    noLayout?: boolean, 
    selectedTabIndex?: number,
    html?: string | IComponentStringFunction,
    href?: string | IComponentStringFunction,
    openInNewTab?: boolean,
    menu?: Array<IComponent>;
    navpos?: 'left' | 'right',
    parentComp?: IComponent,
  }

type KeysEnum<T> = { [P in keyof Required<T>]: true };
export const ComponentKeys: KeysEnum<IComponent> = {
  type: true,
  dataType: true,
  label: true,
  name: true,
  field: true,
  class: true,
  style: true,
  styles: true,
  hidden: true,
  tooltip: true,
  hint: true,
  placeholder: true,
  children: true,
  default: true,
  inputType: true,
  width: true,
  suffix: true,
  prefix: true,
  mask: true,
  maskOptions: true,
  rows: true,
  multiline: true,
  multiselect: true,
  required: true,
  min: true,
  max: true,
  step: true,
  thumbLabel: true,
  autofocus: true,
  color: true,
  validate: true,
  onChange: true,
  summary: true,
  dragdrop: true,
  onClick: true,
  disabled: true,
  options: true,
  appearance: true,
  cols: true,
  datacols: true,
  curRowInd: true,
  kind: true,
  icon: true,
  expanded: true,
  toolbarColor: true,
  menuView: true,
  cardView: true,
  noLayout: true,
  selectedTabIndex: true,
  html: true,
  href: true,
  openInNewTab: true,
  menu: true,
  navpos: true,
  parentComp: true,
};

export const SchemaKeys: KeysEnum<ISchemaProps> = {
  onSubmit: true,
  onInitSchema: true,
  onInitValues: true,
  onResize: true,
  onMakeVisible: true,
  inheritFrom: true,
}


export interface IMaskOptions {
  thousandSeparator?: string,
  dropSpecialCharacters?: boolean,
  showMaskTyped?: boolean,
}

export interface IToolbarItem {
  label: string,
  icon: string,
  color?: Color,
  disabled?: boolean | IComponentBoolFunction,
  onClick?: IComponentVoidFunction,
}


export enum ComponentType {
    // containers
    form = 'form',
    panel = 'panel',
    card = 'card',
    expansionspanel = 'expansionspanel',
    tabs = 'tabs',
    tab = 'tab',
    switchpanel = 'switchpanel',
    datatable = 'datatable',
    sidenav = 'sidenav',
    //fields
    input = 'input',
    select = 'select',
    date = 'date',
    radiogroup = 'radiogroup',
    slider = 'slider',
    checkbox = 'checkbox',
    switch = 'switch',
    // static
    label = 'label',
    html = 'html',
    button = 'button',
    link = 'link',
    toolbar = 'toolbar',
    divider = 'divider',
    icon = 'icon',
    errorpanel = 'errorpanel',
  }

  export enum DataType {
    string = 'string',
    float = 'float',
    int = 'int',
    bool = 'bool',
    date = 'date',
  }

  export enum ButtonKind {
    standard = 'standard',
    raised = 'raised',
    stroked = 'stroked',
    flat = 'flat',
    icon = 'icon',
    fab = 'fab',
    minifab = 'minifab'
   }

   export type Color = '' | "primary" | "accent" | "warn";
   