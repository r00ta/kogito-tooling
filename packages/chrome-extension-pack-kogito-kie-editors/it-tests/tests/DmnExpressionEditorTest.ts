/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import DecisionNavigator from "../framework/editor/dmn/DecisionNavigator";
import DmnEditor from "../framework/editor/dmn/DmnEditor";
import DmnSideBar from "../framework/editor/dmn/DmnSideBar";
import GitHubEditorPage from "../framework/github-editor/GitHubEditorPage";
import GitHubListItem from "../framework/github-file-list/GitHubListItem";
import GitHubListPage from "../framework/github-file-list/GitHubListPage";
import Tools from "../utils/Tools";
import DmnExpressionEditor from "../framework/editor/dmn/DmnExpressionEditor";

const TEST_NAME = "DmnExpressionEditorTest";

let tools: Tools;

beforeEach(async () => {
  tools = await Tools.init(TEST_NAME);
});

test.skip(TEST_NAME, async () => {
  const WEB_PAGE =
    "https://github.com/kiegroup/kogito-tooling/tree/main/packages/chrome-extension-pack-kogito-kie-editors/it-tests/samples";
  const FILE_NAME = "test.dmn";
  const BKM_NODE_NAME = "MyModel";

  // check link to online editor in the list
  const gitHubListPage: GitHubListPage = await tools.openPage(GitHubListPage, WEB_PAGE);
  const gitHubFile: GitHubListItem = await gitHubListPage.getFile(FILE_NAME);

  // open DMN editor
  const editorPage: GitHubEditorPage = await gitHubFile.open();
  const dmnEditor: DmnEditor = await editorPage.getDmnEditor();

  await dmnEditor.enter();

  //check DMN nodes in navigator
  const sideBar: DmnSideBar = await dmnEditor.getSideBar();
  const decisionNavigator: DecisionNavigator = await sideBar.openDecisionNavigator();
  await decisionNavigator.selectNodeExpression(BKM_NODE_NAME);

  const expressionEditor: DmnExpressionEditor = await dmnEditor.getExpressionEditor();
  await expressionEditor.activateBetaVersion();
  await expressionEditor.assertExpressionIsPresent("MyModel", "<Undefined>");

  await dmnEditor.leave();
});

afterEach(async () => {
  await tools.finishTest();
});
