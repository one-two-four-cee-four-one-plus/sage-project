function editor(id) {
    const data = {
        'area': {
            'text': '\xa0',
            'pos': 0,
            'focused': true
        },
        'controls': {
        }
    }
    let root = new Component(byId(id), data);

    root.register((state, dom) => {
        E('div', dom, textarea => {
            E('text', textarea, left => {
                left.innerHTML = state.area.text.slice(0, state.area.pos)
            });
            E('text', textarea, cursor => {
                cursor.innerHTML = state.area.text[state.area.pos];
                cursor.className = 'inverted';
            })
            E('text', textarea, right => {
                right.innerHTML = state.area.text.slice(state.area.pos+1);
            });
            textarea.className = 'center wrap unfocused mono';
        });
    });

    (on('keypress').when(e => e.key == 'Enter')
     /* send to server */
     .do(_ => alert('sent')));
    
    (on('keypress')
     /* text insert */
     .do(e => {
         let pos = root.state.area.pos;
         root.batch([
             ['area.text', text => insertStr(text, pos, e.key)],
             ['area.pos', pos => pos + 1]
         ]); 
     }));

    (on('keydown').when(e => e.keyCode == 8)
     /* backspace */
     .do(_ => {
         event.preventDefault();
         let pos = root.state.area.pos;
         if (pos == 0)
             return;
         root.batch([
             ['area.text', text => text.slice(0, pos - 1) + text.slice(pos)],
             ['area.pos', pos => Math.max(pos - 1, 0)]
         ]);
     }));

    (on('keydown').when(e => e.keyCode == 37)
     /* left arrow */
     .do(_ => {
         event.preventDefault();
         root.atomic('area.pos', pos => Math.max(pos - 1, 0));
     }));

    (on('keydown').when(e => e.keyCode == 39)
     /* right arrow */
     .do(_ => {
         event.preventDefault();
         root.atomic('area.pos', pos => Math.min(pos + 1, root.state.area.text.length - 1));
     }));

    (on('keydown').when(e => e.keyCode == 32)
     /* space */
     .do(_ => {
         event.preventDefault();
         let pos = root.state.area.pos;
         root.batch([
             ['area.text', text => insertStr(text, pos, '\xa0')],
             ['area.pos', pos => pos + 1]
         ]);
     }));

    (on('paste')
     /* crtrl-v */
     .do(e => {
         event.preventDefault();
         if (!root.state.area.focused)
             return;
         let paste = (e.clipboardData || window.clipboardData).getData('text');
         let old_pos = root.state.area.text.pos;
         root.batch([
             ['area.text', text => insertStr(text, old_pos, paste)],
             ['area.pos', pos => pos]
         ]);
     }));
}
