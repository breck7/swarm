const fs = require("fs")
const TreeProgram = require("treeprogram")

const SwarmGrammar = fs.readFileSync(__dirname + "/swarm.grammar", "utf8")

const TestSetupNode = require("./TestSetupNode.js")
const TestBlock = require("./TestBlock.js")
const SkippedTestBlock = require("./SkippedTestBlock.js")
const SoloTestBlock = require("./SoloTestBlock.js")

class SwarmProgram extends TreeProgram {
  getGrammarString() {
    return SwarmGrammar
  }

  getGrammarFilePath() {
    return __dirname + "/swarm.grammar"
  }

  getCommandParent(testDummy) {
    return testDummy
  }

  getTestSetupNode() {
    const testSetupNode = this.getChildrenByNodeType(TestSetupNode)[0]
    return testSetupNode
  }

  execute(filepath) {
    return Promise.all(this.getTestsToRun().map(test => test.execute(filepath)))
  }

  getTestsToRun() {
    const solos = this.getChildrenByNodeType(SoloTestBlock)
    const testsToRun = solos.length
      ? solos
      : this.getChildrenByNodeType(TestBlock).filter(test => !(test instanceof SkippedTestBlock))
    return testsToRun
  }
}

module.exports = SwarmProgram
