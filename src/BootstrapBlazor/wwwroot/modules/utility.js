﻿const vibrate = () => {
    if ('vibrate' in window.navigator) {
        window.navigator.vibrate([200, 100, 200])
        const handler = window.setTimeout(function () {
            window.clearTimeout(handler)
            window.navigator.vibrate([])
        }, 1000)
    }
}

const isFunction = object => {
    return typeof object === 'function'
}

function selectionSet(elem) {
    const sel = document.getSelection();
    if (sel) {
        const range = document.createRange();
        range.selectNodeContents(elem);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

function selectionClear() {
    const sel = document.getSelection();
    if (sel) {
        sel.removeAllRanges();
    }
}

function copyTextUsingDOM(str) {
    const tempElem = document.createElement("div");
    tempElem.setAttribute("style", "-webkit-user-select: text !important");
    let spanParent = tempElem;
    if (tempElem.attachShadow) {
        spanParent = tempElem.attachShadow({ mode: "open" });
    }
    const span = document.createElement("span");
    span.innerText = str;
    spanParent.appendChild(span);
    document.body.appendChild(tempElem);
    selectionSet(span);
    const result = document.execCommand("copy");
    selectionClear();
    document.body.removeChild(tempElem);
    return result;
}

const copy = (text = '') => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
    } else {
        copyTextUsingDOM(text)
    }
}

const getUID = (prefix = '') => {
    do {
        prefix += Math.floor(Math.random() * 1000000)
    } while (document.getElementById(prefix))

    return prefix
}

const getInnerWidth = element => getWidth(element, true)

const getOuterWidth = element => {
    let width = element.getBoundingClientRect().width
    const styles = getComputedStyle(element)
    const marginLeft = parseFloat(styles.marginLeft)
    const marginRight = parseFloat(styles.marginRight)
    return width + marginLeft + marginRight
}

const getWidth = (element, self = false) => {
    let width = element.getBoundingClientRect().width
    if (self) {
        const styles = getComputedStyle(element)
        const borderLeftWidth = parseFloat(styles.borderLeftWidth)
        const borderRightWidth = parseFloat(styles.borderRightWidth)
        const paddingLeft = parseFloat(styles.paddingLeft)
        const paddingRight = parseFloat(styles.paddingRight)
        width = width - borderLeftWidth - borderRightWidth - paddingLeft - paddingRight
    }
    return width
}

const getInnerHeight = element => getHeight(element, true)

const getOuterHeight = element => {
    let height = element.getBoundingClientRect().height
    const styles = getComputedStyle(element)
    const marginTop = parseFloat(styles.marginTop)
    const marginBottom = parseFloat(styles.marginBottom)
    return height + marginTop + marginBottom
}

const getHeight = (element, self = false) => {
    let height = element.getBoundingClientRect().height
    if (self) {
        const styles = getComputedStyle(element)
        const borderTopWidth = parseFloat(styles.borderTopWidth)
        const borderBottomWidth = parseFloat(styles.borderBottomWidth)
        const paddingTop = parseFloat(styles.paddingTop)
        const paddingBottom = parseFloat(styles.paddingBottom)
        height = height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom
    }
    return height
}

const getWindowScroll = node => {
    const win = getWindow(node)
    const scrollLeft = win.pageXOffset
    const scrollTop = win.pageYOffset
    return {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
    }
}

const getWindow = node => {
    if (!node) {
        return window
    }

    if (node.toString() !== '[object Window]') {
        const ownerDocument = node.ownerDocument
        return ownerDocument ? ownerDocument.defaultView || window : window
    }

    return node
}

const normalizeLink = link => {
    let url = link
    if (url.indexOf('./') === 0) {
        url = url.substring(2)
    }
    while (url.indexOf('../') === 0) {

        url = url.substring(3)
    }
    return url
}

const addScript = content => {
    // content 文件名
    const scripts = [...document.getElementsByTagName('script')]
    const url = normalizeLink(content)
    let link = scripts.filter(function (link) {
        return link.src.indexOf(url) > -1
    })
    if (link.length === 0) {
        const script = document.createElement('script')
        link.push(script)
        script.setAttribute('src', content)
        document.body.appendChild(script)
        script.onload = () => {
            script.setAttribute('loaded', true)
        }
    }
    return new Promise((resolve, reject) => {
        const handler = setInterval(() => {
            const done = link[0].getAttribute('loaded') === 'true'
            if (done) {
                clearInterval(handler)
                resolve()
            }
        }, 20)
    })
}

