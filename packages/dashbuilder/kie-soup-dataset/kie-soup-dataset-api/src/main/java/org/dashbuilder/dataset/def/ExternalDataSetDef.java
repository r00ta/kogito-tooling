/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
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
package org.dashbuilder.dataset.def;

import java.util.Objects;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.dashbuilder.dataprovider.DataSetProviderType;
import org.dashbuilder.dataset.validation.groups.ExternalDataSetDefValidation;

public class ExternalDataSetDef extends DataSetDef {

    @NotNull(groups = {ExternalDataSetDefValidation.class})
    @Size(min = 4, groups = {ExternalDataSetDefValidation.class})
    private String url;

    private boolean dynamic;

    public ExternalDataSetDef() {
        super.setProvider(DataSetProviderType.EXTERNAL);
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public boolean isDynamic() {
        return dynamic;
    }

    public void setDynamic(boolean dynamic) {
        this.dynamic = dynamic;
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(),
                url,
                dynamic);
    }
    
    @Override
    public DataSetDef clone() {
        var def = new ExternalDataSetDef();
        clone(def);
        def.setUrl(getUrl());
        def.setDynamic(isDynamic());
        return def;
    }

    public String toString() {
        var out = new StringBuilder();
        out.append("UUID=").append(UUID).append("\n");
        out.append("Provider=").append(provider).append("\n");
        out.append("Public=").append(isPublic).append("\n");
        out.append("Push enabled=").append(pushEnabled).append("\n");
        out.append("Push max size=").append(pushMaxSize).append(" Kb\n");
        out.append("URL=").append(url).append("\n");
        out.append("Dynamic=").append(dynamic).append("\n");
        return out.toString();
    }
    
    

}
