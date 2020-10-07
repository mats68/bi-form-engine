import { strings } from './strings';
import { ISchema, IComponent, ComponentType, ISelectOptionItems, DataType, IScreenSize, IAppearance, SchemaKeys, ComponentKeys } from './types';
import { Subject } from 'rxjs';
import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';
import get from 'lodash.get';
import set from 'lodash.set';

export interface ISettings {
  requiredSuffix: string;
  language: string;
  date: {
    parse: {
      dateInput: string,
    },
    display: {
      dateInput: string,
      monthYearLabel: string,
    },
  }
}

export interface IError {
  comp: IComponent;
  arrayInd: number; //index of array in data-table
  error: string;
}

export type ITraverseCallback = (comp: IComponent, parent?: IComponent, options?: ITraverseOptions) => void;

export interface ITraverseOptions {
  done?: boolean;
  fullTraverse?: boolean;
}


export interface IHighlight {
  comp: IComponent;
  arrayInd: number;
}


export enum ISchemaErrorType {
  error = 'error',
  warning = 'warning',
}

export enum IValueType {
  undefined = 'undefined',
  null = 'null',
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  function = 'function',
  array = 'array',
  object = 'object',
  component = 'component',
}

export interface ISchemaError {
  comp?: IComponent;
  error: string;
  type: ISchemaErrorType;
}


export class SchemaManager {
  Schema: ISchema;
  Values: any;
  DiffValues: any;
  ValuesChanged: boolean;
  Settings: ISettings;
  Strings: any;

  Errors: IError[];
  highlightedFields: IHighlight[];
  AllValidated: boolean;

  OnFocus: Subject<IComponent>;

  private _AllDisabled: boolean;
  get AllDisabled(): boolean {
    return this._AllDisabled;
  }

  DisableAll(disabled: boolean = true) {
    if (this._AllDisabled !== disabled) {
      this._AllDisabled = disabled;
    }
  }


  private _ScreenSize: IScreenSize;
  get ScreenSize(): IScreenSize {
    return this._ScreenSize;
  }

  set ScreenSize(val: IScreenSize) {
    if (this._ScreenSize !== val) {
      this._ScreenSize = val;
      if (this.Schema?.onResize) {
        this.Schema.onResize(this)
      }
    }
  }


  private _NeedsRefreshUI: boolean = false;
  get NeedsRefreshUI(): boolean {
    return this._NeedsRefreshUI;
  }
  refresh_UI() {
    setTimeout(() => this._NeedsRefreshUI = true);
    setTimeout(() => this._NeedsRefreshUI = false);
  }

  constructor(settings: ISettings = null) {
    this.InitSettings(settings);
    this.InitScreenSize();
    this.OnFocus = new Subject<IComponent>();
  }

  InitSchema(schema: ISchema) {
    this.Schema = cloneDeep(schema);
    if (this.Schema.inheritFrom) this.InitInherits();
    this.Errors = [];
    this.AllValidated = false;
    if (this.Schema.onInitSchema) this.Schema.onInitSchema(this);
    this.traverseSchema((c,p) => {
      c.parentComp = p;
    });
    this.InitValues(this.Values);
  }

  private InitInherits() {
    const getComp = (CompArray: IComponent[], name: string, field: string = ''): IComponent | undefined => {
      if (name) {
        return CompArray.find(c => c.name === name);
      } else if (field) {
        return CompArray.find(c => c.field === field);
      }
      return undefined;
    }

    if (this.Schema.inheritFrom.inheritFrom) {
      console.error('inherits schema should not have a inherits schema himself !');
      return;
    }

    const updateArray = (schema: ISchema): IComponent[] => {
      let arr: IComponent[] = [];
      const o: ITraverseOptions = {fullTraverse: true};
      this.traverseSchema((c, p) => {
        c.parentComp = p;
        arr.push(c);
      }, o, schema);
      return arr;
    }

    const baseSchema: ISchema = cloneDeep(this.Schema.inheritFrom);
    baseSchema.name = this.Schema.name;


    let compsBase = updateArray(baseSchema);
    let compsExt = updateArray(this.Schema);

    // neue Komponenten hinzufügen
    compsExt.forEach(ec => {
      compsBase = updateArray(baseSchema);
      let bc = getComp(compsBase, ec.name, ec.field);
      if (!bc && ec.parentComp) {
        bc = getComp(compsBase, ec.name, ec.field);
        if (bc && bc.children) {
          bc.children.push(ec);
        }
      }
    })


    compsExt.forEach(ec => {
      var bc = getComp(compsBase, ec.name, ec.field);
      if (bc) {
        merge(bc, ec);
      }
    })
    this.Schema = baseSchema;

  }

