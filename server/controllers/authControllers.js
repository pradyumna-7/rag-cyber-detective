const puppeteer = require('puppeteer');
const fs = require('fs');
const User = require('../models/users');
const Scrape = require('../models/scrape');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const axios = require('axios');
const { spawn } = require('child_process');


let count = 0;
const registerUser = async (req, res) => {
    try {
        const {name, email, password, phone} = req.body;

        //Check if password meets the requirements
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[^a-zA-Z\d]/.test(password);
        const isLongEnough = password.length >= 6;

        if (!hasUpper) {
            return res.json({ error: 'Password must contain at least one uppercase letter' });
        }
        if (!hasLower) {
            return res.json({ error: 'Password must contain at least one lowercase letter' });
        }
        if (!hasNumber) {
            return res.json({ error: 'Password must contain at least one number' });
        }
        if (!hasSpecial) {
            return res.json({ error: 'Password must contain at least one special character' });
        }
        if (!isLongEnough) {
            return res.json({ error: 'Password must be at least 6 characters long' });
        }
        const regex = /\b\d{10}\b/;
        if(!regex.test(phone)) {
            return res.json({ error: 'Please enter valid phone number'});
        }


        //Check if email entered
        const exist = await User.findOne({email});
        if(exist){
            return res.json({
                error: 'Email already exist'
            })
        };
        // const hashedPassword = await hashPassword(password);
        const user = await User.create({
            name,
            email,
            password: password,
            phone
        })
            

        const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL,
            pass: process.env.MAIL_PASS,
        }
        });

        const mailOptions = {
        from:{
            name: 'UDAAN RAG CYBER DETECTIVE',
            address: process.env.MAIL
        },
        to: email,
        subject: 'Verification of Email for VR-LLM',
        text: `Please click the link below to verify your email address:\nhttp://localhost:5173/verify/${user._id}`
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });

        return res.json(User)
    } catch (error) {
        console.log(error);}
}

const verified = async (req, res) => {
    const id  = req.params.id;
    const user  = await User.findByIdAndUpdate({_id:id}, {verified: true})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
}
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body; 
        const user = await User.findOne({email});

        if(!user){
            return res.json({
                error: 'User does not exist'
            })
        }

        const isVerified = user.verified;
        if(!isVerified){
            return res.json({
                error: 'Please verify your email'
            })
        }

        if(password !== user.password){
            return res.json({
                error: 'Incorrect password'
            })
        }
        else{
            return res.json(User)
        }
    }
    catch (error) {
        console.log(error)}
}

const scrapeWebsite = async (req, res) => {
    const { url } = req.body;
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    });

    try {
        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 0,
        });

        const pageText = await page.evaluate(() => {
            const unwantedSelectors = ['header', 'footer', 'nav', '.navbar', '.footer', '.contact', '.about', '.newsletter'];
            unwantedSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => el.remove());
            });
            return document.body.innerText.trim();
        });

        if (pageText) {
            const tags = await getTags(pageText); // Wait for the tags to be returned
            await page.close();
            await browser.close();
            console.log(tags);
            const scrape = new Scrape({
                url,
                scrapedText: pageText,
                tags
            });

            await scrape.save();

            return res.json({
                success: 'Website scraped successfully',
                tags,
            });
        } else {
            await page.close();
            await browser.close();
            return res.json({
                error: 'No text content found on the website',
            });
        }

    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        await browser.close();
        return res.json({
            error: 'Error scraping website',
        });
    }
};

async function getTags(input) {
    try {
        const response = await axios.post('http://python-service:5000/get-tags', {
            input: input
        });
        return response.data;  // Return the tags received from Flask
    } catch (error) {
        console.error('Error calling Flask API:', error);
        throw error;  // Re-throw the error to handle it in the calling function
    }
}  
module.exports = { scrapeWebsite, registerUser, loginUser, verified };
