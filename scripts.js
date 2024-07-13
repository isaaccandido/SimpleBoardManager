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

async function getAllBoards() {
    try {
        const response = await communicate(`${base_url}${boards_endpoint}`, null, 'GET');

        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';

        if (response.length == 0) {
            const tdNoData = document.createElement('td');
            tdNoData.setAttribute('scope', 'row');
            tdNoData.setAttribute('colspan', '6');
            tdNoData.innerText = 'No items to display. Try adding a board!';

            const rowzona = document.createElement('tr');
            rowzona.classList.add('table-row-item');
            rowzona.appendChild(tdNoData);

            tableBody.appendChild(rowzona);

            return;
        }

        const fragment = document.createDocumentFragment();

        response.forEach(({ id, title, subtitle, color }) => {
            const row = document.createElement('tr');
            row.classList.add('table-row-item');

            const tdTitle = document.createElement('td');
            tdTitle.setAttribute('scope', 'row');
            tdTitle.innerText = title ? title : '[No value set]';

            const tdSubtitle = document.createElement('td');
            tdSubtitle.setAttribute('scope', 'row');
            tdSubtitle.innerText = subtitle ? subtitle : '[No value set]';

            const colorTdDiv = document.createElement('div');
            colorTdDiv.style.display = 'flex';
            colorTdDiv.style.alignItems = 'center';
            colorTdDiv.style.justifyContent = 'center';

            const colorSquare = document.createElement('div');
            colorSquare.style.width = '20px';
            colorSquare.style.height = '20px';
            colorSquare.style.backgroundColor = `#${color}`;
            colorSquare.style.marginRight = '10px';
            colorSquare.style.border = 'solid black 1px'

            const colorText = document.createElement('span');
            colorText.innerText = color ? `[#${color.toUpperCase()}]` : '[No value set]';

            colorTdDiv.appendChild(colorSquare);
            colorTdDiv.appendChild(colorText);

            const tdColorWrapper = document.createElement('td');
            tdColorWrapper.setAttribute('scope', 'row');
            tdColorWrapper.appendChild(colorTdDiv);

            const openButton = document.createElement('button');
            openButton.textContent = 'Open';
            openButton.classList.add('btn', 'btn-success');
            openButton.addEventListener('click', () => openBoardViewerModal(id));

            const tdOpen = document.createElement('td');
            tdOpen.setAttribute('scope', 'row');
            tdOpen.classList.add('button-table-data');
            tdOpen.appendChild(openButton);

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('btn', 'btn-warning');
            editButton.addEventListener('click', () => openBoardEditorModal(id, title, subtitle, color, true));

            const tdEdit = document.createElement('td');
            tdEdit.setAttribute('scope', 'row');
            tdEdit.classList.add('button-table-data');
            tdEdit.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.addEventListener('click', async () => {
                if (!confirm(`Are you sure you want to delete board '${title}'?`)) return;

                await communicate(`${base_url}${boards_endpoint}/${id}`, null, 'DELETE');
                await getAllBoards();
            });

            const tdDelete = document.createElement('td');
            tdDelete.setAttribute('scope', 'row');
            tdDelete.classList.add('button-table-data');
            tdDelete.appendChild(deleteButton);

            row.append(tdTitle, tdSubtitle, tdColorWrapper, tdOpen, tdEdit, tdDelete);
            fragment.appendChild(row);
        });

        tableBody.appendChild(fragment);
    } catch (error) {
        console.error('Error fetching boards:', error);
    }
}

function openBoardEditorModal(id = null, title = '', subtitle = '', color = '', editing = false) {
    debugger

    color = color.toLocaleUpperCase();

    if (!hexColorRegex.test(color)) {
        color = '#FFFFFF';
    }

    if (!color.startsWith('#')) {
        color = `#${color}`;
    }

    colorPicker.color.hexString = color;

    colorPicker.on('color:change', (color) => {
        document.getElementById('board-color-input').value = color.hexString.toUpperCase();
    });

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

async function saveBoard() {
    const id = document.getElementById('save-board-button').dataset.id;
    const title = document.getElementById('board-title-input').value;
    const subtitle = document.getElementById('board-subtitle-input').value;
    const color = document.getElementById('board-color-input').value.replace('#', '');

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${base_url}${boards_endpoint}/${id}` : `${base_url}${boards_endpoint}`;

    if (!validatePayload(id, title, color, method)) return;

    await communicate(url, { title, subtitle, color }, method);
    $('#addBoardModal').modal('hide');
    await getAllBoards();
}

function validatePayload(id, title, color, method) {
    if (method !== 'POST' && !uuidRegex.test(id)) {
        alert(`This POST operation requires a valid id! Cannot update '${title}!'`);
        return false;
    }

    if (!title || title.length < 3) {
        alert(`Title must have 3 or more characters!`);
        return false;
    }

    if (!hexColorRegex.test(color)) {
        alert(`The color '${color}' is not a valid HEX color!`);
        return false;
    }

    return true;
}

async function communicate(url, body = null, method = 'GET') {
    const options = {
        method: method,
    };

    if (method === 'POST' || method === 'PUT') {
        options.body = JSON.stringify(body);
        options.headers = {
            'Content-Type': 'application/json'
        };
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        if (method !== 'DELETE') {
            const json = await response.json();
            return json;
        }

        return response.ok;
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
        throw error;
    }
}
