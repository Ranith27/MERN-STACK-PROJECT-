import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Success from '../components/Success';

function Registerscreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const backgroundImageUrl = 'https://img.freepik.com/premium-photo/abstract-blur-background-registration-desk-business-seminar-meeting-with-staff-hotel-as-conference-event-concept_379823-12688.jpg?w=826';

  async function register() {
    if (password === cpassword) {
      const user = { name, email, password, cpassword };

      try {
        setLoading(true);
        const result = await axios.post("/api/users/register", user).data;
        setLoading(false);
        setSuccess(true);

        setName('');
        setEmail('');
        setPassword('');
        setCPassword('');
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(true);
      }
    } else {
      alert("Password not matched");
    }
  }

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(false);
      }, 3000); // Change 3000 to the duration you prefer in milliseconds
    }
    return () => clearTimeout(timer);
  }, [success]);

  return (
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
          <h1 className="mb-4">Register</h1>
          <input type="text" className='form-control mb-3' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" className='form-control mb-3' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" className='form-control mb-3' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="password" className='form-control mb-3' placeholder='Confirm Password' value={cpassword} onChange={(e) => setCPassword(e.target.value)} />
          <button className='btn btn-primary btn-block mb-3' onClick={register}>Register</button>
          {loading && <Loader />}
          {error && <Error />}
          {success && <Success message="Registration success" style={{ marginBottom: '10px' }} />}
        </div>
      </div>
    </div>
  );
}

export default Registerscreen;

