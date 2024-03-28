import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';

function Loginscreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const backgroundImageUrl = 'https://img.freepik.com/free-photo/lobby-with-bokeh-effect_1203-623.jpg?w=740&t=st=1709749930~exp=1709750530~hmac=00e774390e7e56609e7d5bd765074239865f35dc24599fbe88542594eea18b9b';

  async function Login() {
    const user = { email, password };
    try {
      setLoading(true);
      const result = (await axios.post("/api/users/login", user)).data;
      setLoading(false);
      localStorage.setItem('currentUser', JSON.stringify(result));
      window.location.href = '/home';
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  }

  // Function to handle email change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(false); // Clear error when email changes
  };

  // Function to handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(false); // Clear error when password changes
  };

  return (
    <div>
      {loading && <Loader />}
      <div style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div className='col-md-5'>
          <div style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', padding: '20px', borderRadius: '10px', backgroundColor: 'rgba(248, 249, 250, 0.9)' }}>
            <h1 className="mb-4">Login</h1>
            <input type="email" className='form-control mb-3' placeholder='Email' value={email} onChange={handleEmailChange} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Email'} />
            <input type="password" className='form-control mb-3' placeholder='Password' value={password} onChange={handlePasswordChange} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Password'} />
            {error && <Error message='Incorrect username or password. Please try again.' />}
            <button className='btn btn-primary btn-block' onClick={Login}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginscreen;
