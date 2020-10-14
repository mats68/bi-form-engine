# @next-gen/formular-engine
  Package Source ist in projects/bi-formular-engine.
  Im root-verzeichnis ist ein test app die man starten kann mit `ng serve` 

## Development of @next-gen/formular-engine
(im root verzeichnis)   
- `npm run b`  
  für build oder 
- `npm run w`  
  für watch

## npm package publish
- vorher builden   
  Built package befindet sich im dist-folder ("dist/bi-formular-engine")

- `npm run pub`  
   um version-number zu erhöhen und publishen

## Installation @next-gen/formular-engine in app

Es müssen zuerst dependencies installert werden (moment.js zur Datumsformatierung):  

ng add @angular/material  
npm i moment  
npm i @angular/material-moment-adapter  

npm i @next-gen/formular-engine  
