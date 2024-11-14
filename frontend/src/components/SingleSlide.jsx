import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { getStore } from './dataGet';

const SingleSlide = () => {
    const { id } = useParams();
    console.log(id);
    return (
        <>
        single 
        </>
    );
}

export default SingleSlide;