  InitValues(values: any, diffValues: any = null) {
    if (diffValues) {
      this.DiffValues = diffValues;
    }
    if (values) {
      this.Values = values;
    } else {
      this.Values = {};
      this.traverseSchema(c => {
        if (c.field && c.default) {
          if (c.type !== ComponentType.datatable && !this.fieldIsInDataTable(c) ) {
            const val = this.getPropValue(c, 'default');
            set(this.Values, c.field, val);
          }
        }
      });
    }

    this.Errors = [];
    this.AllValidated = false;
    this.ValuesChanged = false;

    if (this.Schema.onInitValues) this.Schema.onInitValues(this);
  }

  InitValuesArray(comp: IComponent, Values: any) {
    if (comp.type !== ComponentType.datatable) return;
    comp.children.forEach(c => {
      if (c.field && c.default) { 
        const val = this.getPropValue(c, 'default');
        set(Values, c.field, val);
      }
    });
  }

  InitSettings(settings: ISettings) {
    if (settings) {
      this.Settings = {
        ...this.Settings,
        ...settings
      }
    } else {
      this.Settings = {
        requiredSuffix: ' *',
        language: 'de',
        date: {
          parse: {
            dateInput: 'DD.MM.YYYY',
          },
          display: {
            dateInput: 'DD.MM.YYYY',
            monthYearLabel: 'MMM YYYY'
          },
        }
      }
    }
    this.Strings = strings[this.Settings.language];

  }

  InitScreenSize() {
    if (screen.width >= 1200) {
      this.ScreenSize = 'lg';
    } else if (screen.width >= 992) {
      this.ScreenSize = 'md';
    } else if (screen.width >= 768) {
      this.ScreenSize = 'sm';
    } else {
      this.ScreenSize = 'xs';
    }
  }

  InitDiffHighlight() {
    if (!this.DiffValues) return;
    this.highlightedFields = [];
    this.traverseSchema(c => {
      if (c.parentComp && !this.fieldIsInDataTable(c)) {
        this.InitDiffHighlightComp(c);
      }
    });
  }

  InitDiffHighlightComp(comp: IComponent, arrayInd: number = -1) {
    if (!this.DiffValues || !this.highlightedFields) return;
    if (comp.field && comp.parentComp) {
      const val1 = this.getValue(comp);
      const val2 = this.getValue(comp, this.DiffValues);
      const ind = this.highlightedFields.findIndex(h => h.comp === comp && h.arrayInd === arrayInd);
      if (val1 === val2) {
        if (ind > -1) this.highlightedFields.splice(ind, 1);
      } else {
        if (ind === -1) this.highlightedFields.push({comp, arrayInd});
      }
    }
  }

  getDiffHighlight(comp: IComponent, arrayInd: number = -1): boolean {
    if (!this.DiffValues || !this.highlightedFields ) return false;
    const h = this.highlightedFields.find(h => h.comp === comp && h.arrayInd === arrayInd);
    return !!h;
  }


  getPropValue(comp: IComponent, prop: string): any {
    if (typeof comp[prop] === 'undefined') {
      return undefined;
    } else if (typeof comp[prop] === 'function') {
      return comp[prop](this, comp);
    } else {
      return comp[prop];
    }
  }

  getLabel(comp: IComponent): string {
    return this.getPropValue(comp, 'label') + (comp.required ? this.Settings.requiredSuffix : '');
  }
  private hasNoValue(value: any): boolean {
    const typ = this.checkValueType(value);
    let noVal = false;
    if (typ === IValueType.undefined || typ === IValueType.null) {
      noVal = true;
    } else if (typ === IValueType.string && value === '') {
      noVal = true;
    } else if (typ === IValueType.array && value.length === 0) {
      noVal = true;
    }
    return noVal;

  }

  getParentValues(comp: IComponent, values: any, arrayInd: number = -1): any {
    const pcomp = comp.parentComp;
    if (pcomp && pcomp.type === ComponentType.datatable) {
      let ind = arrayInd;
      if (ind === -1) {
        const typ = this.checkValueType(pcomp.curRowInd);
        if (typ === IValueType.number) {
          ind = pcomp.curRowInd;
        }
      }
      if (ind > -1) {
        return values[pcomp.field][ind];
      }
      return null;
    }
    return values;
  }

