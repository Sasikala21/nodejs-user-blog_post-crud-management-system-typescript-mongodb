import UserModel from '../models/userModel'; // Assuming the path to your UserModel is correct

const userData = [
    { firstName: 'Admin', lastName: 'Tech', email: 'techadmin@example.com', username: 'techAdmin', password: 'Admin@123', mobile: 9089089013, role: 'Admin' },
];

const seedUsers = async () => {
    try {
        // Insert user data into the database
        await UserModel.create(userData);
        console.log('User data seeded successfully');
    } catch (error) {
        console.error('Error seeding user data:', error);
    }
};

// Call the seedUsers function to seed the data when this file is executed
seedUsers();
