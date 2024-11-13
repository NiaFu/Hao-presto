import React, {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom'; 
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

const LogOut = (props) =>{
    const navigate = useNavigate();

    const out = () =>{
        props.setToken(null);
        localStorage.removeItem('token');
        navigate('/')
    }


    return(
        <>
        {props.token === null 
                ? (
                    <>
                        <Button component = {Link} to = "/login" variant="contained">LOGIN</Button>
                        <Button component = {Link} to = "/register" variant="contained">REGISTER</Button>
                    </>
                ) : (
                    <>
                        <Button variant="outlined" onClick={out}>Log Out</Button>
                    </>
                )
            }
        </>
    )
}

export default LogOut;