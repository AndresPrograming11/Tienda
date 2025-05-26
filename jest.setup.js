
// jest.config.js
const { TextEncoder, TextDecoder } = require("util");
const fetchMock = require("jest-fetch-mock");
require('jest-fetch-mock').enableMocks();
// Configurar globals antes de exportar la configuración
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Habilitar mocks globales para fetch
fetchMock.enableMocks();
global.fetch = fetchMock;

module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  // No setupFilesAfterEnv necesario porque ya hacemos setup aquí mismo
};
