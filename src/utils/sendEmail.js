const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient"); // ✅ match exported name

// Function to create a SendEmailCommand
const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
  });
};

// Function to send email
const run = async (subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    "ankur.baijal11@gmail.com",
    "ankur@stackmate.life",
    subject,
    body
  );

  try {
    const response = await sesClient.send(sendEmailCommand);
    console.log("✅ Email sent successfully:", response);
    return response;
  } catch (caught) {
    if (caught.name === "MessageRejected") {
      console.error("❌ Message rejected:", caught.message);
      return caught;
    }
    console.error("❌ Error sending email:", caught);
    throw caught;
  }
};

module.exports = { run };
