const express = require("express")
const compression = require ('compression')
const helmet = require ('helmet')
const morgan = require('morgan')
const app = express()
const PORT = 2430
app.use(express.json())
const cors = require('cors')
const fileUploader = require('express-fileupload')
const db = require('./config/db')
const router = require('./routers/userRouter')
const depositRouter = require('./routers/depositRouter')
const investmentRouter = require('./routers/investmestRouter')
const kycVerification = require('./routers/kycRouter')
const Ticket = require('./routers/ticketRouter')
const twoFactorAuthRoutes = require('./routers/2faRouter');
const axios = require('axios')
const cron = require('node-cron')


// // Cron job to ping the website every 5 minutes and send an email
// cron.schedule('*/5 * * * *', async () => {
//     try {
//         await axios.get('https://assetMogul.onrender.com');
//         console.log('Pinged website to keep it awake');

//         // // Prepare and send the wake-up email
//         // const subject = "Wake up website";
//         // const html = wakeUpMail();
//         // const regEmailData = {
//         //     email: process.env.WAKE_UP_EMAIL, // Use the environment variable
//         //     subject,
//         //     html
//         // };
//         // await sendEmail(regEmailData);
//     } catch (error) {
//         console.error('Error in cron job:', error.message);
//     }
//C:\Program Files\heroku\
//123456Jeremy##
// });

// cron.schedule('0 * * * *', async () => {
//     try {
//         await axios.get('https://assetMogul.onrender.com');
//         console.log('Pinged website to keep it awake');
//     } catch (error) {
//         console.error('Error in cron job:', error.message);

//         // // Prepare and send the wake-up email only if there's an error
//         // const subject = "Wake up website";
//         // const html = wakeUpMail();
//         // const regEmailData = {
//         //     email: process.env.WAKE_UP_EMAIL, // Use the environment variable
//         //     subject,
//         //     html
//         // };
//         // await sendEmail(regEmailData);
//     }
// });

// // Cron job to ping the website three times a day (at 8 AM, 12 PM, and 4 PM)
// cron.schedule('0 8,12,16 * * *', async () => {
//     try {
//         await axios.get('https://asset-mogul-back.onrender.com');
//         console.log('Pinged website to keep it awake');

//         // Optionally, send the wake-up email
//         // const subject = "Wake up website";
//         // const html = wakeUpMail();
//         // const regEmailData = {
//         //     email: process.env.WAKE_UP_EMAIL, // Use the environment variable
//         //     subject,
//         //     html
//         // };
//         // await sendEmail(regEmailData);
//     } catch (error) {
//         console.error('Error in cron job:', error.message);
//     }
// });



// Cron job to ping the website every 10 minutes
cron.schedule('*/10 * * * *', async () => {
    try {
        // Send a GET request to the website
        await axios.get('https://coinbasebackend.onrender.com');
        console.log('Pinged website to keep it awake');
        
        // Optional: Send a wake-up email if needed
        // const subject = "Wake up website";
        // const html = wakeUpMail(); // Assuming wakeUpMail() generates your email template
        // const regEmailData = {
        //     email: process.env.WAKE_UP_EMAIL, // Use the environment variable
        //     subject,
        //     html
        // };
        // await sendEmail(regEmailData);
    } catch (error) {
        console.error('Error in cron job:', error.message);
    }
});









app.use(compression()); // Enable gzip compression
app.use(morgan('combined')); // Enable request logging
app.use(helmet()); // Set various HTTP headers for security
app.use(cors({origin:"*"}));
app.use(fileUploader({
    useTempFiles: true,
}))
app.use(router)
app.use(depositRouter)
app.use(investmentRouter)
app.use(kycVerification)
app.use(Ticket)

app.use('/', twoFactorAuthRoutes);



app.listen(PORT, ()=>{
    console.log(`app is listening to ${PORT}`)
})
