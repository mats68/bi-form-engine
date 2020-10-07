import { SchemaManager } from '../../app/base/schemaManager';
import { ComponentType, IComponent, ISchema } from '../../app/base/types';
import { buttons } from './schemaButtons';

const adress = (PrefField: string, disabled: boolean = false): Array<IComponent> => [
    {
        type: 'input',
        field: PrefField + 'name',
        name: 'name',
        label: 'Name',
        disabled
    },
    {
        type: 'input',
        field: PrefField + 'name2',
        label: '(2. Zeile)',
        disabled
    },
    {
        type: 'input',
        field: PrefField + 'adresse',
        label: 'Adresse',
        disabled
    },
    {
        type: 'input',
        field: PrefField + 'adresse2',
        label: '(2. Zeile)',
        disabled
    },
    {
        type: 'panel',
        noLayout: true,
        children: [
            {
                type: 'input',
                field: PrefField + 'plz',
                width: '100px',
                label: 'PLZ',
                disabled
            },
            {
                label: 'Ort',
                type: 'input',
                field: PrefField + 'ort',
                disabled
            },

        ]
    },
    {
        type: 'input',
        field: PrefField + 'email',
        label: 'E-Mail',
        disabled
    },
    {
        type: 'input',
        field: PrefField + 'tel',
        label: 'Telefon',
        disabled
    },
]

const InitStandardWidth = (sm: SchemaManager) => {
    sm.traverseSchema(c => {
        if (c.type === 'input' || c.type === 'select' || c.type === 'date') {
            if (!c.width) c.width = '300px';
        }

    });
}



const InitSidenav = (sm: SchemaManager) => {
    let menuitems: IComponent[] = [];
    sm.getCompByName('sidenav').children.forEach(c => {
        if (c.children) {
            menuitems.push({
                type: 'button',
                label: c.label,
                style: 'font-weight: 200;',
                name: 'm_' + c.name,
                onClick(sm, comp) {
                    scrollToPanel(sm, comp);
                }
            });
        }
    });
    sm.getCompByName('sidenav').menu = menuitems;
    scrollToPanel(sm, menuitems[0]);
}

const scrollToPanel = (sm: SchemaManager, comp: IComponent) => {
    const pnName = comp.name.substring(2);
    const sn = sm.getCompByName('sidenav');
    sn.menu.forEach(c => {
        c.color = '';
        c.style = 'font-weight: 200;';
    });
    comp.color = 'primary';
    comp.style = 'font-weight: 500;';

    const pn = sm.getCompByName(pnName);
    if (pn && pn.type === 'expansionspanel') {
        const c = pn.children[0];
        if (c) {
            c.expanded = true;
            sm.DoFocus(c);
        }
    } else {
        sm.DoFocus(pn);
    }

}



