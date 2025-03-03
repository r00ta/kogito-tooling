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

import { ContentType } from "@kie-tooling-core/workspace/dist/api";
import { EditorApi, KogitoEditorEnvelopeApi } from "@kie-tooling-core/editor/dist/api";
import { StateControl } from "@kie-tooling-core/editor/dist/channel";
import { MessageBusClientApi } from "@kie-tooling-core/envelope-bus/dist/api";

export interface StandaloneEditorApi extends EditorApi {
  subscribeToContentChanges: StateControl["subscribe"];
  unsubscribeToContentChanges: StateControl["unsubscribe"];
  markAsSaved: StateControl["setSavedCommand"];
  envelopeApi: MessageBusClientApi<KogitoEditorEnvelopeApi>;
  close: () => void;
}

export interface Editor {
  open: (args: {
    container: Element;
    initialContent: Promise<string>;
    readOnly: boolean;
    origin?: string;
    resources?: Map<string, { contentType: ContentType; content: Promise<string> }>;
  }) => StandaloneEditorApi;
}

export const createEditor = (
  envelopeApi: MessageBusClientApi<KogitoEditorEnvelopeApi>,
  stateControl: StateControl,
  listener: (message: MessageEvent) => void,
  iframe: HTMLIFrameElement
): StandaloneEditorApi => {
  return {
    undo: () => {
      stateControl.undo();
      return Promise.resolve(envelopeApi.notifications.kogitoEditor_editorUndo.send());
    },
    redo: () => {
      stateControl.redo();
      return Promise.resolve(envelopeApi.notifications.kogitoEditor_editorRedo.send());
    },
    close: () => {
      window.removeEventListener("message", listener);
      iframe.remove();
    },
    getElementPosition: (selector) => envelopeApi.requests.kogitoGuidedTour_guidedTourElementPositionRequest(selector),
    getContent: () => envelopeApi.requests.kogitoEditor_contentRequest().then((c) => c.content),
    getPreview: () => envelopeApi.requests.kogitoEditor_previewRequest(),
    setContent: (path, content) => envelopeApi.requests.kogitoEditor_contentChanged({ path: path, content: content }),
    subscribeToContentChanges: (callback) => stateControl.subscribe(callback),
    unsubscribeToContentChanges: (callback) => stateControl.unsubscribe(callback),
    markAsSaved: () => stateControl.setSavedCommand(),
    validate: () => envelopeApi.requests.kogitoEditor_validate(),
    envelopeApi,
  };
};
