const bcrypt = require('bcryptjs');

async function hashPassword(password) {
    // Jumlah "salt rounds" menentukan kompleksitas hash.
    // Semakin tinggi nilainya, semakin aman hash-nya, tapi juga semakin lama proses hashing-nya.
    // 10 adalah nilai yang umumnya direkomendasikan.
    const saltRounds = 3;

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        // 2. Hash kata sandi menggunakan salt yang sudah digenerate
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        // throw new Error('Failed to hash password');
    }
}

async function comparePassword(plainPassword, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error comparing password:', error);
        // throw new Error('Failed to compare password');
    }
}

// --- Contoh Penggunaan ---

// (Opsional) Langsung jalankan untuk pengujian
// (Ini hanya contoh, dalam aplikasi nyata akan dipanggil dari router/controller)
// async function main() {
//   const myPassword = 'password123';

//   try {
//     const hashed = await hashPassword(myPassword);
//     console.log('Hashed Password:', hashed);

//     // Verifikasi kata sandi
//     const isCorrect = await comparePassword(myPassword, hashed);
//     console.log('Password matches:', isCorrect); // Output: true

//     const isIncorrect = await comparePassword('wrongpassword', hashed);
//     console.log('Password matches (wrong):', isIncorrect); // Output: false

//   } catch (error) {
//     console.error('Operation failed:', error.message);
//   }
// }

// main();

module.exports = {
    hashPassword,
    comparePassword
};