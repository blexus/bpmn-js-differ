import {
  expect
} from 'chai';

import {
  readFileSync
} from 'fs';

import DmnModdle from 'dmn-moddle';

import {
  Differ,
  diff
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
        text: { oldValue: 'ausgabe2-change', newValue: 'ausgabe2' }
      });

      expect(results._changed['UnaryTests_16zmfgt'].attrs).to.deep.eql({
        text: { oldValue: 'eingabe1-change', newValue: 'eingabe1' }
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
        hitPolicy: { oldValue: 'COLLECT', newValue: 'FIRST' }
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
