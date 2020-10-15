import { strings } from './strings';
import { ISchema, IComponent, ComponentType, ISelectOptionItems, DataType, IScreenSize, IAppearance, SchemaKeys, ComponentKeys } from './types';
import { err_schema, err_notype, err_typewrong, err_noChild, err_zeroChild, err_noField, err_noLabel, err_doubleField, err_doubleName, err_noSummary, err_noOptions, err_OptionsArray, err_zeroOptions, err_wrongOptions, err_OptionsDoubleValues, err_noIcon, err_unn } from './constants'
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
  error: string;
  type: ISchemaErrorType;
  comp: IComponent;
}


export class SchemaManager {
  Schema: ISchema;
  Values: any;
  DiffValues: any;
  MemValues = {};
  ValuesChanged: boolean;
  Settings: ISettings;
  Strings: any;

  Errors: IError[];
  SchemaErrors: ISchemaError[];
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
    this.SchemaErrors = []
    if (this.checkValueType(schema) !== IValueType.component) {
      this.SchemaErrors.push({ type: ISchemaErrorType.error, error: err_schema, comp: this.Schema })
      return;
    }

    this.Schema = cloneDeep(schema);
    if (this.Schema.inheritFrom) this.InitInherits();
    this.Errors = [];
    this.AllValidated = false;
    if (this.Schema.onInitSchema) this.Schema.onInitSchema(this);
    this.traverseSchema((c, p) => {
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
      const o: ITraverseOptions = { fullTraverse: true };
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
          if (c.type !== ComponentType.datatable && !this.fieldIsInDataTable(c)) {
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
        if (ind === -1) this.highlightedFields.push({ comp, arrayInd });
      }
    }
  }

