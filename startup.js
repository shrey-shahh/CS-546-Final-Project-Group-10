const users = require('./data/users');


async function runSetup() {
    const jobseeker1 = await users.createUser('Bhavya Shah', '201-296-5604', 'Mumbai', 'bhavyashah@gmail.com', 'HSC', 'Review.pdf', '', '12345678', 'jobseeker');
    const jobseeker2 = await users.createUser('Shrey Shah', '201-296-5605', 'Hoboken', 'shreyshah@gmail.com', 'Graduate', 'Review.pdf', '', '12345678', 'jobseeker');
    const jobseeker3 = await users.createUser('Vatsal Shah', '201-296-5607', 'Mumbai', 'vatsalshah@gmail.com', 'PHD', 'Review.pdf', '', '12345678', 'jobseeker');

    const company1 = await users.createUser('JP Morgan', '201-296-5607', 'Mumbai', 'jpmorgan@gmail.com', '', '', 'home.png', '12345678', 'company');
    
}

exports = module.exports = { runSetup };
