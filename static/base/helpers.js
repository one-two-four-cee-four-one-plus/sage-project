const byId = (id) => { return document.getElementById(id); }
const E = (tag, root, init) => {
    let elem = document.createElement(tag);
    init(elem);
    if (root)
        root.appendChild(elem);
    return elem;
}
const log = (obj) => { console.log(JSON.parse(JSON.stringify(obj))) };
const isStr = (obj) => { return typeof obj === 'string' || obj instanceof String };
const insertStr = (str, idx, elem) => { return str.slice(0, idx) + elem + str.slice(idx) };
const modify = (obj, action) => {
    let copy = Object.assign({}, obj);
    action(copy);
    return copy;
}
