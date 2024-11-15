import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material.Button';
import TextField from '@mui/material/TextField';

const style = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  backgroundColor: '#f5f5f5',
};

const RegistBox = {
  width: '500px',
  height: '500px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderRadius: '8px',
  justifyContent: 'center',
};

const SignupForm = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const register = async () => {
    setErrorMessage('');

    if (password.trim() !== confirmPassword.trim()) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    const url = 'http://localhost:5005/admin/auth/register';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setErrorMessage(data.error || `Registration failed! Status: ${response.status}`);
      return;
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      props.setToken(data.token);
      navigate('/dashboard');
    } else {
      setErrorMessage('An error occurred, please try again.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      register();
    }
  };

  return (
    <div style={style}>
      <div style={RegistBox}>
        <h1 style={{ marginBottom: '20px', color: '#333' }}>Register</h1>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <TextField
          id="name-field"
          label="Name"
          variant="outlined"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          id="email-field"
          label="Email"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          id="password-field"
          label="Password"
          variant="outlined"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          id="confirm-password-field"
          label="Confirm Password"
          variant="outlined"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ marginBottom: '20px' }}
        />
        <Button variant="outlined" onClick={register}>
          Register
        </Button>
      </div>
    </div>
  );
};

export default SignupForm;