  getValue(comp: IComponent, values: any = null, arrayInd: number = -1): any {  //values could be diff-values
    if (!comp.field) {
      console.error('field not specified !');
      console.dir(JSON.stringify(comp));
      return undefined;
    }
    const Values = this.getParentValues(comp, values || this.Values, arrayInd);
    const val = get(Values, comp.field);

    if (this.hasNoValue(val)) {
      if (comp.type === 'checkbox') {
        return false;
      }
      if (comp.type === ComponentType.datatable) {
        return [];
      }
      return '';
    }
    return val;
  }

  updateValue(comp: IComponent, val: any, arrayInd: number = -1): void {

    if (!comp.field) {
      console.error('field not specified !');
      console.dir(JSON.stringify(comp));
      return;
    }

    const Values = this.getParentValues(comp, this.Values, arrayInd);

    if (comp.dataType === DataType.float) {
      val = parseFloat(val);
      if (isNaN(val)) val = null;

    } else if (comp.dataType === DataType.int) {
      val = parseInt(val);
      if (isNaN(val)) val = null;
    }

    const curVal = get(Values, comp.field);
    if (curVal === val) return;
    set(Values, comp.field, val);
    this.validate(comp, val);

    if (comp.onChange) {
      comp.onChange(this, comp, val);
    }

    this.InitDiffHighlightComp(comp, arrayInd);

    this.ValuesChanged = true;
  }

  validate(comp: IComponent, value: any, arrayInd: number = -1): void {
    let msg = '';
    if (this.hasNoValue(value) && comp.required) {
      msg = `${this.Strings.required}`;
    } else if (comp.validate) {
      msg = comp.validate(this, comp, value);
    }
    if (msg) {
      this.addError(comp, msg, arrayInd);
    } else {
      this.removeError(comp, arrayInd);
    }
  }

  validateAll() {
    this.Errors = []
    this.validate(this.Schema, '');
    this.traverseSchema(c => {
      if (c.field) {
        if (c.type === ComponentType.datatable) {
          const arrVal = get(this.Values, c.field);
          this.validate(c, arrVal);
          const typ = this.checkValueType(arrVal);
          if (typ === IValueType.array) {
            arrVal.forEach((obj, ind) => {
              c.children.forEach(comp => {
                const value = get(obj, comp.field);
                this.validate(comp, value, ind);
              })
            })
          }
        } else if (!this.fieldIsInDataTable(c)) {
          const value = this.getValue(c);
          this.validate(c, value);
        }
      }
    });
    this.AllValidated = true;
  }

  private addError(comp: IComponent, msg: string, arrayInd: number) {
    const error = this.Errors.find(e => e.comp === comp && e.arrayInd === arrayInd);
    if (error) {
      error.error = msg;
    } else {
      this.Errors.push({
        comp: comp,
        arrayInd: arrayInd,
        error: msg
      });
    }
  }

  private removeError(comp: IComponent, arrayInd: number) {
    const ind = this.Errors.findIndex(e => e.comp === comp && e.arrayInd === arrayInd);
    if (ind > -1) {
      this.Errors.splice(ind, 1);
    }
  }

  removeAllErrors() {
    this.Errors = [];
  }

  getError(comp: IComponent) {
    const arrayInd = comp.parentComp && comp.parentComp.type === ComponentType.datatable && comp.parentComp.curRowInd ? comp.parentComp.curRowInd : -1;
    const error = this.Errors.find(e => e.comp === comp && e.arrayInd === arrayInd);
    return error ? error.error : '';
  }

  getStyle(comp: IComponent, stylename: string): string {
    if (stylename === '') {
      const width = comp.width ? `width: ${comp.width};` : '';
      const style = comp.style ?? '';
      return `${width}${style}`;
    } else {
      if (comp.styles && comp.styles[stylename]) {
        return comp.styles[stylename];
      } 
    }

  }

  getCompByName(name: string): IComponent | undefined {
    let comp;
    const o: ITraverseOptions = {done: false, fullTraverse: true};
    this.traverseSchema(c => {
      if (c.name === name) {
        o.done = true;
        comp = c;
      }
    }, o);
    return comp;
  }

  getCompByField(field: string): IComponent | undefined {
    let comp;
    const o: ITraverseOptions = {done: false};
    this.traverseSchema(c => {
      if (c.field === field) {
        o.done = true;
        comp = c
      };
    });
    return comp;
  }

