const MENU_ICONS = {
    arrowLeft: '<path fill="currentColor" d="M9.5 2.5 4 8l5.5 5.5V11h4V5h-4V2.5z"/>',
    arrowRight: '<path fill="currentColor" d="M6.5 2.5 12 8l-5.5 5.5V11H3V5h3.5V2.5z"/>',
    arrowUp: '<path fill="currentColor" d="M2.5 9.5 8 4l5.5 5.5H11v4H5v-4H2.5z"/>',
    arrowDown: '<path fill="currentColor" d="M2.5 6.5 8 12l5.5-5.5H11V3H5v3.5H2.5z"/>',
    play: '<path fill="currentColor" d="M4 3.5 12.5 8 4 12.5V3.5z"/>',
    stop: '<rect fill="currentColor" x="4.5" y="4.5" width="7" height="7"/>',
    frameLeft: '<path fill="currentColor" d="M1.5 8 6 4.5V6.5h3.5v3H6v2L1.5 8z"/><rect fill="none" stroke="currentColor" stroke-width="1.2" x="11" y="4.5" width="4.5" height="7" rx="0"/>',
    frameRight: '<rect fill="none" stroke="currentColor" stroke-width="1.2" x="0.5" y="4.5" width="4.5" height="7" rx="0"/><path fill="currentColor" transform="translate(2.5, 0)" d="M7 4.5 11.5 8 7 11.5V9.5H4v-3h3V4.5z"/>',
};

const menuIcon = (name) => {
    const paths = MENU_ICONS[name];
    if (!paths) return name;
    return `<span class="menu-icon" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14">${paths}</svg></span>`;
};

const gui = (options, dropHandler) => {

    let fileDialogs = 0;
 
    const addMenuItem = (name, handler, parent = 'menulist', hint) => {
        const li = $('<li/>').html(name).addClass('menuitem');
        if (name.includes('menu-icon')) {
            li.addClass('menuitem-icon');
            if (hint) li.attr('aria-label', hint.replace(/\s*\[.*\]$/, ''));
        }
        li.bind('click', e => {
            e.preventDefault();
            e.stopPropagation();
            if (handler) handler();
        });
        if (hint) li.attr('title', hint);
        li.appendTo(`#${parent}`);
        return li;
    }

    const addMenuFileOpen = (name, handler, parent = 'menulist', hint, accept) => {
        const inp = $(`<input type='file' id='fdialog${fileDialogs}' class='fileinput' onclick='this.value=null'>`);
        if (accept) {inp.attr('accept',accept)}
        const label = $('<label/>').attr('for', `fdialog${fileDialogs}`).html(name).addClass('menuitem');
        inp.change(handler);
        if (hint) label.attr('title', hint);
        $(`#${parent}`).append(inp, label);
        fileDialogs++;
        return label;
    }

    const addSeparator = (parent = 'menulist') => {
        $('<div/>').addClass('menuseparator').appendTo(`#${parent}`)
    }

    const addBR = (parent = 'menulist') => {
        $('<div/>').addClass('menubr').appendTo(`#${parent}`)
    }

    $('#save_options').click(saveOptions);
    $('#close_export').click(saveOptions);
		$('#close_import').click(saveOptions);
    $('#close_help').click(toggleHelp);
    $('#opt_lastTemplate_i').change(templateChange);

    $("select, input").filter( (i,o) => { return _.endsWith($(o).attr('id'),'_b')} ).change(()=>{
        updateOptions();
    });

    for (let templateIdx in exportTemplates) {
        const template = exportTemplates[templateIdx];
        const option = $('<option/>').val(templateIdx).html(template.name);
        $('#opt_lastTemplate_i').append(option);
    };

    $('html').on("drop", function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.originalEvent.dataTransfer.files) {
            // Use DataTransferItemList interface to access the file(s)
            for (var i = 0; i < event.originalEvent.dataTransfer.files.length; i++) {
                // If dropped items aren't files, reject them
                const file = event.originalEvent.dataTransfer.files[i];
                if (confirm(`Load new file ${file.name}?`)) {
                    dropHandler(file);
                }
            }
        }

    });

    return {
        addMenuItem,
        addMenuFileOpen,
        addSeparator,
        addBR,
        menuIcon
    }
};
