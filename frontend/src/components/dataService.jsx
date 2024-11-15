// Get data
export const getStore = () => {
    const usertoken = localStorage.getItem('token');

    return fetch('http://localhost:5005/store', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${usertoken}`,
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
};

// update the data
export const updateStore = (updatedStore) => {
    return fetch('http://localhost:5005/store', {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ store: updatedStore }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log('Updated store')
            return response.json();
        })
        .catch(error => {
            console.error("Error updating store data:", error);
            throw error;
        });
};

