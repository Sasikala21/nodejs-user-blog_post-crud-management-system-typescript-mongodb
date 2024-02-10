import UserModel from '../models/userModel'; 

const userData = [
    { firstName: 'Admin', lastName: 'Tech', email: 'techadmin@example.com', username: 'techAdmin', password: 'Admin@123', mobile: 9089089013, role: 'Admin' },
];

const seedUsers = async () => {
    try {
        await UserModel.create(userData);
        console.log('User data seeded successfully');
    } catch (error) {
        console.error('Error seeding user data:', error);
    }
};

seedUsers();
