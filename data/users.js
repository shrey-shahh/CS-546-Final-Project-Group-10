const collections = require('../config/mongoCollections')
const users = collections.users
const bcrypt = require('bcrypt');
const saltRounds = 10;
let { ObjectId } = require('mongodb');

let exportMethods = {
    async createUser(fullname, contactno, address, email, education, resume, logo, password, roletype)
    {
        if(!fullname && !contactno && !address && !email && !password && !roletype)
        {
            throw 'all fields are required'
        }
        if(!fullname || typeof(fullname) !== 'string' || fullname.trim().length === 0)
        {
            throw 'Name must be valid string'
        }
        if(!contactno || typeof(contactno) !== 'string' || contactno.trim().length === 0)
        {
            throw 'Contact Number must be valid string'
        }
        let regex = /^\d{3}\-\d{3}\-\d{4}$/
        if(!regex.test(contactno))
        {
            throw 'Contact Number does not follow this format: xxx-xxx-xxxx, where x must be digit'
        }
        if(!address || typeof(address) !== 'string' || address.trim().length === 0)
        {
            throw 'Address must be valid string'
        }
        await validateEmail(email)
        email = email.toLowerCase()
        const userCollection = await users();
        const user = await userCollection.findOne({email});
        if(user)
        {
            throw 'there is already a user with that email'
        }
        /*
        if(!education || typeof(education) !== 'string' || education.trim().length === 0)
        {
            throw 'Please select Education'
        }
        if(roletype[0] == 'jobseeker')
        {
        if(!resume || typeof(resume) !== 'string' || resume.trim().length === 0 || !resume.endsWith(".pdf"))
        {
            throw 'Resume must be valid in .pdf format'
        }
    }
    if(!logo || typeof(logo) !== 'string' || logo.trim().length === 0)
    {
        throw 'Logo must be valid in .png or .jpg or .jpeg or .jfif format'
    }
    if(!(logo.toLowerCase().endsWith(".png") || logo.toLowerCase().endsWith(".jpg") || logo.toLowerCase().endsWith(".jpeg") || logo.toLowerCase().endsWith(".jfif")))
    {
        throw 'Logo must be valid in .png or .jpg or .jpeg or .jfif format'
    }
    */
        await validatePassword(password)     
        await bcrypt.hash(password, saltRounds,async function(err, hash) {
            password = hash
            let newUser = {
                fullname, contactno, address, email, education, resume, logo, password, roletype
            }   
            const insert = await userCollection.insertOne(newUser)
            if(insert.insertedCount === 0)
            {
                throw 'Sorry, could not add user !'
            }
        });
        return { userInserted:true }
    },
    async checkUser(email,password)
    {
        if(!email && !password)
        {
            throw 'all fields are required'
        }
        await validateEmail(email)
        email = email.toLowerCase()
        const userCollection = await users()
        const user = await userCollection.findOne({email})
        if(!user)
        {
            throw 'Either the email or password is invalid'
        }
        await validatePassword(password)
        let result= await bcrypt.compare(password,user.password);
        if(result)
        {
            return {authenticated:true,roletype:user.roletype, id:user._id}
        }
        else{
            throw 'Either the email or password is invalid'
        }
    },
    async updateUser(id, fullname, contactno, address, education)
    {
        let newUser = {
            fullname, contactno, address, education
        }
        const userCollection = await users();
        const update = await userCollection.updateOne({_id: new ObjectId(id)},{$set:newUser})
        if(update.modifiedCount === 0)
        {
            throw 'could not update user'
        }
        return { userUpdated:true }
    },
    async getAll(){
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        for(let itr of userList)
        {
            itr._id = itr._id.toString()
            itr.password = "********";
        }
        return userList;
    },
    async get(id){
        const userCollection = await users();
        const user = await userCollection.findOne({_id:new ObjectId(id)});
        if(!user)
        {
            throw 'no user exists with that id'
        }
        user._id = user._id.toString()
        user.password = "********";
        return user;
    },
    async getuserbyemail(id){
        id=id.toLowerCase();
        const userCollection = await users();
        const user = await userCollection.findOne({email:id});
        if(!user)
        {
            throw 'no user exists with that id'
        }
        user._id = user._id.toString()
        user.password = "********";
        return user;
    },
    async changePassword(email,password){
        //await validateEmail(email)
        //email = email.toLowerCase()
        await validatePassword(password)     
        await bcrypt.hash(password, saltRounds,async function(err, hash) {
            password = hash
            let newPassword = {
                password
            }   
            console.log(newPassword);
            const userCollection = await users();
            const update = await userCollection.updateOne({email},{$set:newPassword})
            if(update.modifiedCount === 0)
            {
                throw 'could not update user'
            }
            return { userUpdated:true }
        });
    }
}
module.exports = exportMethods;
async function validateEmail(email)
{
    if(!email || email.trim().length === 0)
    {
        throw 'email must contain valid value'
    }
    if(!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
    {
        throw 'email must match pattern *@*.*'
    }    
}
async function validatePassword(password)
{
    if(!password || password.trim().length === 0)
    {
        throw 'password must contain valid value'
    }
    if(password.length < 6)
    {
        throw 'password should be at least 6 character long'
    }    
}
/*
async function validateId(id){
    if(!id)
    {
        throw 'no id is provided'
    }
    if(typeof id !== 'string' || id.trim().length === 0)
    {
        throw 'id provided is not a valid string'
    }
    if(!ObjectId.isValid(id))
    {
        throw 'id provided is not valid objectId';
    }
}
*/