const removeScript = content => {
    const links = [...document.getElementsByTagName('script')]
    const url = normalizeLink(content)
    const nodes = links.filter(function (link) {
        return link.src.indexOf(url) > -1
    })
    for (let index = 0; index < nodes.length; index++) {
        document.body.removeChild(nodes[index])
    }
}

const addLink = href => {
    const links = [...document.getElementsByTagName('link')]
    const url = normalizeLink(href)
    let link = links.filter(function (link) {
        return link.href.indexOf(url) > -1
    })
    if (link.length === 0) {
        const css = document.createElement('link')
        link.push(css)
        css.setAttribute('href', href)
        css.setAttribute("rel", "stylesheet")
        document.getElementsByTagName("head")[0].appendChild(css)
        css.onload = () => {
            css.setAttribute('loaded', true)
        }
    }
    return new Promise((resolve, reject) => {
        const handler = setInterval(() => {
            const done = link[0].getAttribute('loaded') === 'true'
            if (done) {
                clearInterval(handler)
                resolve()
            }
        }, 20)
    })
}

const removeLink = href => {
    const links = [...document.getElementsByTagName('link')]
    const url = normalizeLink(href)
    const nodes = links.filter(function (link) {
        return link.href.indexOf(url) > -1
    })
    for (let index = 0; index < nodes.length; index++) {
        document.getElementsByTagName("head")[0].removeChild(nodes[index])
    }
}

const insertBefore = (element, newEl) => {
    if (element) {
        const parentNode = element.parentNode
        if (parentNode) {
            if (element) {
                parentNode.insertBefore(newEl, element)
            }
        }
    }
}

const insertAfter = (element, newEl) => {
    if (element) {
        const parentNode = element.parentNode
        if (parentNode) {
            if (element.nextElementSibling) {
                parentNode.insertBefore(newEl, element.nextElementSibling)
            } else {
                parentNode.appendChild(newEl)
            }
        }
    }
}

const drag = (element, start, move, end) => {
    const handleDragStart = e => {
        let notDrag = false
        if (isFunction(start)) {
            notDrag = start(e) || false
        }

        if (!notDrag) {
            e.preventDefault()
            e.stopPropagation()

            document.addEventListener('mousemove', handleDragMove)
            document.addEventListener('touchmove', handleDragMove)
            document.addEventListener('mouseup', handleDragEnd)
            document.addEventListener('touchend', handleDragEnd)
        }
    }

    const handleDragMove = e => {
        if (e.touches && e.touches.length > 1) {
            return;
        }

        if (isFunction(move)) {
            move(e)
        }
    }

    const handleDragEnd = e => {
        if (isFunction(end)) {
            end(e)
        }

        const handler = window.setTimeout(() => {
            window.clearTimeout(handler)
            document.removeEventListener('mousemove', handleDragMove)
            document.removeEventListener('touchmove', handleDragMove)
            document.removeEventListener('mouseup', handleDragEnd)
            document.removeEventListener('touchend', handleDragEnd)
        }, 10)
    }

    element.addEventListener('mousedown', handleDragStart)
    element.addEventListener('touchstart', handleDragStart)
}

const getDescribedElement = (element, selector = 'aria-describedby') => {
    if (isElement(element)) {
        let id = element.getAttribute(selector)
        if (id) {
            if (id.indexOf('.') === -1) {
                id = `#${id}`
            }
            return document.querySelector(id)
        }
    }
    return null
}

const getDescribedOwner = (element, selector = 'aria-describedby') => {
    if (isElement(element)) {
        const id = element.getAttribute('id')
        if (id) {
            return document.querySelector(`[${selector}="${id}"]`)
        }
    }
    return null
}

const isElement = object => {
    if (!object || typeof object !== 'object') {
        return false
    }

    if (typeof object.jquery !== 'undefined') {
        object = object[0]
    }

    return typeof object.nodeType !== 'undefined'
}

const getElement = object => {
    // it's a jQuery object or a node element
    if (isElement(object)) {
        return object.jquery ? object[0] : object
    }

    if (typeof object === 'string' && object.length > 0) {
        return document.querySelector(object)
    }

    return null
}

