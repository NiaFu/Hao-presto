import { useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';

const LogOut = (props) => {
  const navigate = useNavigate();

  const out = () => {
    props.setToken(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      {props.token === null ? (
        <>
          <Button component={Link} to="/login" variant="contained">
            LOGIN
          </Button>
          <Button component={Link} to="/register" variant="contained">
            REGISTER
          </Button>
        </>
      ) : (
        <Button variant="outlined" onClick={out}>
          Log Out
        </Button>
      )}
    </>
  );
};

export default LogOut;
