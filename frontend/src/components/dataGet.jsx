export const getStore=() =>{
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
}