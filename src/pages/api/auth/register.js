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

  try {
    const { name, email, password, role, ...additionalData } = req.body;

    // Check if user already exists
    const Model = role === 'patient' ? Patient : Doctor;
    const existingUser = await Model.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with modified data structure
    const userData = {
      name,
      email,
      password: hashedPassword,
      ...(role === 'patient' ? {
        ...additionalData,
        allergies: additionalData.allergies ? additionalData.allergies.split(',').map(item => item.trim()) : []
      } : {
        specialization: additionalData.specialization,
        phoneNumber: additionalData.phoneNumber
      })
    };

    // Create new user
    const newUser = new Model(userData);
    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { 
        id: role === 'patient' ? newUser.patientId : newUser.doctorId,
        role 
      },
      'your_jwt_secret',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const user = newUser.toObject();
    delete user.password;

    res.status(201).json({ 
      success: true, 
      user: { ...user, role }, 
      token 
    });

    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push(role === 'patient' ? '/patient/landing' : '/doctor/dashboard');
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
