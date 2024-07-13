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