export const schema_IA: ISchema =
{
    onInitSchema(sm) {
        InitStandardWidth(sm);
        InitSidenav(sm);
        sm.Schema.appearance = 'outline';
    },
    onMakeVisible(sm, comp) {
        if (comp.type === ComponentType.card && comp.hidden && comp.name) {
            const menu = sm.getCompByName('m_' + comp.name);
            if (menu) {
                scrollToPanel(sm, menu);
            }
        }
    },
    type: 'sidenav',
    style: 'min-height: 800px',
    label: 'Installationsanzeige',
    navpos: 'right',
    menu: [],
    name: 'sidenav',
    children: [
        {
            type: 'expansionspanel',
            label: 'Ort der Installation',
            name: 'Ort der Installation',
            children: [
                {
                    type: 'input',
                    multiline: true,
                    field: 'standort',
                    label: 'Standort',
                    disabled: true,
                },
                {
                    type: 'panel',
                    styles: { container: 'display: flex;' },
                    children: [
                        {
                            type: 'input',
                            field: 'gemeinde',
                            label: 'Gemeinde',
                            disabled: true,
                        },
                        {
                            type: 'input',
                            field: 'Parzelle',
                            label: 'Parzelle',
                            width: '100px',
                            disabled: true,
                        },
                    ]
                },
                {
                    type: 'input',
                    field: 'VersicherungsNr',
                    label: 'Versicherungs-Nr.',
                },
                {
                    type: 'input',
                    field: 'gebaeudeart',
                    label: 'Gebäudeart',
                    disabled: true,
                },
                {
                    type: 'input',
                    field: 'anzEinheiten',
                    label: 'Anz. Einheiten / Zähler',
                    width: '100px',
                    mask: '0*',
                },
                {
                    type: 'input',
                    autofocus: true,
                    field: 'Gebäudeteil',
                    label: 'Gebäudeteil',
                },
                {
                    type: 'checkbox',
                    field: 'ZEV',
                    label: 'Zusammenschluss zum Eigenverbrauch (ZEV)',
                },
            ]
        },
        {
            type: 'expansionspanel',
            label: 'Adressen / Geschäftspartner',
            name: 'Adressen / Geschäftspartner',
            children: [
                {
                    type: 'panel',
                    children: [
                        {
                            type: 'input',
                            field: 'Installationsbetrieb',
                            label: 'Installationsbetrieb',
                            disabled: true,
                        },
                        {
                            type: 'input',
                            field: 'Bewilligungs-Nr.',
                            label: 'Bewilligungs-Nr.',
                            disabled: true,
                        },
                        {
                            type: 'input',
                            field: 'Sachbearbeiter',
                            label: 'Sachbearbeiter',
                            disabled: true,
                        },
                        {
                            type: 'input',
                            field: 'Eigentümer',
                            label: 'Eigentümer',
                            disabled: true,
                        },
                        {
                            type: 'radiogroup',
                            field: 'Sprache',
                            label: 'Sprache',
                            required: true,
                            options: ['De', 'Fr', 'It'],
                        },

                    ]
                },
                {
                    type: 'panel',
                    children: [
                        {
                            type: 'select',
                            field: 'zus_adress',
                            label: 'Zusätzliche Adresse',
                            width: '200px',
                            default(sm, comp) {
                                comp.onChange(sm, comp, comp.options[0]);
                                return comp.options[0];
                            },
                            options: ['Verwaltung', 'Architekt'],
                            onChange(sm, comp, val) {
                                sm.getCompByName('pnAdrVerwaltung').hidden = val === comp.options[1];
                                sm.getCompByName('pnAdrArchitekt').hidden = val === comp.options[0];
                            }
                        },
                        {
                            type: 'panel',
                            style: 'margin: 10px;',
                            name: 'pnAdrVerwaltung',
                            hidden: true,
                            children: [
                                ...adress('verwaltung.', true)
                            ]

                        },
                        {
                            type: 'panel',
                            style: 'margin: 10px;',
                            name: 'pnAdrArchitekt',
                            hidden: true,
                            children: [
                                {
                                    type: 'button',
                                    kind: 'stroked',
                                    label: ' Adresse in telsearch.ch suchen...',

                                },
                                ...adress('architekt.')
                            ]

                        },
                    ]
                },
            ]
        },
        {
            type: 'expansionspanel',
            label: 'Installationsbeschrieb',
            name: 'Installationsbeschrieb',
            children: [
                {
                    type: 'input',
                    field: 'installationsbeschrieb',
                    multiline: true,
                    rows: 10,
                    placeholder: '',
                    label: '',
                },
                {
                    type: 'select',
                    field: 'installationstyp',
                    width: '400px',
                    label: 'Typ',
                    multiselect: true,
                    options: ['Neuanlage', 'Änderung/Erweit.', 'Rückbau', 'Bauanschluss', 'Temporär', 'Festplatz']
                }
            ]
        },
        {
            type: 'expansionspanel',
            label: 'Netzanschluss',
            name: 'Netzanschluss',
            children: [
                {
                    type: 'panel',
                    styles: {
                        container: 'display: flex;'
                    },
                    children: [
                        {
                            type: 'input',
                            label: 'Standort',
                            required: true,
                            field: 'StandortNetzanschluss'
                        },
                        {
                            type: 'radiogroup',
                            label: '',
                            options: ['neu', 'bestehend'],
                            field: 'StandortNetzanschlussradio'
                        }
                    ]
                },
            ]
        },
        {
            type: 'expansionspanel',
            label: 'Verbraucher, Erzeuger, Speicher',
            name: 'Verbraucher, Erzeuger, Speicher',
            children: [
                {
                    type: 'switchpanel',
                    field: 'switch_verbraucher',
                    label: 'Liste der Verbraucher, Erzeuger, Speicher',
                    children: [
                        {
                            type: 'panel',
                            style: 'margin-top: 10px; margin-bottom: 10px;',
                            children: [
                                {
                                    type: 'checkbox',
                                    field: 'Liste_gemass_beilage',
                                    label: 'Liste gemäss Beilage'
                                },
                            ]

                        },
                        {
                            type: 'datatable',
                            label: 'Liste der Verbraucher, Erzeuger, Speicher',
                            field: 'Liste_der_Verbraucher',
                            dragdrop: true,
                            cardView: true,
                            summary(sm, comp, row) {
                                const bezeichnung = row.bezeichnung ? `Bezeichnung: <b>${row.bezeichnung}</b><br/>` : '';
                                const anzahl = row.anzahl_v ? `Anzahl: <b>${row.anzahl_v}</b><br/>` : '';
                                return {
                                    type: 'html',
                                    html: `${bezeichnung} ${anzahl}`
                                }
                            },
                            children: [
                                {
                                    type: 'input',
                                    field: 'anzahl_v',
                                    label: 'Anzahl',
                                    dataType: 'int',
                                    mask: '0*',
                                },
                                {
                                    type: 'panel',
                                    styles: { container: 'display: flex;' },
                                    children: [
                                        {
                                            type: 'checkbox',
                                            field: 'verbr',
                                            label: 'Verbr.',
                                        },
                                        {
                                            type: 'checkbox',
                                            field: 'erz',
                                            label: 'Erz.',
                                        },
                                        {
                                            type: 'checkbox',
                                            field: 'spei',
                                            label: 'Spei.',
                                        },
                                    ]
                                },

                                {
                                    type: 'input',
                                    field: 'bezeichnung',
                                    label: 'Bezeichnung des Verbrauchers, Erzeugers, Speichers ',
                                    options: ['Beleuchtung', 'Kochherd mit Backofen', 'Kochherd ohne Backofen', 'Backofen', 'Geschirrspüler', 'Waschautomat', 'Waschautomat mit Zählerumschalter', 'Wäschetrockner', 'Boiler .... l, Aufheizzeit .... h', 'Motoren ohne Anschlussgesuch', 'Motoren mit Anschlussgesuch', 'Wärmepumpe ohne Anschlussgesuch', 'Wärmepumpe mit Anschlussgesuch', 'Apparat Netzrückwirkungen verursachend'],
                                },
                                {
                                    type: 'date',
                                    field: 'tag_date',
                                    label: 'techn. Anschlussgesuch (TAG) vom',
                                },
                                {
                                    type: 'input',
                                    field: 'anzahl',
                                    label: 'Leistung Bezug',
                                    tooltip: 'Leistung Bezug vom Netz [kVA]',
                                    dataType: 'float',
                                    mask: '0*.0*',
                                },

                            ]
                        },
                        {
                            type: 'input',
                            dataType: 'float',
                            mask: '0*.0*',
                            label: 'Leistung Total Bezug vom Netz',
                            field: 'LeistungBezugNetz',
                            disabled: true,
                            suffix: 'kVA',
                        },
                        {
                            type: 'input',
                            dataType: 'float',
                            mask: '0*.0*',
                            label: 'Leistung Total Abgabe ans Netz',
                            field: 'LeistungAbgabeNetz',
                            disabled: true,
                            suffix: 'kVA',
                        },
                        {
                            type: 'input',
                            dataType: 'float',
                            mask: '0*.0*',
                            label: 'Voraussichtliche Maximalbelastung Total',
                            field: 'LeistungMaximalbelastungNetz',
                            suffix: 'kVA',
                        },
                        {
                            type: 'panel',
                            children: [
                                {
                                    type: 'checkbox',
                                    field: 'aktiveSteuerungVNB',
                                    label: 'aktive Steuerung VNB',
                                },
                            ]
                        }


                    ]
                }
            ]
        },
        {
            type: 'expansionspanel',
            label: 'Mess- und Steuereinrichtungen',
            name: 'Mess- und Steuereinrichtungen',
            children: [
                {
                    type: 'datatable',
                    label: 'Liste der Mess- und Steuereinrichtungen',
                    field: 'steuereinrichtungen',
                    required: true,
                    cardView: true,
                    dragdrop: true,
                    summary(sm, comp, row) {
                        const kunde = row.kunde ? `Kunde: <b>${row.kunde}</b><br/>` : '';
                        const rechnungsadresse = row.rechnungsadresse ? ` Rechnungsadresse: ${row.rechnungsadresse}` : '';
                        const gebaeudeteil = row.gebaeudeteil ? ` Gebäudeteil: ${row.gebaeudeteil}` : '';
                        return {
                            type: 'html',
                            html: `${kunde} ${rechnungsadresse} ${gebaeudeteil}`
                        }
                    },
                    children: [
                        {
                            type: 'input',
                            label: 'Kunde',
                            field: 'kunde',
                            width: '400px',
                            required: true,
                        },
                        {
                            type: 'input',
                            label: 'Rechnungsadresse',
                            field: 'rechnungsadresse',
                            width: '400px',
                            required: true,
                        },
                        {
                            type: 'input',
                            label: 'Gebäudeteil',
                            field: 'gebaeudeteil',
                        },
                        {
                            type: 'input',
                            label: 'Nutzung',
                            field: 'nutzung',
                        },
                        {
                            type: 'input',
                            label: 'Verbrauchsstelle VNB',
                            field: 'Verbrauchsstelle',
                        },
                        {
                            type: 'panel',
                            styles: { container: 'display: flex;' },
                            children: [
                                {
                                    type: 'input',
                                    label: 'Stockwerk',
                                    field: 'Stockwerk',
                                    width: '250px',
                                    options: ['Allg.', 'UG', 'EG', '1. OG', '2. OG'],
                                },
                                {
                                    type: 'input',
                                    label: 'Raumnummer',
                                    field: 'Raumnummer',
                                    width: '150px',
                                },

                            ]
                        },
                        {
                            type: 'input',
                            label: 'VNB Tarif',

                            field: 'VNBTarif',
                        },
                        {
                            type: 'input',
                            label: 'Sich.',
                            width: '100px',
                            field: 'sicher',
                        },
                        {
                            type: 'input',
                            label: 'Zählernummer VNB',
                            field: 'Zählernummer',
                        },
                        {
                            type: 'input',
                            label: 'Mont. Ort',
                            field: 'Mont',
                        },
                        {
                            type: 'panel',
                            noLayout: true,
                            children: [
                                {
                                    type: 'checkbox',
                                    label: 'ZEV',
                                    field: 'zev',
                                },
                                {
                                    type: 'checkbox',
                                    label: 'neu.',
                                    field: 'neu',
                                },
                                {
                                    type: 'checkbox',
                                    label: 'vorh.',
                                    field: 'vorh',
                                },
                                {
                                    type: 'checkbox',
                                    label: 'ausw.',
                                    field: 'ausw',
                                },
                                {
                                    type: 'checkbox',
                                    label: 'dem.',
                                    field: 'dem',
                                },
                                {
                                    type: 'checkbox',
                                    label: 'umm.',
                                    field: 'umm',
                                },
                            ]
                        },
                    ]

                },

            ]

        },
        {
            type: 'switchpanel',
            label: 'Bemerkungen',
            name: 'Bemerkungen',
            field: 'switcher_bemerkungen',
            children: [
                {
                    type: 'input',
                    multiline: true,
                    width: '400px',
                    rows: 6,
                    label: 'Bemerkungen',
                    field: 'testw'
                }

            ]
        },
        {
            type: 'switchpanel',
            label: 'Beilagen',
            name: 'Beilagen',
            field: 'switcher_Beilagen',
            children: [
                {
                    type: 'panel',
                    children: [
                        {
                            type: 'checkbox',
                            label: 'Schema',
                            field: 'schema'
                        },
                        {
                            type: 'checkbox',
                            label: 'Situationsplan',
                            field: 'Situationsplan'
                        },
                        {
                            type: 'panel',
                            styles: { container: 'display: flex; align-items: center;' },
                            children: [
                                {
                                    type: 'checkbox',
                                    label: 'Anschlussgesuch TAG für',
                                    field: 'anschlussgesuch',
                                    onChange(sm, comp, val) {
                                        sm.getCompByField('anschlussgesuchtext').disabled = !val;
                                        if (val) sm.DoFocus(sm.getCompByField('anschlussgesuchtext'));
                                    }
                                },
                                {
                                    type: 'input',
                                    appearance: 'standard',
                                    label: 'Text',
                                    field: 'anschlussgesuchtext',
                                    disabled: true,
                                    //     disabled(sm, comp) {
                                    //         return !sm.getValue(sm.getCompByName('anschlussgesuch'));
                                    //     },
                                },
                            ]
                        },
                        {
                            type: 'checkbox',
                            label: 'Disposition Hauptverteilung',
                            field: 'DispositionHauptverteilung'
                        },
                        {
                            type: 'checkbox',
                            label: 'Zustimmung Endverbraucher',
                            tooltip: 'Zustimmung Endverbraucher/Erzeuger Steuerung durch VNB',
                            field: 'ZustimmungEndverbraucher',
                        },
                        {
                            type: 'panel',
                            styles: { container: 'display: flex; align-items: center;' },
                            children: [
                                {
                                    type: 'checkbox',
                                    label: '',
                                    field: 'beilagenadd',
                                    onChange(sm, comp, val) {
                                        sm.getCompByField('beilagenaddtext').disabled = !val;
                                        if (val) sm.DoFocus(sm.getCompByField('beilagenaddtext'));
                                    }
                                },
                                {
                                    type: 'input',
                                    label: 'Text',
                                    appearance: 'standard',
                                    field: 'beilagenaddtext',
                                    disabled: true,
                                },
                            ]
                        },
                    ]
                },
            ]
        },
        // ...buttons

    ]
}


export const values_IA = {
    standort: 'Bernstrasse 128\n3072 Ostermundigen',
    gebaeudeart: 'MFH',
    gemeinde: 'Muri',
    anzEinheiten: 1,
    installationsbeschrieb: 'Neubau\nmit div Geräten',
    installationstyp: ['Neuanlage'],
    Parzelle: '2',
    VersicherungsNr: '120',
    zus_adress: 'Verwaltung',
    verwaltung: {
        name: 'Markus Plattenbeläge',
        name2: 'Zementfliesen',
        adresse: 'Bleienbachstrasse 26b',
        plz: '4900',
        ort: 'Langenthal',
        tel: '079 603 64 04',
    },
    steuereinrichtungen: [
        {
            kunde: "Meier, Bern",
            rechnungsadresse: 'Bernstrasse 111, 3001 Bern',
            gebaeudeteil: '1. OG',
            Raumnummer: '2',
            zev: true,
        },
        {
            kunde: "Karrer, Zürich",
            rechnungsadresse: 'Brandschenkestrasse 90, 8002 Zürich',
            gebaeudeteil: '1. UG',
            Raumnummer: '1',
        },
    ]



}