  selectOptionsAsObjects(comp: IComponent): ISelectOptionItems {
    const val = this.getPropValue(comp, 'options');
    if (!val || !Array.isArray(val) || val.length === 0) return [];
    let ret: ISelectOptionItems = [];
    if (typeof val[0] === "string") {
      val.forEach(item => ret.push({ value: item, text: item }));
      return ret;
    } else {
      return val;
    }
  }

  selectOptionsAsStrings(comp: IComponent): string[] {
    const val = this.getPropValue(comp, 'options');
    if (!val || !Array.isArray(val) || val.length === 0) return [];
    let ret: string[] = [];
    if (typeof val[0] === "object") {
      val.forEach(item => ret.push(item.text));
      return ret;
    } else {
      return val;
    }
  }

  getColsClass(comp: IComponent, prop: string = 'cols'): string {
    let ret: string = this.getPropValue(comp, prop) || '';
    let xs = ret.indexOf('xs') > -1 ? ret.substr(ret.indexOf('xs') + 3, 2) : '12';
    let sm = ret.indexOf('sm') > -1 ? ret.substr(ret.indexOf('sm') + 3, 2) : xs;
    let md = ret.indexOf('md') > -1 ? ret.substr(ret.indexOf('md') + 3, 2) : sm;
    let lg = ret.indexOf('lg') > -1 ? ret.substr(ret.indexOf('lg') + 3, 2) : md;
    return `col-xs-${xs} col-sm-${sm} col-md-${md} col-lg-${lg}`
  }

  getAppearance(comp: IComponent): IAppearance {
    if (comp.appearance) return comp.appearance;
    if (this.Schema.appearance) return this.Schema.appearance;
    return 'standard';
  }

  usesGrid(comp: IComponent): boolean {
    if (!comp.children) return false;
    const hasGrid = comp.children.find(f => f.cols);
    return !!hasGrid;
  }

  DoFocus(comp: IComponent, arrayInd: number = -1) {
    const ok = this.MakeVisible(comp, arrayInd);
    if (ok) setTimeout(() => this.OnFocus.next(comp), 100);
  }

 
  MakeVisible(comp: IComponent, arrayInd: number): boolean {
    let curTab: IComponent = null;
    let cur = comp;
    let ok = true;

    while (cur && cur.parentComp && ok) {
      if (this.Schema.onMakeVisible) this.Schema.onMakeVisible(this, cur);
      if (cur.parentComp.type == ComponentType.expansionspanel) {
        ok = !cur.parentComp.disabled;
        if (ok) cur.parentComp.expanded = true;
      } else if (cur.parentComp.type == ComponentType.tab) {
        curTab = cur.parentComp;
      } else if (cur.parentComp.type == ComponentType.tabs) {
        if (curTab && cur.parentComp.children && Array.isArray(cur.parentComp.children)) {
          ok = !curTab.disabled;
          if (ok) {
            const ind = cur.parentComp.children.indexOf(curTab);
            cur.parentComp.selectedTabIndex = ind;
          }
        }
      } else if (this.fieldIsInDataTable(cur)) {
        let p = cur.parentComp;
        while (p && p.type !== ComponentType.datatable) {
          p = p.parentComp;
        }
        if (p  && p.type === ComponentType.datatable) p.curRowInd = arrayInd;
      }
      cur = cur.parentComp;
    }
    return ok;

  }

  traverseSchema(fn: ITraverseCallback, options?: ITraverseOptions, comp?: IComponent, parentComp?: IComponent) {
    if (options && options.done) return;
    
    if (!comp) comp = this.Schema;

    fn(comp, parentComp, options);

    if (comp.children) {
      comp.children.forEach(c => this.traverseSchema(fn, options, c, comp));
    }
    if (options && options.fullTraverse) {
      if (comp.menu) {
        comp.menu.forEach(c => this.traverseSchema(fn, options, c, comp));
      }
    }
  }

  fieldIsInDataTable(comp: IComponent): boolean {
    let p = comp.parentComp;
    while (p) {
      if (p.type === ComponentType.datatable) {
        return true;
      }
      p = p.parentComp;
    }
    return false;
  }

