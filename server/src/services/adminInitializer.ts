import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';

export async function ensureAdminCredentials(): Promise<void> {
  try {
    const adminEmail = 'vipulphatangare3@gmail.com';
    const adminPass = '0831';

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPass, salt);

    await User.findOneAndUpdate(
      { email: adminEmail.toLowerCase() },
      {
        $setOnInsert: { name: 'Vipul Phatangare' },
        $set: { passwordHash, role: 'ADMIN' },
      },
      { upsert: true, new: true }
    );
    console.log(`[AdminInit] Admin credentials verified for: ${adminEmail}`);
  } catch (err: any) {
    console.error('[AdminInit] Error ensuring admin credentials:', err.message);
  }
}
