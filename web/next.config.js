const withTM = require("next-transpile-modules")(["@react-three/drei", "three"])
const withImages = require("next-images")

module.exports = withTM()
module.exports = withImages()
