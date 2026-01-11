import bcrypt from "bcryptjs";

const generateHashedPassword = async (rawPassword: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    return hashedPassword;
}

const decodePassword = async (rawPassword: string, hashedPassword: string) => {
    return await bcrypt.compare(rawPassword, hashedPassword);
}

export { generateHashedPassword, decodePassword };