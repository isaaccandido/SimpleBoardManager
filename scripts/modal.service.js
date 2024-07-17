function openBoardEditorModal(id = null, title = '', subtitle = '', color = '', editing = false) {
    color = color.toLocaleUpperCase();

    if (!hexColorRegex.test(color)) color = '#FFFFFF';
    if (!color.startsWith('#')) color = `#${color}`;

    colorPicker.color.hexString = color;

    colorPicker.on('color:change', (color) => document.getElementById('board-color-input').value = color.hexString.toUpperCase());

    document.getElementById('addBoardModalTitle').innerText = editing ? `Editing board '${title}'` : 'Create Board';
    document.getElementById('board-title-input').value = title;
    document.getElementById('board-subtitle-input').value = subtitle;
    document.getElementById('board-color-input').value = !!color ? color : '#FFFFFF';
    document.getElementById('save-board-button').dataset.id = id || '';

    $('#addBoardModal').modal('show');
}

function openBoardViewerModal() {
    $('#boardViewModal').modal('show');
}

function closeModals() {
    $('#addBoardModal').modal('hide');
    $('#boardViewModal').modal('hide');
}