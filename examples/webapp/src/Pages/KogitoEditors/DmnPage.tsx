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

import { ChannelType } from "@kie-tooling-core/editor/dist/api";
import * as React from "react";
import { EditorEnvelopeLocator } from "@kie-tooling-core/editor/dist/api";
import { useMemo, useState } from "react";
import { Page } from "@patternfly/react-core";
import { EmbeddedEditor, useEditorRef } from "@kie-tooling-core/editor/dist/embedded";
import { EmbeddedEditorFile } from "@kie-tooling-core/editor/dist/channel";
import { Sidebar } from "./Sidebar";

export function DmnPage() {
  /**
   * The reference of the Editor. It allows us to access/modify the Editor properties imperatively.
   */
  const { editor, editorRef } = useEditorRef();

  /**
   * State that handles the file. It's important to type with the File type of the @kogito-tooling/dist/embedded.
   * It's initialized with an empty file with the dmn extension. The file is used by the EmbeddedEditor to set the content on the Editor. Updating the file will trigger a re-render on the Editor because the EmbeddedEditor will set updated content on the Editor.
   */
  const [file, setFile] = useState<EmbeddedEditorFile>({
    fileName: "new-file",
    fileExtension: "dmn",
    getFileContents: () => Promise.resolve(""),
    isReadOnly: false,
  });

  /**
   * The Editor envelope locator informs the EmbeddedEditor what file extension the Editor can open, and it maps to the respective envelope path and the Editor resources (like CSS, icons, etc).
   * On this example, we're using a local envelope. To do this, it's necessary to copy the files from the @kogito-tooling/kie-bc-editors-unpacked on the webpack.config
   */
  const editorEnvelopeLocator: EditorEnvelopeLocator = useMemo(() => {
    return {
      targetOrigin: window.location.origin,
      mapping: new Map([
        [
          "dmn",
          {
            resourcesPathPrefix: "../dmn-editor/dmn/",
            envelopePath: "envelope/dmn-editor.html",
          },
        ],
      ]),
    };
  }, []);

  return (
    <Page>
      <div className={"webapp--page-main-div"}>
        <Sidebar
          editor={editor}
          editorEnvelopeLocator={editorEnvelopeLocator}
          file={file}
          setFile={setFile}
          fileExtension={"dmn"}
          accept={".dmn"}
        />
        <EmbeddedEditor
          ref={editorRef}
          file={file}
          editorEnvelopeLocator={editorEnvelopeLocator}
          channelType={ChannelType.EMBEDDED}
          locale={"en"}
        />
      </div>
    </Page>
  );
}
