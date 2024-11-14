import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { getStore } from './dataGet';

const SingleSlide = () => {
    const { id } = useParams();
    console.log(id);
    const navigate = useNavigate();
    const [presentation, setPresentation] = useState({});

    const getPresentation=()=>{
        getStore()
        .then(data=>{
            const singlePresentation = data.store[id];
            setPresentation(singlePresentation);
        })
    }

    useEffect(() => {
        getPresentation();
    }, [id]);

    const deletePresentation = () =>{
        const confirmHander = window.confirm('Are you sure?');
        if (confirmHander) {
            getStore()
            .then(data=>{
                delete data.store[id];
                console.log(data);

                //Put
                const userToken = localStorage.getItem('token');
                fetch('http://localhost:5005/store', {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${userToken}`, 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({store: data.store}),
                })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                
                navigate('/dashboard');
            })
        }
    }

    return (
        <>
        {/* top */}
        <div>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>Back</Button>
        <Button variant="contained" onClick={(deletePresentation)}>Delete Presentation</Button>
        <h1>Title:{presentation.title}</h1>
        </div>
        {/* slide */}
        {/* button */}
        </>
    );
}

export default SingleSlide;