  getDiffHighlight(comp: IComponent, arrayInd: number = -1): boolean {
    if (!this.DiffValues || !this.highlightedFields) return false;
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
      console.error('field not specified ! name: ', comp.name, 'type: ', comp.type);
      return undefined;
    }
    let Values = values ? values : comp.unbound ? this.MemValues : this.Values
    Values = this.getParentValues(comp, Values, arrayInd);
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
      console.error('field not specified ! name: ', comp.name, 'type: ', comp.type);
      return;
    }

    let Values = comp.unbound ? this.MemValues : this.Values
    Values = this.getParentValues(comp, Values, arrayInd);

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
    // this.validate(comp, val, arrayInd);

    if (comp.onChange) {
      comp.onChange(this, comp, val);
    }

    if (this.Schema.onChange) {
      this.Schema.onChange(this, comp, val);
    }

    this.InitDiffHighlightComp(comp, arrayInd);

    this.ValuesChanged = true;
  }

  validate(comp: IComponent, value: any, arrayInd: number = -1): void {
    this.removeErrors(comp, arrayInd);
    if (this.hasNoValue(value) && comp.required) {
      this.addErrors(comp, `${this.Strings.required}`, arrayInd);
    }
    if (comp.validate) {
      const errs = comp.validate(this, comp, value);
      this.addErrors(comp, errs, arrayInd);
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
    if (this.Schema.validate) {
      const errs = this.Schema.validate(this, this.Schema, null);
      this.addErrors(this.Schema, errs);
    }
    this.AllValidated = true;
  }

  private addErrors(comp: IComponent, errors?: string | string[], arrayInd?: number) {
    if (this.hasNoValue(errors)) return;
    if (typeof errors === 'string') errors = [errors];
    const errs: IError[] = errors.map(error => {
      return { comp, arrayInd, error };
    });
    this.Errors = this.Errors.concat(errs);
  }

  private removeErrors(comp: IComponent, arrayInd: number) {
    this.Errors = this.Errors.filter(e => !(e.comp === comp && e.arrayInd === arrayInd))
    // const ind = this.Errors.findIndex(e => e.comp === comp && e.arrayInd === arrayInd);
    // if (ind > -1) {
    //   this.Errors.splice(ind, 1);
    // }
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
    const o: ITraverseOptions = { done: false, fullTraverse: true };
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
    const o: ITraverseOptions = { done: false };
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

  private arrayHasDuplicates(arr: any[]): boolean {
    let valuesAlreadySeen = []
    for (let i = 0; i < arr.length; i++) {
      let value = arr[i]
      if (valuesAlreadySeen.indexOf(value) !== -1) {
        return true
      }
      valuesAlreadySeen.push(value)
    }
    return false    

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
        if (p && p.type === ComponentType.datatable) p.curRowInd = arrayInd;
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

  checkOptionsValueType(val: any[]): boolean {
    if (this.checkValueType(val) !== IValueType.array) return false
    if (val.length === 0) return true
    const typ = this.checkValueType(val[0]);
    if (!(typ === IValueType.string || typ === IValueType.object)) return false
    let ok = true
    if (typ === IValueType.string) {
      const nok = !!val.find(o => this.checkValueType(o) !== IValueType.string)
      ok = !nok
    } else {
      let nok = !!val.find(o => this.checkValueType(o) !== IValueType.object)
      ok = !nok
      if (ok) nok = !!val.find(o => (this.checkValueType(o.value) === IValueType.undefined || this.checkValueType(o.text) === IValueType.undefined))
      ok = !nok
    }
    return ok
  }


  CheckSchema(): void {
    //todo
    // check type in keys
    // datatable not in datatable

    this.SchemaErrors = []

    // const err = (msg: string, comp: IComponent): string => `${msg}${comp.name ? ', name: "' + comp.name + '"' : ''}${comp.field ? ', field: "' + comp.field + '"' : ''}`;
    const AddErr = (comp: IComponent, error: string, isError: boolean) => { const type = isError ? ISchemaErrorType.error : ISchemaErrorType.warning; this.SchemaErrors.push({ type, comp, error }) }

    const containers: ComponentType[] = [ComponentType.form, ComponentType.card, ComponentType.panel, ComponentType.expansionspanel, ComponentType.tabs, ComponentType.tab, ComponentType.toolbar, ComponentType.datatable];
    const fields: ComponentType[] = [ComponentType.input, ComponentType.select, ComponentType.date, ComponentType.checkbox, ComponentType.switch, ComponentType.radiogroup, ComponentType.slider, ComponentType.datatable];
    const noLabels: ComponentType[] = [ComponentType.divider, ComponentType.tabs, ComponentType.panel, ComponentType.html, ComponentType.errorpanel, ComponentType.icon, ComponentType.form, ComponentType.button, ComponentType.icon];

    const ck = Object.keys(ComponentKeys);
    const sk = Object.keys(SchemaKeys).concat(ck);
    const tk = Object.values(ComponentType);
    const duplicateFields = [];
    const duplicateNames = [];

    //Check components 
    const o: ITraverseOptions = { fullTraverse: true };
    this.traverseSchema(c => {
      if (!c.type) {
        AddErr(c, err_notype, true);
      } else {
        // @ts-ignore
        if (tk.indexOf(c.type) === -1) {
          AddErr(c, err_typewrong, true);
        }
        if (containers.indexOf(c.type as ComponentType) >= 0) {
          if (!c.children) {
            AddErr(c, err_noChild, true);
          } else {
            const typ = this.checkValueType(c.children);
            if (typ !== IValueType.array || c.children.length === 0) {
              AddErr(c, err_zeroChild, true);
            }
          }
        }

        if (fields.indexOf(c.type as ComponentType) >= 0 && (!c.field)) AddErr(c, err_noField, true);
        if (noLabels.indexOf(c.type as ComponentType) === -1 && (this.checkValueType(c.label) === IValueType.undefined)) AddErr(c, err_noLabel, false);

        if ((c.type === ComponentType.select || c.type === ComponentType.radiogroup) && !c.options) AddErr(c, err_noOptions, true);
        if (c.options) {
          if (this.checkValueType(c.options) !== IValueType.array) {
            AddErr(c, err_OptionsArray, true);
          } else {
            if (c.options.length === 0) {
              AddErr(c, err_zeroOptions, false);
            } else {
              // @ts-ignore
              if (!this.checkOptionsValueType(c.options)) {
                AddErr(c, err_wrongOptions, true);
              } else {
                const o = this.selectOptionsAsObjects(c);
                if (this.arrayHasDuplicates(o.map(i => i.value))) AddErr(c, err_OptionsDoubleValues, true);
              }
            }
          }
        }
        if (c.type === ComponentType.datatable && c.cardView && !c.summaryCard) AddErr(c, err_noSummary, true);
        if ((c.type === ComponentType.icon) && !c.icon) AddErr(c, err_noIcon, true);
      }

      if (c.field) {
        let field = c.field
        if (c.parentComp && c.type === ComponentType.datatable) {
          field = c.parentComp.field + '.' + field;
        }
        duplicateFields[field] ? AddErr(c, err_doubleField, true) : duplicateFields[field] = true;
      }

      if (c.name) {
        let name = c.name
        if (c.parentComp) {
          let pname = c.parentComp.name ? c.parentComp.name : (c.parentComp.field ? c.parentComp.field : '');
          name = pname + '.' + name;
        }
        duplicateNames[name] ? AddErr(c, err_doubleName, true) : duplicateNames[name] = true;
      }

      const propKeys = c.parentComp ? ck : sk;
      Object.keys(c).forEach(k => {
        if (propKeys.indexOf(k) === -1) AddErr(c, err_unn(k), false);
      });
    }, o);
  }



}
