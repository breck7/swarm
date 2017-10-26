const TreeProgram = require("treeprogram")

class AbstractAssertNode extends TreeProgram.NonTerminalNode {
  async execute(dummy) {
    const finalParts = AbstractAssertNode._getMethodFromDotPath(dummy, this.getWord(1))
    const subject = finalParts[0]
    const command = finalParts[1]
    const actual = subject[command]()
    const actualAsString = this.parseActual(actual).toString()
    const expected = this.getExpected()
    const line = this.getLine()
    const isPassed = this.getTestResult(actualAsString, expected, line)
    if (!isPassed) {
      this.printFailureMessage(actual)
      debugger
    }
  }

  printFailureMessage() {
    const line = this.getLine()
    this.setLine(`FAILED:${line}`)
    this.setLine(line)
    console.log(this.getStackString())
    const lineNumber = this.getPoint()
    console.log(`Line number ${lineNumber.y}`)
  }

  equal(actual, expected, message) {
    this.getParent().getEqualFn()(actual, expected, message)
  }

  getTestResult(actualAsString, expected, message) {
    this.equal(actualAsString, expected, message)
    return actualAsString === expected
  }

  parseActual(actual) {
    return actual
  }

  async executeSync(result) {
    const expected = this.getSyncExpected()
    const actual = this.parseActual(result)
    if (actual === undefined) debugger
    const actualAsString = actual.toString()
    const isPassed = actualAsString === expected
    if (!isPassed) {
      this.printFailureMessage(result)
      debugger
    }
    this.equal(actualAsString, expected)
  }

  getExpected() {
    return this.getWords(2).join(" ")
  }

  getSyncExpected() {
    return this.getBeam()
  }

  static _getMethodFromDotPath(context, str) {
    const methodParts = str.split(".")
    while (methodParts.length > 1) {
      context = context[methodParts.shift()]()
    }
    const final = methodParts.shift()
    return [context, final]
  }
}

module.exports = AbstractAssertNode
