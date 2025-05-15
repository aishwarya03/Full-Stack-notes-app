import { useState } from 'react';
import axios, { AxiosError } from 'axios';

const SignupForm = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/signup', form);
      setMessage(res.data.message);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setMessage(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm mx-auto">
      <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
      <input name="email" placeholder="John@email.com" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
      <button type="submit">Sign Up</button>
      <p>{message}</p>
    </form>
  );
};

export default SignupForm;