  checkValueType(val: any): IValueType {
    if (typeof val === 'undefined') {
      return IValueType.undefined;
    } else if (val === null) {
      return IValueType.null;
    } else if (typeof val === 'string') {
      return IValueType.string;
    } else if (typeof val === 'number') {
      return IValueType.number;
    } else if (typeof val === 'boolean') {
      return IValueType.boolean;
    } else if (typeof val === 'function') {
      return IValueType.function;
    } else if (Array.isArray(val)) {
      return IValueType.array;
    } else if (typeof val === 'object') {
      if (val.type) {
        return IValueType.component;
      } else {
        return IValueType.object;
      }
    }

  }

  CheckSchema(): ISchemaError[] {
    //todo
    // check type in keys
    // datatable not in datatable

    const notype = 'type Property is missing';
    const noChild = 'children Property is missing';
    const zeroChild = 'children Property has no entry';
    const noField = 'field Property is missing';
    const noLabel = 'label Property is missing';
    const doubleField = 'field Property is more than once used!';
    const doubleName = 'name Property is more than once used!';
    const noSummary = 'summary is necessary in datatable cardview';
    const noOptions = 'options Property is necessary';
    const noIcon = 'icon Property is necessary';
    const unn = prop => `Unnecessary Property "${prop}"`;
    const err = (msg: string, comp: IComponent): string => `${msg}${comp.name ? ', name: "' + comp.name + '"' : ''}${comp.field ? ', field: "' + comp.field + '"' : ''}`;

    const containers: ComponentType[] = [ComponentType.form, ComponentType.card, ComponentType.panel, ComponentType.expansionspanel, ComponentType.tabs, ComponentType.tab, ComponentType.toolbar, ComponentType.datatable];
    const fields: ComponentType[] = [ComponentType.input, ComponentType.select, ComponentType.date, ComponentType.checkbox, ComponentType.switch, ComponentType.radiogroup, ComponentType.slider, ComponentType.datatable];
    const noLabels: ComponentType[] = [ComponentType.divider, ComponentType.tabs, ComponentType.panel, ComponentType.html, ComponentType.errorpanel, ComponentType.icon, ComponentType.form, ComponentType.button, ComponentType.icon];

    const Errs: ISchemaError[] = [];
    const AddErr = (comp: IComponent, msg: string, isError: boolean) => {
      const type = isError ? ISchemaErrorType.error : ISchemaErrorType.warning;
      Errs.push({ comp, error: err(msg, comp), type });
    }

    const ck = Object.keys(ComponentKeys);
    const sk = Object.keys(SchemaKeys).concat(ck);
    const duplicateFields = [];
    const duplicateNames = [];

    //Check components 
    const o: ITraverseOptions = {fullTraverse: true};
    this.traverseSchema(c => {
      if (!c.type) {
        AddErr(c, notype, true);
      } else {
        if (containers.indexOf(c.type as ComponentType) >= 0) {
          if (!c.children) {
            AddErr(c, noChild, true);
          } else {
            const typ = this.checkValueType(c.children);
            if (typ !== IValueType.array || c.children.length === 0) {
              AddErr(c, zeroChild, true);
            }
          }
        }

        if (fields.indexOf(c.type as ComponentType) >= 0 && (!c.field)) AddErr(c, noField, true);
        if (noLabels.indexOf(c.type as ComponentType) === -1 && (this.checkValueType(c.label) === IValueType.undefined)) AddErr(c, noLabel, false);

        if ((c.type === ComponentType.select || c.type === ComponentType.radiogroup) && !c.options) AddErr(c, noOptions, true);
        if (c.type === ComponentType.datatable && c.cardView && !c.summary) AddErr(c, noSummary, true);
        if ((c.type === ComponentType.icon) && !c.icon) AddErr(c, noIcon, true);
      }

      if (c.field) {
        let field = c.field
        if (c.parentComp && c.type === ComponentType.datatable) {
          field = c.parentComp.field + '.' + field;
        }
        duplicateFields[field] ? AddErr(c, doubleField, true) : duplicateFields[field] = true;
      }

      if (c.name) {
        let name = c.name
        if (c.parentComp) {
          let pname = c.parentComp.name ? c.parentComp.name : (c.parentComp.field ? c.parentComp.field : '');
          name = pname + '.' + name;
        }
        duplicateNames[name] ? AddErr(c, doubleName, true) : duplicateNames[name] = true;
      }

      const propKeys = c.parentComp ? ck : sk;
      Object.keys(c).forEach(k => {
        if (propKeys.indexOf(k) === -1) AddErr(c, unn(k), false);
      });
    }, o);

    return Errs;
  }



}
