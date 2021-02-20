import { Component, createElement, STATE, ATTRIBUTE } from './framework';
import { enableGesture } from './gesture';

export { STATE, ATTRIBUTE } from './framework';

class List extends Component {
    constructor() {
        super();
    }

    render() {
        this.children = this[ATTRIBUTE].data.map(this.template);
        this.root = (<div>{this.children}</div>).render();
        return this.root;
    }

    // override
    appendChild(child) {
        this.template = child;
        this.render();
    }
}

export { List };