import dotenv from "dotenv";
dotenv.config();

class Config {
  constructor() {
    this.PORT = process.env.PORT ;
    this.MONGO_URI = process.env.MONGO_URI ;
    this.JWT_SECRET = process.env.JWT_SECRET ;
    this.EXPIRE_IN = process.env.EXPIRE_IN;
    this.EMAIL_SERVICE = process.env.EMAIL_SERVICE;
    this.EMAIL_USER = process.env.EMAIL_USER;
    this.EMAIL_PASS = process.env.EMAIL_PASS;
    this.FRONTEND_URL = process.env.FRONTEND_URL;
<<<<<<< HEAD
    this.NODE_ENV = process.env.NODE_ENV;
=======
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
    // this.NODE_ENV = process.env.NODE_ENV ;
  }
}

// ❄️ Freeze object to prevent modifications
const config = Object.freeze(new Config());

export default config;
