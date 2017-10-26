const SwarmConstants = {}

// Hashbang node
SwarmConstants.hashBang = "#!"

// Setup
SwarmConstants.setup = "#setup"
SwarmConstants.async = "async"
SwarmConstants.require = "require"
SwarmConstants.static = "static"

// Setup Param nodes....todo: merge with longArg node.
SwarmConstants.longParam = "%%|"

// Test Blocks
SwarmConstants.testBlock = "#test"
SwarmConstants.skippedTestBlog = "-#test"
SwarmConstants.soloTestBlock = "+#test"

// Command Nodes
SwarmConstants.assertTypeOfNode = "=~"
SwarmConstants.assertLengthNode = "=#"
SwarmConstants.assertEqualNode = "=="
SwarmConstants.assertEqualBlockNode = "=|"
SwarmConstants.assertIncludesNode = "=+"
SwarmConstants.assertDoesNotIncludeNode = "=-"

// arg
SwarmConstants.longArg = "%|"

module.exports = SwarmConstants
