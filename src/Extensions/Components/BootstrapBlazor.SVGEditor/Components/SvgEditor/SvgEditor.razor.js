﻿import Editor from "../../editor/Editor.js"
import { addLink } from '../../../BootstrapBlazor/modules/utility.js'
import Data from '../../../BootstrapBlazor/modules/data.js'

export async function init(id, preload, interop, callback) {
    await addLink("./_content/BootstrapBlazor.SvgEditor/editor/svgedit.css")

    /* for available options see the file `docs/tutorials/ConfigOptions.md */
    const svgEditor = new Editor(document.getElementById(id))
    svgEditor.setConfig({
        canvasName: id,
        lang: "en",
        allowInitialUserOverride: false,
        imgPath: "./_content/BootstrapBlazor.SvgEditor/editor/images/",
        showGrid: true,
        extPath: "/_content/BootstrapBlazor.SvgEditor/editor/extensions/",
        noDefaultExtensions: false
    })
    svgEditor.init()
    svgEditor.topPanel.showSourceEditor = async (e, forceSaving) => {
        const origSource = svgEditor.svgCanvas.getSvgString()
        await interop.invokeMethodAsync(callback, origSource);
    }

    if (preload != null) {
        svgEditor.loadFromString(preload)
    }

    var timer = setTimeout(() => {
        svgEditor.zoomChanged(window, "canvas", true);
        document.querySelector("#zoom").value = "canvas"
        clearTimeout(timer)
    }, 800)
}
