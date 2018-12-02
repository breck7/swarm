const jtree = require("jtree")

const SwarmConstants = require("./SwarmConstants.js")
const SetupConstructorArgNode = require("./SetupConstructorArgNode.js")

class TestSetupNode extends jtree.NonTerminalNode {
  createTestDummy(programFilepath) {
    const requiredClass = this.getRequiredClass(programFilepath)
    const constructorArgNode = this.getChildrenByNodeType(SetupConstructorArgNode)[0]
    const param = constructorArgNode ? constructorArgNode.childrenToString() : undefined
    const isStatic = this.has(SwarmConstants.static)
    return isStatic ? requiredClass : new requiredClass(param)
  }

  isNodeJs() {
    return typeof exports !== "undefined"
  }

  getRequiredClass(programFilepath) {
    const requiredClass =
      this.get(SwarmConstants.require) ||
      this.getRootNode()
        .getNode(SwarmConstants.setup)
        .get(SwarmConstants.require)
    if (this.isNodeJs()) return TestSetupNode.requireAbsOrRelative(requiredClass, programFilepath)
    return window[jtree.Utils.getClassNameFromFilePath(requiredClass)]
  }

  executeSync() {}

  static requireAbsOrRelative(filePath, programFilepath) {
    if (!filePath.startsWith(".")) return require(filePath)
    const path = require("path")
    const folder = jtree.Utils.getPathWithoutFileName(programFilepath)
    const file = path.resolve(folder + "/" + filePath)
    return require(file)
  }
}

module.exports = TestSetupNode
