/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
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

const CopyWebpackPlugin = require("copy-webpack-plugin");
const patternflyBase = require("@kie-tooling-core/patternfly-base");
const externalAssets = require("@kogito-tooling/external-assets-base");
const vscodeJavaCodeCompletionExtensionPlugin = require("@kogito-tooling/vscode-java-code-completion-extension-plugin");
const { merge } = require("webpack-merge");
const common = require("../../config/webpack.common.config");

const commonConfig = (env) =>
  merge(common(env), {
    output: {
      library: "DmnEditor",
      libraryTarget: "umd",
      umdNamedDefine: true,
      globalObject: "this",
    },
    externals: {
      vscode: "commonjs vscode",
    },
  });

module.exports = async (env) => [
  merge(commonConfig(env), {
    target: "web",
    entry: {
      "extension/extension": "./src/extension/extension.ts",
    },
    plugins: [],
  }),
  merge(commonConfig(env), {
    target: "web",
    entry: {
      "webview/DmnEditorEnvelopeApp": "./src/webview/DmnEditorEnvelopeApp.ts",
      "webview/SceSimEditorEnvelopeApp": "./src/webview/SceSimEditorEnvelopeApp.ts",
    },
    module: {
      rules: [...patternflyBase.webpackModuleRules],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: externalAssets.dmnEditorPath(),
            to: "webview/editors/dmn",
            globOptions: { ignore: ["WEB-INF/**/*"] },
          },
          {
            from: externalAssets.scesimEditorPath(),
            to: "webview/editors/scesim",
            globOptions: { ignore: ["WEB-INF/**/*"] },
          },
          {
            from: externalAssets.dmnEditorPath(),
            to: "target/dmn",
            globOptions: { ignore: ["WEB-INF/**/*"] },
          },
          {
            from: vscodeJavaCodeCompletionExtensionPlugin.path(),
            to: "server/",
            globOptions: { ignore: ["WEB-INF/**/*"] },
          },
        ],
      }),
    ],
  }),
];
