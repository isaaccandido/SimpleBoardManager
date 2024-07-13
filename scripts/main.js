const base_url = 'http://localhost:8080';
const boards_endpoint = '/boards';
const columns_endpoint = '/columns';
const cards_endpoint = '/cards';
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const hexColorRegex = /^[0-9a-fA-F]{6}$/;

const colorPicker = new iro.ColorPicker('#picker');

document.addEventListener('DOMContentLoaded', getAllBoards);
document.getElementById('get-all-boards-button').addEventListener('click', getAllBoards);
document.getElementById('add-board-button').addEventListener('click', () => openBoardEditorModal());
document.getElementById('save-board-button').addEventListener('click', saveBoard);

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

function openBoardViewerModal(id) {
    $('#boardViewModal').modal('show');
}

