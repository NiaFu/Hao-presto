import React, {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'; 
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

const style = {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh', 
    width: '100vw',
    backgroundColor: '#f5f5f5'
    
}
const loginBox = {
    width: '500px',
    height: '400px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '8px',
    justifyContent: 'center'

}
const SigninForm=(props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    // console.log(email);

    const login = async() => {
        setErrorMessage("");

        const url = 'http://localhost:5005/admin/auth/login'
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email, 
                password
            }),
        })

        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.error || `Login failed! Status: ${response.status}`);
            return;
        }

        const data = await response.json()
        if(data.token) {
            localStorage.setItem('token', data.token)
            props.setToken(data.token)
            navigate('/dashboard')
        }else {
            setErrorMessage('An error occurred, please try again.');
        }
        console.log(JSON.stringify({ email, password }));
    }
    

    return(
        <div style={style}>
            <div style={loginBox}>
                <h1 style={{ marginBottom: '20px', color: '#333' }}>Login</h1>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <TextField id="outlined-basic" label="email" variant="outlined" onChange={(e)=>setEmail(e.target.value)} /><br />
                <TextField id="outlined-basic" label="password" variant="outlined" type="password" onChange={(e)=>setPassword(e.target.value)}/><br />
                <Button variant="outlined" onClick={login} >submit</Button> 
            </div>
        </div>
    )
}

export default SigninForm;