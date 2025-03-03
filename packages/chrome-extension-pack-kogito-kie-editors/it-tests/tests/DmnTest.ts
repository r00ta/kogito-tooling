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
import Properties from "../framework/editor/Properties";
import Tools from "../utils/Tools";

const TEST_NAME = "DmnTest";

let tools: Tools;

beforeEach(async () => {
  tools = await Tools.init(TEST_NAME);
});

test(TEST_NAME, async () => {
  const WEB_PAGE =
    "https://github.com/kiegroup/kogito-tooling/tree/main/packages/chrome-extension-pack-kogito-kie-editors/it-tests/samples";
  const DMN_NAME = "myDmn";
  const FILE_NAME = "test.dmn";
  const DATA_NODE_NAME = "MyInputData";

  const gitHubListPage: GitHubListPage = await tools.openPage(GitHubListPage, WEB_PAGE);
  const gitHubFile: GitHubListItem = await gitHubListPage.getFile(FILE_NAME);

  // open DMN editor
  const editorPage: GitHubEditorPage = await gitHubFile.open();
  const dmnEditor: DmnEditor = await editorPage.getDmnEditor();

  await dmnEditor.enter();

  // check dmn properties
  const sideBar: DmnSideBar = await dmnEditor.getSideBar();
  const processProps: Properties = await sideBar.openProperties();
  expect(await processProps.getDmnNameFromInput()).toEqual(DMN_NAME);

  //check DMN nodes in navigator
  const decisionNavigator: DecisionNavigator = await sideBar.openDecisionNavigator();
  expect((await decisionNavigator.getNodeNames()).sort()).toEqual(
    ["MyDecision", "MyInputData", "MyModel", "Function"].sort()
  );
  expect(await decisionNavigator.getDmnName()).toEqual(DMN_NAME);

  // check Driver node properties
  await decisionNavigator.selectNode(DATA_NODE_NAME);
  const nodeProps: Properties = await sideBar.openProperties();
  expect(await nodeProps.getDmnNameFromInput()).toEqual(DATA_NODE_NAME);

  await dmnEditor.leave();

  // open and check source/editor
  expect(await editorPage.isSourceVisible()).toBe(false);
  expect(await editorPage.isEditorVisible()).toBe(true);
  await editorPage.seeAsSource();
  expect(await editorPage.isSourceVisible()).toBe(true);
  expect(await editorPage.isEditorVisible()).toBe(false);
  await editorPage.seeAsDiagram();
  expect(await editorPage.isSourceVisible()).toBe(false);
  expect(await editorPage.isEditorVisible()).toBe(true);
});

afterEach(async () => {
  await tools.finishTest();
});
