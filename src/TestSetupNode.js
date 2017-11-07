const otree = require("otree")

const SwarmConstants = require("./SwarmConstants.js")
const SetupConstructorArgNode = require("./SetupConstructorArgNode.js")

class TestSetupNode extends otree.NonTerminalNode {
  createTestDummy(filepath) {
    const requiredClass = this.getRequiredClass(filepath)
    const constructorArgNode = this.getChildrenByNodeType(SetupConstructorArgNode)[0]
    const param = constructorArgNode ? constructorArgNode.childrenToString() : undefined
    const isStatic = this.has(SwarmConstants.static)
    return isStatic ? requiredClass : new requiredClass(param)
  }

  isNodeJs() {
    return typeof exports !== "undefined"
  }

  getRequiredClass(filepath) {
    const requiredClass =
      this.findBeam(SwarmConstants.require) ||
      this.getRootNode()
        .getNode(SwarmConstants.setup)
        .findBeam(SwarmConstants.require)
    if (this.isNodeJs()) return TestSetupNode.requireAbsOrRelative(requiredClass, filepath)
    return window[TreeProgram.Utils.getClassNameFromFilePath(requiredClass)]
  }

  executeSync() {}

  static requireAbsOrRelative(filePath, contextFilePath) {
    if (!filePath.startsWith(".")) return require(filePath)
    const path = require("path")
    const folder = TreeProgram.Utils.getPathWithoutFileName(contextFilePath)
    const file = path.resolve(folder + "/" + filePath)
    return require(file)
  }
}

module.exports = TestSetupNode
