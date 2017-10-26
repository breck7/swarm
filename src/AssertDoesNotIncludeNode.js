const AssertIncludesNode = require("./AssertIncludesNode.js")

class AssertDoesNotIncludeNode extends AssertIncludesNode {
  getTestResult(actualAsString, expected, message) {
    const result = !actualAsString.includes(expected)
    this.equal(result, true, message)
    return result
  }
}

module.exports = AssertDoesNotIncludeNode
