const { defaults } = require("jest-config");

exports = {
  "testEnvironmentOptions": {
    "url": "http://localhost:7000",
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
};
