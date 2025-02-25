require('dotenv').config();
const mongoose = require('mongoose');

const password = process.argv[2];
const name = process.argv[3];
const phone = process.argv[4];

if (!password) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

// 使用环境变量中的 MONGO_URI
const url =
  `mongodb+srv://fullstack:${password}@fullstack.whasr.mongodb.net/noteApp?retryWrites=true&w=majority&appName=fullstack`


  mongoose.connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Connection error:", err));


const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const Person = mongoose.model('Person', personSchema);

// 添加新联系人
if (name && phone) {
  const person = new Person({ name, phone });

  person.save().then(() => {
    console.log(`added ${name} number ${phone} to phonebook`);
    mongoose.connection.close();
  });
// 列出所有联系人
} else {
  Person.find({}).then((persons) => {
    console.log('phonebook:');
    persons.forEach((person) => {
      console.log(`${person.name} ${person.phone}`);
    });
    mongoose.connection.close();
  });
}
