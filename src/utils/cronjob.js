const cron = require("node-cron")
const ConnectRequestModel = require("../models/connectionRequest")
const { subDays, startOfDay, endOfDay } = require("date-fns")
const sendEmail = require("../utils/sendEmail");

cron.schedule("0 8 * * *", async ()=> {
    //Send emails to all people who got requests the previous day
    try{
        const yesterday = subDays(new Date(),1);

        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequestsofYesterday = await ConnectRequestModel.find({
            status: "intrested",
            createdAt: {$gte: yesterdayStart, $lte:  yesterdayEnd }
        }).populate("fromUserId toUserId")

        if (!pendingRequestsofYesterday.length) {
      console.log("No pending requests found for yesterday.");
      return;
    }

        const listOfEmails = [...new Set(pendingRequestsofYesterday.map(req=> 
            req.toUserId.emailId
        ))]

        for(const email of listOfEmails){
           try{
            const emailRes = await sendEmail.run(
                 "You have a pending Friend Request for " + email, "There are so many friend request pending. Please login to your StackMate Account and accept or reject the requests."
               );
               console.log(emailRes)
           }
           catch(err){
            console.log("Error in sending cronjob email to ", email, err)
           }
        }

    }
    catch(err){
        console.log("Error in cronjob ", err)
    }
})