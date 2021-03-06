import {
  expect
} from 'chai';

import {
  readFileSync
} from 'fs';

import DmnModdle from 'dmn-moddle';

import {
  Differ,
  diff,
  camundaScheme
} from '../../lib';

import SimpleChangeHandler from '../../lib/change-handler';


describe('diffing', function() {

  it('should discover table add', function(done) {

    var aDiagram = readFileSync('test/fixtures/dmn/add-table/before.dmn', 'utf-8');
    var bDiagram = readFileSync('test/fixtures/dmn/add-table/after.dmn', 'utf-8');

    // when
    testDmnDiff(aDiagram, bDiagram, function(err, results, aDefinitions, bDefinitions) {

      if (err) {
        return done(err);
      }

      // then
      expect(results._added).to.have.keys(['Decision_2']);
      expect(results._removed).to.eql({});
      expect(results._layoutChanged).to.eql({});
      expect(results._changed).to.eql({});

      done();
    });
  });

  it('should discover table field change', function(done) {

    var aDiagram = readFileSync('test/fixtures/dmn/change-table/before.dmn', 'utf-8');
    var bDiagram = readFileSync('test/fixtures/dmn/change-table/after.dmn', 'utf-8');

    // when
    testDmnDiff(aDiagram, bDiagram, function(err, results, aDefinitions, bDefinitions) {

      if (err) {
        return done(err);
      }

      // then
      expect(results._added).to.eql({});
      expect(results._removed).to.eql({});
      expect(results._layoutChanged).to.eql({});
      expect(results._changed).to.have.keys(['Decision_1', 'LiteralExpression_11bnf50', 'UnaryTests_16zmfgt']);

      expect(results._changed['LiteralExpression_11bnf50'].attrs).to.deep.eql({
        text: { oldValue: 'ausgabe2', newValue: 'ausgabe2-change' }
      });

      expect(results._changed['UnaryTests_16zmfgt'].attrs).to.deep.eql({
        text: { oldValue: 'eingabe1', newValue: 'eingabe1-change' }
      });

      done();
    });
  });

  it('should discover table drop', function(done) {

    var aDiagram = readFileSync('test/fixtures/dmn/drop-table/before.dmn', 'utf-8');
    var bDiagram = readFileSync('test/fixtures/dmn/drop-table/after.dmn', 'utf-8');

    // when
    testDmnDiff(aDiagram, bDiagram, function(err, results, aDefinitions, bDefinitions) {

      if (err) {
        return done(err);
      }

      // then
      expect(results._added).to.eql({});
      expect(results._removed).to.have.keys(['Decision_2']);
      expect(results._layoutChanged).to.eql({});
      expect(results._changed).to.eql({});

      done();
    });
  });

  it('should discover change hit policy', function(done) {

    var aDiagram = readFileSync('test/fixtures/dmn/change-policy/before.dmn', 'utf-8');
    var bDiagram = readFileSync('test/fixtures/dmn/change-policy/after.dmn', 'utf-8');

    // when
    testDmnDiff(aDiagram, bDiagram, function(err, results, aDefinitions, bDefinitions) {

      if (err) {
        return done(err);
      }

      // then
      expect(results._added).to.eql({});
      expect(results._removed).to.eql({});
      expect(results._layoutChanged).to.eql({});
      expect(results._changed).to.have.keys(['Decision_1', 'DecisionTable_0zjc24h']);

      expect(results._changed['DecisionTable_0zjc24h'].attrs).to.deep.eql({
        hitPolicy: { oldValue: 'FIRST', newValue: 'COLLECT' }
      });

      done();
    });
  });

  it('should discover change hit policy unique', function(done) {

    var aDiagram = readFileSync('test/fixtures/dmn/change-policy-unique/before.dmn', 'utf-8');
    var bDiagram = readFileSync('test/fixtures/dmn/change-policy-unique/after.dmn', 'utf-8');

    // when
    testDmnDiff(aDiagram, bDiagram, function(err, results, aDefinitions, bDefinitions) {

      if (err) {
        return done(err);
      }

      // then
      expect(results._added).to.eql({});
      expect(results._removed).to.eql({});
      expect(results._layoutChanged).to.eql({});
      expect(results._changed).to.have.keys(['DecisionTable_0zjc24h']);

      expect(results._changed['DecisionTable_0zjc24h'].attrs).to.deep.eql({
        hitPolicy: { oldValue: 'UNIQUE', newValue: 'FIRST' }
      });

      done();
    });
  });

  it('should discover change hit policy unique (reversed)', function(done) {

    var aDiagramRev = readFileSync('test/fixtures/dmn/change-policy-unique/before.dmn', 'utf-8');
    var bDiagramRev = readFileSync('test/fixtures/dmn/change-policy-unique/after.dmn', 'utf-8');

    // when
    testDmnDiff(bDiagramRev, aDiagramRev, function(err, results, aDefinitions, bDefinitions) {

      if (err) {
        return done(err);
      }

      // then
      expect(results._added).to.eql({});
      expect(results._removed).to.eql({});
      expect(results._layoutChanged).to.eql({});
      expect(results._changed).to.have.keys(['Decision_1', 'DecisionTable_0zjc24h']);

      expect(results._changed['Decision_1', 'DecisionTable_0zjc24h'].attrs).to.deep.eql({
        hitPolicy: { oldValue: 'FIRST', newValue: 'UNIQUE'  }
      });

      done();
    });
  });

  it('should discover change hit policy aggregation', function(done) {

    var aDiagram = readFileSync('test/fixtures/dmn/change-policy-agg/before.dmn', 'utf-8');
    var bDiagram = readFileSync('test/fixtures/dmn/change-policy-agg/after.dmn', 'utf-8');

    // when
    testDmnDiff(aDiagram, bDiagram, function(err, results, aDefinitions, bDefinitions) {

      if (err) {
        return done(err);
      }

      // then
      expect(results._added).to.eql({});
      expect(results._removed).to.eql({});
      expect(results._layoutChanged).to.eql({});
      expect(results._changed).to.have.keys(['Decision_1', 'DecisionTable_0zjc24h']);

      expect(results._changed['DecisionTable_0zjc24h'].attrs).to.deep.eql({
        aggregation: { oldValue: undefined, newValue: 'SUM' },
        hitPolicy: { oldValue: 'PRIORITY', newValue: 'COLLECT' },
      });

      done();
    });
  });

  it('should discover change hit policy aggregation (reverse)', function(done) {

    var aDiagramRev = readFileSync('test/fixtures/dmn/change-policy-agg/before.dmn', 'utf-8');
    var bDiagramRev = readFileSync('test/fixtures/dmn/change-policy-agg/after.dmn', 'utf-8');

    // when
    testDmnDiff(bDiagramRev, aDiagramRev, function(err, results, aDefinitions, bDefinitions) {

      if (err) {
        return done(err);
      }

      // then
      expect(results._added).to.eql({});
      expect(results._removed).to.eql({});
      expect(results._layoutChanged).to.eql({});
      expect(results._changed).to.have.keys(['Decision_1', 'DecisionTable_0zjc24h']);

      expect(results._changed['DecisionTable_0zjc24h'].attrs).to.deep.eql({
        aggregation: { oldValue: 'SUM', newValue: 0 },
        hitPolicy: { oldValue: 'COLLECT', newValue: 'PRIORITY' },
      });

      done();
    });
  });

  it('should discover change input variable', function(done) {

    var aDiagram = readFileSync('test/fixtures/dmn/change-input-var/before.dmn', 'utf-8');
    var bDiagram = readFileSync('test/fixtures/dmn/change-input-var/after.dmn', 'utf-8');

    // when
    testDmnDiff(aDiagram, bDiagram, function(err, results, aDefinitions, bDefinitions) {

      if (err) {
        return done(err);
      }

      // then
      expect(results._added).to.eql({});
      expect(results._removed).to.eql({});
      expect(results._layoutChanged).to.eql({});
      expect(results._changed).to.have.keys(['Decision_1', 'Input_1']);

      expect(results._changed['Input_1'].attrs).to.deep.eql({
        inputVariable: { oldValue: undefined, newValue: 'inputVar' },
      });

      done();
    });
  });

  it('should discover change columns', function(done) {

    var aDiagram = readFileSync('test/fixtures/dmn/change-columns/before.dmn', 'utf-8');
    var bDiagram = readFileSync('test/fixtures/dmn/change-columns/after.dmn', 'utf-8');

    // when
    testDmnDiff(aDiagram, bDiagram, function(err, results, aDefinitions, bDefinitions) {

      if (err) {
        return done(err);
      }

      // then
      expect(results._added).to.have.keys(['InputClause_0j51xwh', 'LiteralExpression_0wnqqx2', 'OutputClause_19qooh4', 'UnaryTests_1v6m01o']);
      expect(results._removed).to.eql({});
      expect(results._layoutChanged).to.eql({});
      expect(results._changed).to.have.keys(['Decision_1']);

      done();
    });
  });

    it('should discover add and remove row', function(done) {

      var aDiagram = readFileSync('test/fixtures/dmn/add-row/before.dmn', 'utf-8');
      var bDiagram = readFileSync('test/fixtures/dmn/add-row/after.dmn', 'utf-8');
  
      // when
      testDmnDiff(aDiagram, bDiagram, function(err, results, aDefinitions, bDefinitions) {
  
        if (err) {
          return done(err);
        }
  
        // then
        expect(results._added).to.have.keys(['DecisionRule_20pnqml']);
        expect(results._removed).to.have.keys(['DecisionRule_10pnqml']);
        expect(results._layoutChanged).to.eql({});
        expect(results._changed).to.have.keys(['Decision_1']);
  
        done();
      });
  });

  it('should discover change column types', function(done) {

    var aDiagram = readFileSync('test/fixtures/dmn/change-columns-type/before.dmn', 'utf-8');
    var bDiagram = readFileSync('test/fixtures/dmn/change-columns-type/after.dmn', 'utf-8');

    // when
    testDmnDiff(aDiagram, bDiagram, function(err, results, aDefinitions, bDefinitions) {

      if (err) {
        return done(err);
      }

      // then
      expect(results._added).to.eql({});
      expect(results._removed).to.eql({});
      expect(results._layoutChanged).to.eql({});
      expect(results._changed).to.have.keys(['Decision_1', 'Input_1', 'InputExpression_1', 'Output_1']);

      expect(results._changed['Input_1'].attrs).to.deep.eql({
        inputVariable: { oldValue: undefined, newValue: 'inputVar' },
      });

      expect(results._changed['InputExpression_1'].attrs).to.deep.eql({
        expressionLanguage: { oldValue: undefined, newValue: 'javascript' },
        text: { oldValue: '', newValue: 'console.log(\'test\')' },
      });

      expect(results._changed['Output_1'].attrs).to.deep.eql({
        typeRef: { oldValue: 'string', newValue: 'boolean' },
      });

      done();
    });
});

it('should discover change column types (reversed)', function(done) {

  var aDiagramRev = readFileSync('test/fixtures/dmn/change-columns-type/before.dmn', 'utf-8');
  var bDiagramRev = readFileSync('test/fixtures/dmn/change-columns-type/after.dmn', 'utf-8');

  // when
  testDmnDiff(bDiagramRev, aDiagramRev, function(err, results, aDefinitions, bDefinitions) {

    if (err) {
      return done(err);
    }

    // then
    expect(results._added).to.eql({});
    expect(results._removed).to.eql({});
    expect(results._layoutChanged).to.eql({});
    expect(results._changed).to.have.keys(['Decision_1', 'Input_1', 'InputExpression_1', 'Output_1']);

    expect(results._changed['Input_1'].attrs).to.deep.eql({
      inputVariable: { oldValue: 'inputVar' , newValue: 0 },
    });

    expect(results._changed['InputExpression_1'].attrs).to.deep.eql({
      expressionLanguage: { oldValue: 'javascript', newValue: 0 },
      text: { oldValue: 'console.log(\'test\')', newValue: '' },
    });

    expect(results._changed['Output_1'].attrs).to.deep.eql({
      typeRef: { oldValue: 'boolean', newValue: 'string' },
    });

    done();
  });
});

  it('should discover change column types', function(done) {

    var aDiagram = readFileSync('test/fixtures/dmn/change-columns-type/before.dmn', 'utf-8');
    var bDiagram = readFileSync('test/fixtures/dmn/change-columns-type/after.dmn', 'utf-8');

    // when
    testDmnDiff(aDiagram, bDiagram, function(err, results, aDefinitions, bDefinitions) {

      if (err) {
        return done(err);
      }

      // then
      expect(results._added).to.eql({});
      expect(results._removed).to.eql({});
      expect(results._layoutChanged).to.eql({});
      expect(results._changed).to.have.keys(['Decision_1', 'Input_1', 'InputExpression_1', 'Output_1']);

      done();
    });
});

it('should discover change row annotation', function(done) {

  var aDiagram = readFileSync('test/fixtures/dmn/change-row-anno/before.dmn', 'utf-8');
  var bDiagram = readFileSync('test/fixtures/dmn/change-row-anno/after.dmn', 'utf-8');

  // when
  testDmnDiff(aDiagram, bDiagram, function(err, results, aDefinitions, bDefinitions) {

    if (err) {
      return done(err);
    }

    // then
    expect(results._added).to.eql({});
    expect(results._removed).to.eql({});
    expect(results._layoutChanged).to.eql({});
    expect(results._changed).to.have.keys(['Decision_1', 'DecisionRule_10pnqml']);

    done();
  });
});

});

  describe('api', function() {

    it('should diff with default handler', function(done) {

      var aDiagram = readFileSync('test/fixtures/dmn/change-columns/before.dmn', 'utf-8');
      var bDiagram = readFileSync('test/fixtures/dmn/change-columns/after.dmn', 'utf-8');

      // when
      importDmnDiagrams(aDiagram, bDiagram, function(err, aDefinitions, bDefinitions) {

        if (err) {
          return done(err);
        }

        // when
        var results = new Differ().diff(aDefinitions, bDefinitions);

        // then
        expect(results._added).to.have.keys(['InputClause_0j51xwh', 'LiteralExpression_0wnqqx2', 'OutputClause_19qooh4', 'UnaryTests_1v6m01o']);
        expect(results._removed).to.eql({});
        expect(results._layoutChanged).to.eql({});
        expect(results._changed).to.have.keys(['Decision_1']);

        done();
      });

    });


    it('should diff via static diff', function(done) {

      var aDiagram = readFileSync('test/fixtures/dmn/change-columns/before.dmn', 'utf-8');
      var bDiagram = readFileSync('test/fixtures/dmn/change-columns/after.dmn', 'utf-8');

      // when
      importDmnDiagrams(aDiagram, bDiagram, function(err, aDefinitions, bDefinitions) {

        if (err) {
          return done(err);
        }

        // when
        var results = diff(aDefinitions, bDefinitions);

        // then
        expect(results._added).to.have.keys(['InputClause_0j51xwh', 'LiteralExpression_0wnqqx2', 'OutputClause_19qooh4', 'UnaryTests_1v6m01o']);
        expect(results._removed).to.eql({});
        expect(results._layoutChanged).to.eql({});
        expect(results._changed).to.have.keys(['Decision_1']);

        done();
      });
    });
  });

// helpers //////////////////
  function importDmnDiagrams(a, b, done) {
    new DmnModdle({ camunda: camundaScheme }).fromXML(a, function(err, adefs) {
  
      if (err) {
        return done(err);
      }
  
      new DmnModdle({ camunda: camundaScheme }).fromXML(b, function(err, bdefs) {
        if (err) {
          return done(err);
        } else {
          return done(null, adefs, bdefs);
        }
      });
    });
  }
  
  
  function testDmnDiff(a, b, done) {
  
    importDmnDiagrams(a, b, function(err, adefs, bdefs) {
      if (err) {
        return done(err);
      }
  
      // given
      var handler = new SimpleChangeHandler();
  
      // when
      new Differ().diff(adefs, bdefs, handler);
  
      done(err, handler, adefs, bdefs);
    });
  }
