import * as bcrypt from 'bcryptjs';

const securePassword = async (password: string): Promise<string> => {
    const salt: string = await bcrypt.genSalt(8);
    const hashedPassword: string = await bcrypt.hash(password, salt);
    return hashedPassword;
};

export default securePassword;