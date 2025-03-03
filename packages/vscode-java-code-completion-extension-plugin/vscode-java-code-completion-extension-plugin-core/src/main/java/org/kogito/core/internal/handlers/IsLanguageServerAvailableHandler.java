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
import org.kogito.core.internal.engine.ActivationChecker;
import org.kogito.core.internal.engine.BuildInformation;
import org.kogito.core.internal.engine.JavaEngine;

public class IsLanguageServerAvailableHandler extends Handler<Boolean> {

    private final ActivationChecker activationChecker;

    public IsLanguageServerAvailableHandler(String id, ActivationChecker activationChecker) {
        super(id);
        this.activationChecker = activationChecker;
    }

    public boolean canHandle() {
        return false;
    }

    public CompletableFuture<Boolean> handle(List<Object> arguments, IProgressMonitor progress) {
        return CompletableFuture.completedFuture(activationChecker.existActivator());
    }

}
