const base_url = 'http://localhost:8080';
const boards_endpoint = '/boards';
const columns_endpoint = '/columns';
const cards_endpoint = '/cards';
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const hexColorRegex = /^[0-9a-fA-F]{6}$/;

document.addEventListener('keyup', function(event) {
    if (event.key === 'Escape') closeModals();
});
document.addEventListener('DOMContentLoaded', getAllBoards);
document.getElementById('get-all-boards-button').addEventListener('click', getAllBoards);
document.getElementById('add-board-button').addEventListener('click', () => openBoardEditorModal());
document.getElementById('save-board-button').addEventListener('click', saveBoard);