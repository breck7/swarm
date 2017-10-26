const TreeProgram = require("treeprogram")

const SwarmConstants = require("./SwarmConstants.js")

class TestSetupNode extends TreeProgram.NonTerminalNode {
  createTestDummy(filepath) {
    const requiredClass = this.getRequiredClass(filepath)
    // todo: right now we only allow 1 param. and we arent parsing it as a param node. bad!
    const longNode = this.getNode(SwarmConstants.longParam)
    const param = longNode ? longNode.childrenToString() : undefined
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
    return window[TreeProgram.getClassNameFromFilePath(requiredClass)]
  }

  executeSync() {}

  static requireAbsOrRelative(filePath, contextFilePath) {
    if (!filePath.startsWith(".")) return require(filePath)
    const path = require("path")
    const folder = TreeProgram.getPathWithoutFileName(contextFilePath)
    const file = path.resolve(folder + "/" + filePath)
    return require(file)
  }
}

module.exports = TestSetupNode
