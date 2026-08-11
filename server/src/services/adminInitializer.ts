import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';

export async function ensureAdminCredentials(): Promise<void> {
  try {
    const adminEmail = 'vipulphatangare3@gmail.com';
    const adminPass = '0831';

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPass, salt);

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (!existingAdmin) {
      await User.create({
        name: 'Vipul Phatangare',
        email: adminEmail.toLowerCase(),
        passwordHash,
        role: 'ADMIN',
      });
      console.log(`[AdminInit] Admin user created successfully: ${adminEmail}`);
    } else {
      existingAdmin.passwordHash = passwordHash;
      existingAdmin.role = 'ADMIN';
      await existingAdmin.save();
      console.log(`[AdminInit] Admin credentials updated for: ${adminEmail}`);
    }
  } catch (err: any) {
    console.error('[AdminInit] Error ensuring admin credentials:', err.message);
  }
}