const getElementById = object => {
    if (typeof object === 'string' && object.length > 0 && object.substring(0, 1) !== '.' && object.substring(0, 1) !== '#') {
        object = `#${object}`
    }

    return getElement(object);
}

const getTargetElement = (element, selector = 'data-bs-target') => {
    if (isElement(element)) {
        const id = element.getAttribute(selector)
        if (id) {
            return document.querySelector(id)
        }
    }
    return null
}

const getTransitionDelayDurationFromElement = (element, delay = 80) => {
    return getTransitionDurationFromElement(element) + delay
}

const getTransitionDurationFromElement = (element) => {
    if (!element) {
        return 0
    }

    // Get transition-duration of the element
    let { transitionDuration, transitionDelay } = window.getComputedStyle(element)

    const floatTransitionDuration = Number.parseFloat(transitionDuration)
    const floatTransitionDelay = Number.parseFloat(transitionDelay)

    // Return 0 if element or transition duration is not found
    if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0
    }

    // If multiple durations are defined, take the first
    transitionDuration = transitionDuration.split(',')[0]
    transitionDelay = transitionDelay.split(',')[0]

    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * 1000
}

const isVisible = element => {
    if (!isElement(element) || element.getClientRects().length === 0) {
        return false
    }

    const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible'
    // Handle `details` element as its content may falsie appear visible when it is closed
    const closedDetails = element.closest('details:not([open])')

    if (!closedDetails) {
        return elementIsVisible
    }

    if (closedDetails !== element) {
        const summary = element.closest('summary')
        if (summary && summary.parentNode !== closedDetails) {
            return false
        }

        if (summary === null) {
            return false
        }
    }

    return elementIsVisible
}

const isDisabled = element => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return true
    }

    if (element.classList.contains('disabled')) {
        return true
    }

    if (typeof element.disabled !== 'undefined') {
        return element.disabled
    }

    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false'
}

const hackPopover = (popover, css) => {
    if (popover) {
        popover._isWithContent = () => true

        const getTipElement = popover._getTipElement
        let fn = tip => {
            tip.classList.add(css)
        }
        popover._getTipElement = () => {
            let tip = getTipElement.call(popover)
            fn(tip)
            return tip
        }
    }
}

const setIndeterminate = (object, state) => {
    const element = getElementById(object)
    if (isElement(element)) {
        element.indeterminate = state;
    }
}

const getOverflowParent = element => {
    let parent = element.parentNode
    while (parent.nodeType === 1) {
        const style = getComputedStyle(parent)
        const overflowY = style.getPropertyValue('overflow-y')
        if (overflowY === 'auto' || overflowY === 'scroll') {
            break;
        }
        parent = parent.parentNode
    }
    if (parent.nodeType !== 1) {
        parent = getWindow()
    }
    return parent
}

/*
 * @param {function} fn - 原函数
 * @param {number} duration - 防抖时长
 * @return {function} - 条件回调返回真时立即执行
 */
const debounce = function (fn, duration = 200, callback = null) {
    let handler = null
    return function () {
        if (handler) {
            clearTimeout(handler)
        }
        if (callback && typeof (callback) === 'function') {
            var v = callback.apply(this, arguments)
            if (v === true) {
                handler = null
            }
        }
        if (handler === null) {
            fn.apply(this, arguments)

            handler = setTimeout(() => {
                handler = null
            }, duration)
        }
        else {
            handler = setTimeout(() => {
                fn.apply(this, arguments)
            }, duration)
        }
    }
}

export {
    addLink,
    addScript,
    copy,
    debounce,
    drag,
    insertBefore,
    insertAfter,
    isDisabled,
    isElement,
    isFunction,
    isVisible,
    getElement,
    getElementById,
    getDescribedElement,
    getDescribedOwner,
    getHeight,
    getInnerHeight,
    getInnerWidth,
    getOuterHeight,
    getOuterWidth,
    getOverflowParent,
    getTargetElement,
    getTransitionDelayDurationFromElement,
    getWidth,
    getWindow,
    getWindowScroll,
    getUID,
    hackPopover,
    removeLink,
    removeScript,
    setIndeterminate,
    vibrate
}
