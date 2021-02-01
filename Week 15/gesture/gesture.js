let element = document.documentElement;

let isListeningMouse = false;

element.addEventListener('mousedown', event => {
    let context = Object.create(null);
    // 0 0b00001 左键
    // 1 0b00100 中键/滚轮点击
    // 2 0b00010 右键
    // 3 0b01000 侧面-后退
    // 4 0b10000 侧面-前进
    contexts.set(`mouse-${1 << event.button}`, context)

    start(event, context);

    let mousemove = event => {
        let button = 1;

        while (button <= event.buttons) {
            if (button & event.buttons) {
                // order of buttons & button property are different
                let key;
                if (button === 2) {
                    key = 4;
                } else if (button === 4) {
                    key = 2;
                } else {
                    key = button;
                }
                const context = contexts.get(`mouse-${key}`);
                move(event, context);
            }
            button = button << 1;
        }
    };

    let mouseup = event => {
        console.log(event.button)
        const context = contexts.get(`mouse-${1 << event.button}`);
        end(event, context);
        contexts.delete(`mouse-${1 << event.button}`);
        if (event.buttons === 0) {
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
            isListeningMouse = false;
        }
    };

    if (!isListeningMouse) {
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        isListeningMouse = true;
    }
});

let contexts = new Map();

element.addEventListener('touchstart', event => {
    for (let touch of event.changedTouches) {
        const context = Object.create(null);
        contexts.set(touch.identifier, context);
        start(touch, context);
    }
});

element.addEventListener('touchmove', event => {
    for (let touch of event.changedTouches) {
        const context = contexts.get(touch.identifier);
        move(touch, context);
    }
});

element.addEventListener('touchend', event => {
    for (let touch of event.changedTouches) {
        const context = contexts.get(touch.identifier);
        end(touch, context);
        contexts.delete(touch.identifier);
    }
});

// alert 等打断
element.addEventListener('touchcancel', event => {
    for (let touch of event.changedTouches) {
        const context = contexts.get(touch.identifier);
        cancel(touch, context);
        contexts.delete(touch.identifier);
    }
});

let handler;
let startX;
let startY;
let isPan = false;
let isTap = true;
let isPress = false;

const start = (point, ctx) => {
    // console.log('start', point.clientX, point.clientY);
    ctx.startX = point.clientX;
    ctx.startY = point.clientY;
    ctx.points = [{
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
    }]

    ctx.isTap = true;
    ctx.isPan = false;
    ctx.isPress = false;

    ctx.handler = setTimeout(() => {
        ctx.isTap = false;
        ctx.isPan = false;
        ctx.isPress = true;
        ctx.handler = null;
        console.log('press');
    }, 500);
};

const move = (point, ctx) => {
    let dx = point.clientX - ctx.startX;
    let dy = point.clientY - ctx.startY;

    if (!ctx.isPan && dx ** 2 + dy ** 2 > 100) {
        ctx.isTap = false;
        ctx.isPan = true;
        ctx.isPress = false;
        console.log('panstart');
        clearTimeout(ctx.handler);
    }

    if (ctx.isPan) {
        console.log(dx, dy);
        console.log('pan', point.clientX, point.clientY);
    }

    // 只保留 0.5s 内的点来计算速度
    ctx.points = ctx.points.filter(point => Date.now() - point.t < 500);

    ctx.points.push({
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
    });

    // console.log('move', point.clientX, point.clientY);
};

const end = (point, ctx) => {
    if (isTap) {
        console.log('tap');
        dispatch('tap', {});
        // Tap 事件处理逻辑中没有注销定时器
        clearTimeout(ctx.handler);
    }
    if (ctx.isPan) {
        console.log('panend')
    }
    if (ctx.isPress) {
        console.log('pressend')
    }

    let d, v;
    // 只保留 0.5s 内的点来计算速度
    ctx.points = ctx.points.filter(point => Date.now() - point.t < 500);
    if (!ctx.points.length) {
        v = 0;
    } else {
        d = Math.sqrt((point.clientX - ctx.points[0].x) ** 2 + (point.clientY - ctx.points[0].y) ** 2);
        v = d / (Date.now() - ctx.points[0].t);
    }

    // v 单位： 像素/毫秒
    if (v > 1.5) {
        console.log(flick);
        context.isFlick = true;
    } else {
        context.isFlick = false;
    }
    // console.log('end', point.clientX, point.clientY);
};

const cancel = (point, ctx) => {
    clearTimeout(ctx.handler);
    console.log('cancel', point.clientX, point.clientY);
};

function dispatch(type, properties) {
    let event = new Event(type);
    for (let name in properties) {
        event[name] = properties[name];
    }
    element.dispatchEvent(event);
}