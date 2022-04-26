﻿// Copyright (c) Argo Zhang (argo@163.com). All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
// Website: https://www.blazor.zone or https://argozhang.github.io/

using BootstrapBlazor.Components;
using Microsoft.AspNetCore.Components.Rendering;

namespace Microsoft.AspNetCore.Components.Web;

/// <summary>
/// ReconnectorOutlet 组件
/// </summary>
public class ReconnectorOutlet : ComponentBase
{
    /// <summary>
    /// BuildRenderTree 方法
    /// </summary>
    /// <param name="builder"></param>
    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        builder.OpenComponent<ReconnectorContent>(0);
        builder.CloseComponent();
    }
}
