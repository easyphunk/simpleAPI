# simpleAPI
A RESTful API for MongoDB with user authentication and general security features

---

## Built with
- [express](https://www.npmjs.com/package/express)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [ndb](https://www.npmjs.com/package/ndb)

#

## Installation
1. Clone the repo

        git clone https://github.com/your_username_/Project-Name.git

2. Install NPM packages

        npm install

3. Create an account in mailtrap.io if you want easily test the email password reset functionality. 
   From your profile get these settings:
   
   ![image info](https://res.cloudinary.com/dghpuejpt/image/upload/v1599932884/simpleAPI/1_duehml.png)

4. Create a **config.env** file in root dir and add these env variables:

        NODE_ENV=development
        PORT='port number to run the server on'
        DATABASE='mongoDB db url with <PASSWORD> as a placeholder for the password string'
        DB_PASS='mongoDB db password'

        JWT_SECRET='jwt key'
        JWT_EXPIRATION='expiration time for the jwt token'
        JWT_COOKIE_EXPIRES_IN='cookie expiration time in days'
        
        <!-- If you use mailtrap, copy/paste your SMTP settings below (screenshot in 3.). If you use a different email server - enter your custom details as values-->
        EMAIL_USERNAME='email username'
        EMAIL_PASSWORD='email password'
        EMAIL_HOST='email host'
        EMAIL_PORT='email port'

    **config.env** example:

        NODE_ENV=development
        PORT=9999
        DATABASE=mongodb+srv://some-username:<PASSWORD>@cluster0.n010101.mongodb.net/my-database?retryWrites=true&w=majority
        DB_PASS=my-password
        
        JWT_SECRET=my-secret-key
        JWT_EXPIRATION=90d
        JWT_COOKIE_EXPIRES_IN=90

        EMAIL_USERNAME=f0f0f0f0f0f01
        EMAIL_PASSWORD=606060606060
        EMAIL_HOST=smtp.mailtrap.io
        EMAIL_PORT=25
#

## Running the app

- To start the app in development mode:

        npm start

- To start the app in productin mode:
  
        npm run start:prod

- To start the app in debug mode:

        npm run debug

---


## Author Info

- LinkedIn - [Svetoslav Popov](https://www.linkedin.com/in/s-popov/)
---