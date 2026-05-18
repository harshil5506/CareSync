import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: false },
  role: String,
});

const User = mongoose.model('User', userSchema);

async function check() {
  try {
    console.log('🔗 MongoDB URI:', process.env.MONGODB_URI?.slice(0, 50) + '...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected\n');
    
    const count = await User.countDocuments();
    console.log('📊 Total users:', count);
    
    const doctors = await User.find({ role: 'doctor' }).select('email name role');
    console.log('👨‍⚕️ Doctors found:', doctors.length);
    doctors.forEach(d => console.log(`   - ${d.email}`));
    
    const doctor1 = await User.findOne({ email: 'doctor1@caresync.com' });
    console.log(doctor1 ? '\n✓ doctor1@caresync.com EXISTS' : '\n✗ doctor1@caresync.com NOT FOUND');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error('✗', e.message);
    process.exit(1);
  }
}

check();
