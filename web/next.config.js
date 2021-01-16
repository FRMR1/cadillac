const withTM = require("next-transpile-modules")(["@react-three/drei", "three"])

module.exports = withTM()

const withImages = require("next-images")
module.exports = withImages()
