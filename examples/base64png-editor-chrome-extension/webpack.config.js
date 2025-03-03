/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const CopyPlugin = require("copy-webpack-plugin");
const ZipPlugin = require("zip-webpack-plugin");
const patternflyBase = require("@kie-tooling-core/patternfly-base");
const packageJson = require("./package.json");
const common = require("../../config/webpack.common.config");
const { merge } = require("webpack-merge");
const buildEnv = require("@kogito-tooling/build-env");
const { EnvironmentPlugin } = require("webpack");

module.exports = (env) => {
  const router_targetOrigin = `https://localhost:${buildEnv.examples.chromeExtensionEnvelope.port}`;

  return merge(common(env), {
    entry: {
      contentscript: "./src/contentscript.ts",
      "envelope/index": "./src/envelope/index.ts",
    },
    devServer: {
      compress: true,
      watchContentBase: true,
      https: true,
      port: buildEnv.examples.chromeExtensionEnvelope.port,
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: "./static/manifest.json" },
          { from: "./static/resources", to: "./resources" },
          { from: "./static/envelope", to: "./envelope" },
        ],
      }),
      new ZipPlugin({
        filename: "kogito_tooling_examples_base64-chrome_extension_" + packageJson.version + ".zip",
        pathPrefix: "dist",
      }),
      new EnvironmentPlugin({
        WEBPACK_REPLACE__targetOrigin: router_targetOrigin,
      }),
    ],
    module: {
      rules: [...patternflyBase.webpackModuleRules],
    },
  });
};
