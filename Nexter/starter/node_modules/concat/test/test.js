const concat = require('../index')
const assert = require('assert');
const read = require('fs').readFileSync;
const exec = require('child_process').execSync;

const err = err => console.log(err)

describe('Concatenate', () => {
  it('empty files', done => {
    concat([__dirname + "/empty", __dirname + "/empty"]).then(f => {
      assert.equal(f, '\n')
      done()
    }).catch(err)
  })

  it('simple concatenation', done => {
    concat([__dirname + "/simple1", __dirname + "/simple2"]).then(f => {
      assert.equal(f, '1\n\n2\n')
      done()
    }).catch(err)
  })

  it('multiple files concatenation', done => {
    concat([
      __dirname + "/simple1",
      __dirname + "/simple2",
      __dirname + "/simple1",
      __dirname + "/simple2",
      __dirname + "/simple1",
      __dirname + "/simple2",
      __dirname + "/simple1",
      __dirname + "/simple2"
    ]).then(f => {
      assert.equal(f, '1\n\n2\n\n1\n\n2\n\n1\n\n2\n\n1\n\n2\n')
      done()
    }).catch(err)
  })

  it('should concatenate folder', done => {
    concat(__dirname + "/folder").then(f => {
      assert.equal(f.trim(), 'function A() {};\n\nfunction B() {};')
      done()
    }).catch(err)
  })
})

describe('cli', () => {
  it('should write to output when no file specified', () => {
    assert.equal(exec(`node ./bin/concat ${__dirname + '/simple1'} ${__dirname + '/simple2'}`).toString(), '1\n\n2\n\n')
  })

  it('should write to file', () => {
    assert.equal(exec(`node ./bin/concat -o ${__dirname + '/test'} ${__dirname + '/simple1'} ${__dirname + '/simple2'} && cat ${__dirname + '/test'}`).toString(), '1\n\n2\n')
  })
})
