const nodemailer = require("nodemailer");
const EventEmitter = require("events");
const fs = require("fs");

const eventEmitter = new EventEmitter();
eventEmitter.on("temperatureData", (date, temperature) => {
  const data = { date, temperature };
  fs.writeFile("data.json", JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log("Data saved to file.");
  });
});
eventEmitter.on("averageTemperature", (date) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) throw err;

    const parsedData = JSON.parse(data);
    const temperatures = parsedData
      .filter((entry) => entry.date === date)
      .map((entry) => entry.temperature);
    const average =
      temperatures.reduce((total, temp) => total + temp, 0) /
      temperatures.length;

    console.log(`Average temperature for ${date} is ${average}.`);
  });
});
eventEmitter.on("temperatureData", (date, temperature) => {
  if (temperature > 30) {
    eventEmitter.emit("highTemperature", date, temperature);
  }

  // save data to file
});

eventEmitter.on("highTemperature", (date, temperature) => {
  console.log(
    `High temperature alert! On ${date}, temperature was ${temperature}`
  );
});

// ***Tasks with an asterisk***
eventEmitter.on("averageTemperature", (date) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) throw err;

    const parsedData = JSON.parse(data);
    const temperatures = parsedData
      .filter((entry) => entry.date === date)
      .map((entry) => entry.temperature);
    const average =
      temperatures.reduce((total, temp) => total + temp, 0) /
      temperatures.length;

    console.log(`Average temperature for ${date} is ${average}.`);

    // send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: "panivnykmisha@gmail.com",
      subject: `Average temperature for ${date}`,
      text: `The average temperature for ${date} is ${average}.`,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) throw err;
      console.log("Email sent: " + info.response);
    });
  });
});
