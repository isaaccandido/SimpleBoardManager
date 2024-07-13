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

            const viewButton = document.createElement('button');
            viewButton.textContent = 'View';
            viewButton.classList.add('btn', 'btn-success');
            viewButton.addEventListener('click', () => openBoardViewerModal(id));

            const tdView = document.createElement('td');
            tdView.setAttribute('scope', 'row');
            tdView.classList.add('button-table-data');
            tdView.appendChild(viewButton);

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

            row.append(tdTitle, tdSubtitle, tdColorWrapper, tdView, tdEdit, tdDelete);
            fragment.appendChild(row);
        });

        tableBody.appendChild(fragment);
    } catch (error) {
        console.error('Error fetching boards:', error);
    }
}

async function saveBoard() {
    const id = document.getElementById('save-board-button').dataset.id;
    const title = document.getElementById('board-title-input').value;
    const subtitle = document.getElementById('board-subtitle-input').value;
    const color = document.getElementById('board-color-input').value.replace('#', '');

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${base_url}${boards_endpoint}/${id}` : `${base_url}${boards_endpoint}`;

    if (!validateBoardPayload(id, title, color, method)) return;

    await communicate(url, { title, subtitle, color }, method);
    $('#addBoardModal').modal('hide');
    await getAllBoards();
}