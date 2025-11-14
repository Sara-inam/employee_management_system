import fs from 'fs';
import { faker } from '@faker-js/faker';
import logger from './src/config/logger.js';

const users = [];

for (let i = 0; i < 1000; i++) {
  users.push({
   name: faker.person.firstName() + " " + faker.person.lastName(),  
    email: faker.internet.email(),
    password: faker.internet.password(8), // random password
    role: "employee",
    profileImage: faker.image.avatar(),
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
  });
}

fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
logger.info('1000 test users generated in users.json');
