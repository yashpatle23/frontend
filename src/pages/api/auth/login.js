import dbConnect from '../../../utils/dbConnect';
import Patient from '../../../models/Patient';
import Doctor from '../../../models/Doctor';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  const { email, password, role } = req.body;
  
  try {
    const Model = role === 'patient' ? Patient : Doctor;
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: role === 'patient' ? user.patientId : user._id,
        role 
      },
      'your_jwt_secret',
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      success: true,
      token, 
      user: { 
        ...user._doc, 
        password: undefined,
        role
      } 
    });

    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push(role === 'patient' ? '/patient/landing' : '/doctor/dashboard');
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
