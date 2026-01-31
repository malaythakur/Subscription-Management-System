// Import dayjs library for date parsing, manipulation, and comparison
import dayjs from 'dayjs';

// Import createRequire to allow usage of CommonJS modules inside ES Modules
import {createRequire} from 'module';

// Create a CommonJS require function inside an ES module file
const require = createRequire(import.meta.url)

// Import serve function from Upstash Workflow (CommonJS module)
const {serve} = require('@upstash/workflow/express');

// Import Subscription Mongoose model to interact with subscriptions collection
import Subscription from '../models/subscription.model.js';

// Define how many days before renewal reminders should be sent
const REMINDERS = [7,5,2,1];

// Export a workflow handler that sends subscription renewal reminders
export const sendReminders = serve(async(context)=>{

    // Extract subscriptionId from workflow request payload
    const { subscriptionId } = context.requestPayload;

    // Fetch subscription details from database using workflow-safe execution
    const subscription = await fetchSubscription(context, subscriptionId);

    // Exit workflow if subscription does not exist or is not active
    if (!subscription || subscription.status !== 'active') return;

    // Convert renewal date into a dayjs object for date calculations
    const renewalDate = dayjs(subscription.renewalDate);

    // Check if the renewal date has already passed
    if(renewalDate.isBefore(dayjs())){

        // Log that the workflow will stop because renewal date is in the past
        console.log(`Renewal data has passed for subscription ${subscriptionId}. Stiopping workflow.`);
        return; 
    }

     // Loop through each reminder interval (days before renewal)
    for (const daysBefore of REMINDERS){

        // Calculate reminder date by subtracting days from renewal date
         const reminderDate = renewalDate.subtract(daysBefore, 'day'); 
         // renewal date = 22feb , reminder date = 15 feb, 17, 20, 21

        // If reminder date is still in the future, pause workflow until that date
         if(reminderDate.isAfter(dayjs())){
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
         }

        // Trigger the reminder action (email/SMS/push notification)
         await triggerReminder(context, `Reminder ${daysBefore} days before`);
    }
});

// Fetch subscription data safely inside workflow execution
const fetchSubscription = async(context, subscriptionId) => {

    // Run database operation as a tracked workflow step
    return await context.run('get subscription', async() => {

        // Replace user ObjectId with corresponding user document containing name and email
        return Subscription.findById(subscriptionId).populate('user','name email');
    })
}
// Pause workflow execution until a specific reminder date
const sleepUntilReminder = async(context, label, date)=> {
      // Log when the workflow is sleeping until the reminder time
    console.log(`Sleeping until ${label} reminder at ${date}`);

    // Suspend workflow until the provided date
    await context.sleepUntil(label, date.toDate());
}

// Trigger the reminder action inside a workflow-safe execution step
const triggerReminder = async (context, label) => {

    // Execute reminder logic as a tracked workflow step
    return await context.run(label, ()=> {
        // Log reminder trigger
        console.log(`Triggering ${label} reminder`);
        // Send Email, SMS, push notification...
    })
}