const jtree = require("jtree")

class CommandArgNode extends jtree.NonTerminalNode {
  executeSync() {}
}

module.exports = CommandArgNode
