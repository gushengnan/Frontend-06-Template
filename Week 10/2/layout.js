function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }

    for (let prop in element.computedStyle) {
        let p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }

        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseFloat(element.style[prop])
        }
    }

    return element.style;
}

function layout(element) {
    if (!element.computedStyle) {
        return;
    }

    let elementStyle = getStyle(element);

    if (elementStyle.display !== 'flex') {
        return;
    }

    let items = element.children.filter(e => e.type === 'element');

    items.sort((a, b) => { return (a.order || 0) - (b.order || 0) });

    let style = elementStyle;

    ['width', 'height'].forEach(size => {
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null;
        }
    });

    // 默认赋值处理
    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row';
    }

    if (!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch';
    }

    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start';
    }

    if (!style.alignContent || style.alignContent === 'auto') {
        style.flexDirection = 'stretch';
    }

    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row';
    }

    let mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase;

    if (style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    // 交叉轴的 wrap-reverse 控制交叉轴的开始和结束位置及计算符号
    if (style.flexWrap === 'wrap-reverse') {
        let tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1
    } else {
        crossBase = 0;
        crossSign = +1;
    }

    let isAutoMainSize = false;
    if (!stlye[mainSize]) {   // auto sizing
        elementStyle[mainSize] = 0;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] = elementStyle[mainSize]
            }
            isAutoMainSize = true;
        }
    }

    let flexLine = [];
    let flexLines = [flexLine];

    let mainSpace = elementStyle[mainSize];
    let crossSpace = 0;

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);

        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;

        }

        // 如果子元素有 flex 属性
        if (itemStyle.flex) {
            flexLine.push(item);
        } else if (
            // 如果父元素 nowrap 且 子元素大小按内容撑开
            style.flexWrap === 'nowrap' && isAutoMainSize
        ) {
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            flexLine.push(item);
        } else {
            // 如果单个子元素容器宽度超出容器元素宽度，则将子元素宽度设置为容器元素宽度
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
            }
            // 如果当前行剩余空间不足以容纳 item 元素，则换行
            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(item);
            }

            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            mainSpace -= itemStyle[mainSize];
        }
    }
    // 最后一个元素的首位设置
    flexLine.mainSpace = mainSpace;
    console.log(items);
}

module.exports = layout;