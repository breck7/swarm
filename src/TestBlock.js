const tap = require("tap")
const TreeProgram = require("treeprogram")

const SwarmConstants = require("./SwarmConstants.js")

class TestBlock extends TreeProgram.NonTerminalNode {
  getTestSetupNode() {
    return this.getNode(SwarmConstants.setup) || this.getParent().getTestSetupNode()
  }

  isAsync() {
    return (
      this.getTestSetupNode().has(SwarmConstants.async) ||
      this.getParent()
        .getTestSetupNode()
        .has(SwarmConstants.async)
    )
  }

  setEqualMethod(equal) {
    this._equal = equal
    return this
  }

  getTestBlock() {
    return this
  }

  getEqualFn() {
    return this._equal
  }

  _executeNode(filepath) {
    const testDummy = this.getTestSetupNode().createTestDummy(filepath)
    const isAsync = this.isAsync()
    const executeMethod = isAsync ? "execute" : "executeSync"
    return new Promise((resolve, reject) => {
      const testName = this.getLine()

      tap.test(testName, async childTest => {
        this.setEqualMethod(childTest.equal)

        const promises = this.getChildren().map(child => {
          const result = child[executeMethod](testDummy)
          return isAsync ? Promise.resolve(result) : result
        })

        await Promise.all(promises)

        childTest.end()
        resolve()
      })
    })
  }

  isNodeJs() {
    return typeof exports !== "undefined"
  }

  async _executeBrowser() {
    const testDummy = this.getTestSetupNode().createTestDummy()
    const isAsync = this.isAsync()
    const executeMethod = isAsync ? "execute" : "executeSync"
    const testName = this.getLine()
    console.log("testing: " + testName)
    this.setEqualMethod((actual, expected, message) => {
      if (actual !== expected) console.log("fail")
      else console.log("pass")
    })

    const promises = this.getChildren().map(child => {
      const result = child[executeMethod](testDummy)
      return isAsync ? Promise.resolve(result) : result
    })

    await Promise.all(promises)
  }

  execute(filepath) {
    return this.isNodeJs() ? this._executeNode(filepath) : this._executeBrowser()
  }
}

module.exports = TestBlock
