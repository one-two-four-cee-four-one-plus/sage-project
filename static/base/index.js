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
                if (cb)
                    cb();
            } else if (url.endsWith('.css')) {
                console.log(url);
            } else {
                console.log(url);
            }
        }
        xhr.send();
    }

    this.fetch_ = (resources) => {
        if (!resources.length)
            return;
        let top = resources.shift();
        let n = 0;
        top.map(path => {
            this.load(path, () => {
                n++;
                if (n == top.length) {
                    this.fetch(resources);
                }
            })
        })
    }

    this.fetch = (resources, any=null) => {
        if (any)
            any.map(this.load);
        let copy = Object.assign([], resources);
        this.fetch_(copy);
    }
}
