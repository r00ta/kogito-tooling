/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package org.kogito.core.internal.handlers;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import org.eclipse.core.runtime.IProgressMonitor;
import org.eclipse.jdt.ls.core.internal.JavaLanguageServerPlugin;
import org.eclipse.lsp4j.CompletionItem;
import org.kogito.core.internal.api.GetClassesResult;
import org.kogito.core.internal.engine.BuildInformation;
import org.kogito.core.internal.engine.JavaEngine;

public class GetClassesHandler extends Handler<List<GetClassesResult>> {

    private final JavaEngine javaEngine;
    private final AutocompleteHandler autocompleteHandler;

    public GetClassesHandler(String id, JavaEngine javaEngine, AutocompleteHandler autocompleteHandler) {
        super(id);
        this.javaEngine = javaEngine;
        this.autocompleteHandler = autocompleteHandler;
    }

    public CompletableFuture<List<GetClassesResult>> handle(List<Object> arguments, IProgressMonitor progress) {
        checkParameters(arguments);
        String completeText = (String) arguments.get(0);
        BuildInformation buildInformation = javaEngine.buildImportClass(this.autocompleteHandler.getUri(), completeText);
        List<CompletionItem> items = this.autocompleteHandler.handle("GetClassesHandler", buildInformation);
        List<GetClassesResult> completedClasses = this.transformCompletionItemsToResult(items);
        return CompletableFuture.supplyAsync(() -> completedClasses);
    }

    private void checkParameters(List<Object> arguments) {
        if (arguments.size() < 1) {
            throw new IllegalArgumentException("Not enough arguments for GetClasses command. Need one argument containing a text to be autocompleted");
        } else {
            JavaLanguageServerPlugin.logError("Arguments: " + arguments.get(0));
        }
    }

    private List<GetClassesResult> transformCompletionItemsToResult(List<CompletionItem> items) {
        return items.stream()
                .filter(item -> item.getLabel().contains("-"))
                .map(item -> {
                    GetClassesResult result = new GetClassesResult();
                    result.setFqcn(getFQCN(item.getLabel()));
                    return result;
                })
                .collect(Collectors.toList());
    }

    protected String getFQCN(String label) {
        if (label.contains("-")) {
            String[] split = label.split("-");
            return split[1].trim() + "." + split[0].trim();
        } else {
            return "";
        }
    }
}
