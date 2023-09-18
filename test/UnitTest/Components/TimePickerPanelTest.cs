﻿// Copyright (c) Argo Zhang (argo@163.com). All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
// Website: https://www.blazor.zone or https://argozhang.github.io/

namespace UnitTest.Components;

public class TimePickerPanelTest : BootstrapBlazorTestBase
{
    [Fact]
    public void ShowClockScale_Ok()
    {
        var cut = Context.RenderComponent<TimePickerPanel>(pb =>
        {
            pb.Add(a => a.ShowClockScale, true);
        });
        var scale = cut.Find(".bb-clock-panel-scale");
        Assert.NotNull(scale);
    }

    [Fact]
    public void ShowSecond_Ok()
    {
        var cut = Context.RenderComponent<TimePickerPanel>(pb =>
        {
            pb.Add(a => a.ShowSecond, false);
        });
        var body = cut.Find(".bb-time-body");
        Assert.Null(body.Children.FirstOrDefault(i => i.ClassList.Contains("bb-clock-panel-second")));
    }

    [Fact]
    public void ShowMinute_Ok()
    {
        var cut = Context.RenderComponent<TimePickerPanel>(pb =>
        {
            pb.Add(a => a.ShowMinute, false);
        });
        var body = cut.Find(".bb-time-body");
        Assert.Null(body.Children.FirstOrDefault(i => i.ClassList.Contains("bb-clock-panel-minute")));
    }

    [Fact]
    public void ClickSetMode_Ok()
    {
        var cut = Context.RenderComponent<TimePickerPanel>(pb =>
        {
            pb.Add(a => a.Value, new TimeSpan(10, 10, 10));
        });

        // click hour
        var span = cut.Find(".bb-time-text.hour");
        cut.InvokeAsync(() => span.Click());
        cut.WaitForAssertion(() => cut.Contains("data-bb-mode=\"Hour\""));

        // click minute
        span = cut.Find(".bb-time-text.minute");
        cut.InvokeAsync(() => span.Click());
        cut.WaitForAssertion(() => cut.Contains("data-bb-mode=\"Minute\""));

        // click second
        span = cut.Find(".bb-time-text.second");
        cut.InvokeAsync(() => span.Click());
        cut.WaitForAssertion(() => cut.Contains("data-bb-mode=\"Second\""));
    }

    [Fact]
    public void ClickSetTimePeriod_Ok()
    {
        var cut = Context.RenderComponent<TimePickerPanel>(pb =>
        {
            pb.Add(a => a.Value, new TimeSpan(10, 10, 10));
        });

        // click am
        var span = cut.Find(".bb-time-period");
        cut.InvokeAsync(() => span.Click());
        cut.WaitForAssertion(() => cut.Contains("btn btn-pm active"));

        // click pm
        cut.InvokeAsync(() => span.Click());
        cut.WaitForAssertion(() => cut.Contains("btn btn-am active"));

        cut.SetParametersAndRender(pb =>
        {
            pb.Add(a => a.Value, new TimeSpan(14, 10, 10));
        });
        cut.InvokeAsync(() => span.Click());
        cut.WaitForAssertion(() => cut.Contains("btn btn-am active"));
        cut.InvokeAsync(() => span.Click());
        cut.WaitForAssertion(() => cut.Contains("btn btn-pm active"));

        cut.SetParametersAndRender(pb =>
        {
            pb.Add(a => a.Value, new TimeSpan(00, 10, 10));
        });

        // click button
        var button = cut.Find(".btn-pm");
        Assert.False(button.ClassList.Contains("active"));
        cut.InvokeAsync(() => button.Click());
        cut.WaitForAssertion(() => cut.Contains("btn btn-pm active"));

        // click again
        cut.InvokeAsync(() => button.Click());

        // UI is 12
        var text = cut.Find(".bb-time-text.hour");
        Assert.Equal("12", text.TextContent);

        button = cut.Find(".btn-am");
        Assert.False(button.ClassList.Contains("active"));
        cut.InvokeAsync(() => button.Click());
        cut.WaitForAssertion(() => cut.Contains("btn btn-am active"));

        // click again
        cut.InvokeAsync(() => button.Click());

        // UI is 0
        Assert.Equal("00", text.TextContent);
    }

    [Fact]
    public void SetTime()
    {
        var cut = Context.RenderComponent<TimePickerPanel>(pb =>
        {
            pb.Add(a => a.Value, new TimeSpan(10, 10, 10));
        });

        var picker = cut.Instance;
        picker.SetTime(13, 0, 0);
        Assert.Equal(new TimeSpan(13, 0, 0), picker.Value);

        // 第一次改变为下午再设置 11 时 实际为 23
        picker.SetTime(11, 10, 0);
        Assert.Equal(new TimeSpan(23, 10, 0), picker.Value);

        picker.SetTime(11, 10, 10);
        Assert.Equal(new TimeSpan(23, 10, 10), picker.Value);
    }
}
