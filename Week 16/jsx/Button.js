import { Component, createElement, STATE, ATTRIBUTE } from './framework';
import { enableGesture } from './gesture';

export { STATE, ATTRIBUTE } from './framework';

class Button extends Component {
    constructor() {
        super();
    }

    render() {
        this.childContainer = <span />;
        this.root = (<div>{this.childContainer}</div>).render();
        return this.root;
    }

    // override
    appendChild(child) {
        if (!this.childContainer) {
            this.render();
        }
        this.childContainer.appendChild(child);
    }
}

export { Button };