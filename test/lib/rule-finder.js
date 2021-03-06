var path = require('path')
var assert = require('assert')
var proxyquire = require('proxyquire')

var processCwd = process.cwd

var getRuleFinder = proxyquire('../../src/lib/rule-finder', {
  fs: {
    readdirSync: function() {
      return ['foo-rule.js', 'bar-rule.js', 'baz-rule.js']
    },
  },
  'eslint-plugin-react': {
    rules: {
      'foo-rule': true,
      'bar-rule': true,
      'baz-rule': true,
    },
    '@noCallThru': true,
    '@global': true,
  },
})

var noSpecifiedFile = path.resolve(process.cwd(), './test/fixtures/no-path')
var specifiedFileRelative = './test/fixtures/eslint.json'
var specifiedFileAbsolute = path.join(process.cwd(), specifiedFileRelative)

describe('rule-finder', function() {
  afterEach(function() {
    process.cwd = processCwd
  })

  it('no specifiedFile is passed to the constructor', function() {
    var ruleFinder
    process.cwd = function() {
      return noSpecifiedFile
    }
    ruleFinder = getRuleFinder()
    assert.deepEqual(ruleFinder.getUnusedRules(), ['bar-rule', 'baz-rule'])
  })

  it('no specifiedFile - current rules', function() {
    var ruleFinder
    process.cwd = function() {
      return noSpecifiedFile
    }
    ruleFinder = getRuleFinder()
    assert.deepEqual(ruleFinder.getCurrentRules(), ['foo-rule'])
  })

  it('no specifiedFile - current rule config', function() {
    var ruleFinder
    process.cwd = function() {
      return noSpecifiedFile
    }
    ruleFinder = getRuleFinder()
    assert.deepEqual(ruleFinder.getCurrentRulesDetailed(), {'foo-rule': [2]})
  })

  it('no specifiedFile - plugin rules', function() {
    var ruleFinder
    process.cwd = function() {
      return noSpecifiedFile
    }
    ruleFinder = getRuleFinder()
    assert.deepEqual(ruleFinder.getPluginRules(), [])
  })

  it('no specifiedFile - all available rules', function() {
    var ruleFinder
    process.cwd = function() {
      return noSpecifiedFile
    }
    ruleFinder = getRuleFinder()
    assert.deepEqual(ruleFinder.getAllAvailableRules(), ['bar-rule', 'baz-rule', 'foo-rule'])
  })

  it('specifiedFile (relative path) is passed to the constructor', function() {
    var ruleFinder = getRuleFinder(specifiedFileRelative)
    assert.deepEqual(ruleFinder.getUnusedRules(), ['baz-rule', 'react/bar-rule', 'react/baz-rule', 'react/foo-rule'])
  })

  it('specifiedFile (relative path) - current rules', function() {
    var ruleFinder = getRuleFinder(specifiedFileRelative)
    assert.deepEqual(ruleFinder.getCurrentRules(), ['bar-rule', 'foo-rule'])
  })

  it('specifiedFile (relative path) - current rule config', function() {
    var ruleFinder = getRuleFinder(specifiedFileRelative)
    assert.deepEqual(ruleFinder.getCurrentRulesDetailed(), {'bar-rule': [2], 'foo-rule': [2]})
  })

  it('specifiedFile (relative path) - plugin rules', function() {
    var ruleFinder = getRuleFinder(specifiedFileRelative)
    assert.deepEqual(ruleFinder.getPluginRules(), ['react/bar-rule', 'react/baz-rule', 'react/foo-rule'])
  })

  it('specifiedFile (relative path) - all available rules', function() {
    var ruleFinder = getRuleFinder(specifiedFileRelative)
    assert.deepEqual(
      ruleFinder.getAllAvailableRules(),
      ['bar-rule', 'baz-rule', 'foo-rule', 'react/bar-rule', 'react/baz-rule', 'react/foo-rule']
    )
  })

  it('specifiedFile (absolut path) is passed to the constructor', function() {
    var ruleFinder = getRuleFinder(specifiedFileAbsolute)
    assert.deepEqual(ruleFinder.getUnusedRules(), ['baz-rule', 'react/bar-rule', 'react/baz-rule', 'react/foo-rule'])
  })

  it('specifiedFile (absolut path) - current rules', function() {
    var ruleFinder = getRuleFinder(specifiedFileAbsolute)
    assert.deepEqual(ruleFinder.getCurrentRules(), ['bar-rule', 'foo-rule'])
  })

  it('specifiedFile (absolut path) - current rule config', function() {
    var ruleFinder = getRuleFinder(specifiedFileAbsolute)
    assert.deepEqual(ruleFinder.getCurrentRulesDetailed(), {'foo-rule': [2], 'bar-rule': [2]})
  })

  it('specifiedFile (absolut path) - plugin rules', function() {
    var ruleFinder = getRuleFinder(specifiedFileAbsolute)
    assert.deepEqual(ruleFinder.getPluginRules(), ['react/bar-rule', 'react/baz-rule', 'react/foo-rule'])
  })

  it('specifiedFile (absolut path) - all available rules', function() {
    var ruleFinder = getRuleFinder(specifiedFileAbsolute)
    assert.deepEqual(
      ruleFinder.getAllAvailableRules(),
      ['bar-rule', 'baz-rule', 'foo-rule', 'react/bar-rule', 'react/baz-rule', 'react/foo-rule']
    )
  })
})
