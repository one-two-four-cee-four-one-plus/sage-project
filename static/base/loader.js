function ResourceLoader(root) {
    this.root = root;    

    this.load = (url, cb=null) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `${this.root}${url}`, true);
        xhr.onload = (e) => {
            if (url.endsWith('.js')) {
                let elem = document.createElement('script');
                elem.innerHTML = xhr.responseText;
                document.head.appendChild(elem);
                if (cb) cb();
            } else if (url.endsWith('.css')) {
                let elem = document.createElement('style');
                elem.innerHTML = xhr.responseText;
                document.head.appendChild(elem);
                if (cb) cb();
            } else {
                console.log(url);
            }
        };
        xhr.send();
    };

    this.fetch_ = (resources, cb) => {
        if (!resources.length) {
            if (cb) cb();
            return;
        }
        let top = resources.shift();
        let n = 0;
        top.map(path => {
            this.load(path, () => {
                n++;
                if (n == top.length) {
                    this.fetch_(resources, cb);
                }
            });
        });
    };

    this.fetch = (resources, cb=null) => {
        let copy = Object.assign([], resources);
        this.fetch_(copy, cb);
    };

    this.any = (resources, cb=null) => {
        this.fetch_([resources], cb);
    };
}
