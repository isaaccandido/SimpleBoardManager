async function getAllColumns(boardId, title, subtitle) {
    const columnResponse  = await communicate(`${base_url}${columns_endpoint}/${boardId}`, null, 'GET');

    columnResponse.sort((a, b) => a.hindex - b.hindex);

    const columnContainer = document.getElementById('columnContainer');
    columnContainer.innerHTML = '';
    
    columnResponse.forEach(({id, title, hindex}) => {
        const column = getColumn();
        const card = getCard(id, title, 'text')
        column.appendChild(card);
        columnContainer.appendChild(column)
    });

    const addColumnColumn = getColumn();
    const addColumnButton = document.createElement('button');
    addColumnButton.textContent = 'Add column...';
    addColumnButton.classList.add('btn', 'btn-success');
    addColumnButton.addEventListener('click', () => {
        // add column logic here
    }); 

    addColumnColumn.appendChild(addColumnButton);

    columnContainer.appendChild(addColumnColumn);
}

function getColumn(){ 
    const column = document.createElement('div');
    column.classList.add('col-sm');

    return column;
}

function getCard(id, title, text) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.width = '18rem';

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.innerText = title;

    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.innerText = text;

    const cardViewButton = document.createElement('button');
    cardViewButton.textContent = 'View Card';
    cardViewButton.classList.add('btn', 'btn-success');
    cardViewButton.addEventListener('click', async () => {
        // open view/edit modal here and retrieve card
    }); 

    const cardDeleteButton = document.createElement('button');
    cardDeleteButton.textContent = 'Delete Card';
    cardDeleteButton.classList.add('btn', 'btn-danger');
    cardDeleteButton.addEventListener('click', async () => {
        // delete card logic here
    }); 

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardViewButton);
    cardBody.appendChild(document.createElement('br'))
    cardBody.appendChild(cardDeleteButton);

    card.appendChild(cardBody)

    return card;
}