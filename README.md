# dmn-js-differ


A semantic diffing utility for DMN 1.3 files. To be used together with [bpmn-moddle](https://github.com/bpmn-io/dmn-moddle).


## Usage

Get the project via [TBD]:

```
npm install --save dmn-js-differ
```

Use the differ to compare two DMN 1.3 documents:

```javascript
import { diff } from 'dmn-js-differ';

var oldDefinitions, newDefinitions; // read with dmn-moddle

var changes = diff(oldDefinitions, newDefinitions);
```

The diff returns an object with the `_changed`, `_added`, `_removed`, `_layoutChanged` keys containing all differences between the models.

```javascript
console.log(changes._changed);
// {
//   Decision_1: {
//     model: { $type: 'dmn:DecisionTable', id: 'Decision_1', ... },
//     attrs: { name: { oldValue: '', newValue: 'T' } }
//   }
// }

console.log(changes._removed);
// {
//   InputClause_1: { $type: 'dmn:InputClause', id: 'InputClause_1' }
// }

console.log(changes._layoutChanged);
// {
//   OutputClause_1: { $type: 'dmn:OutputClause', id: 'OutputClause_1' }
// }

console.log(changes._added);
// {
//   DecisionRule_1: { $type: 'dmn:DecisionRule', id: 'DecisionRule_1' }
// }
```

## Reading DMN 1.3 documents

Get [dmn-moddle](https://github.com/bpmn-io/dmn-moddle) via npm:

```
npm install --save dmn-moddle
```

Load two diagrams:

```javascript
import DmnModdle from 'dmn-moddle';

function loadModels(a, b) {

  new DmnModdle().fromXML(a, function(err, adefs) {

    if (err) {
      return done(err);
    }

    new DmnModdle().fromXML(b, function(err, bdefs) {
      if (err) {
        return done(err);
      } else {
        return done(null, adefs, bdefs);
      }
    });
  });
}


loadModels(aXML, bXML, function(err, aDefinitions, bDefinitions) {

  // go ahead and use the models
});
```

## Visual Diffing

[TBD]


## License

MIT
