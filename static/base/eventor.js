const on = (function () {
    var instance;

    function UnconditionalListener(type, action, target=document) {
        this.type = type;
        this.target = target;
        this.action = action;

        this.handler = e => {
            this.action(e);
        }

        document.addEventListener(this.type, this.handler);

        this.set = (action) => {
            this.action = action;
        }

        this.forget = () => {
            this.target.removeEventListener(this.type, this.handle);
        }
    }

    function ConditionalListener(type, target=document) {
        this.type = type;
        this.target = target;
        this.pairs = [];
        this.default = null;

        this.handle = e => {
            for(let i=0; i<this.pairs.length; i++) {
                let [match, handle] = this.pairs[i];
                if(match(e)) {
                    handle(e);
                    return;
                }
            }
            if (this.default) {
                this.default(e);
            }
        };

        this.target.addEventListener(this.type, this.handle);

        this.add = (condition, action) => {
            this.pairs.push([condition, action]);
        }

        this.forget = () => {
            this.target.removeEventListener(this.type, this.handle);
        }
    }
    
    function EventDispatcher() {
        this.mapping = {}

        this.on = (type, target=document) => {
            return {
                do: (action) => {
                    if (this.mapping[type] === undefined) {
                        let listener = new UnconditionalListener(type, action, target);
                        this.mapping[type] = listener;
                    } else if (this.mapping[type] instanceof UnconditionalListener) {
                        this.mapping[type].set(action);
                    } else {
                        this.mapping[type].default = action;
                    }
                },
                when: (condition, ) => {
                    return {
                        do: (action) => {
                            if (this.mapping[type] === undefined) {
                                let listener = new ConditionalListener(type, target);
                                listener.add(condition, action);
                                this.mapping[type] = listener;
                            } else if (this.mapping[type] instanceof ConditionalListener) {
                                this.mapping[type].add(condition, action);
                            } else {
                                console.error("mixing of conditional and unconditional handlers for ${type}");
                            }
                        }
                    }
                }
            };
        }
    }

    const propogate = (method) => {
        if (!instance)
            instance = new EventDispatcher();
        return instance[method];
    }

    return propogate('on')
})();
