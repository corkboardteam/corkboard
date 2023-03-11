# Corkboard

## Descriptions
Corkboard is a webapp that helps users manage their communal fridge space. Users can
update their fridge's contents, plan grocery trips, and start discussions about different grocery items

## Key Features

1. Users can signup, login, and join room groups by starting a new group or searching for an existing one
2. Protected pages that can only be accessed by a user that is logged in
3. Add grocery items into their room group's fridge and obtain estimated prices queried from an external API
4. Plan grocery trips that are visible to the entire group
5. Automatically update communal fridge when a grocery trip is completed
6. See other users with grocery trips scheduled on the same day on their personal grocery list page 
7. Discussion board for all users with commenting, upvoting, and downvoting features

## Clone the repository
    git clone https://github.com/corkboardteam/corkboard.git
    cd corkboard

## Setting up node modules
    npm install

## Setting up database and API keys
Create a .env.local file in the **root directory** (corkboard/.env.local).

Add your own firebase keys, which can be created by 
1. Logging into your [firebase console](https://console.firebase.google.com/) and click **Add Project**
2. In the [firebase console](https://console.firebase.google.com/), click **Authentication** from the navigation panel and enable **email/password** and **google authentication** in the **sign-in method** tab
3. In your [firebase console](https://console.firebase.google.com/), click **Add app** and select **web app**
4. After you register an app, you should see a code block with your **firebaseConfig**
5. In your .env.local file, add the following lines, replacing placeholders with what's in your firebaseConfig

        REACT_APP_FIREBASE_APIKEY="your_api_key"
        REACT_APP_FIREBASE_AUTHDOMAIN="your_auth_domain"
        REACT_APP_FIREBASE_PROJECTID="your_project_id"
        REACT_APP_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
        REACT_APP_FIREBASE_APPID="your_app_id"
        REACT_APP_FIREBASE_MEASUREMENTID="your_measurement_id"

Add your Spoonacular API keys. (Spoonacular is used to get the estimated cost of grocery items)
1. Sign up [here](https://spoonacular.com/food-api/console#Dashboard) for a spoonacular account
2. Once you're logged in, navigate to your [profile](https://spoonacular.com/food-api/console#Profile)
3. Click **Show/Hide API Key** 
4. Append the line

        REACT_APP_SPOONACULAR_API_KEY="your_spoonacular_key" 

    to your .env.local file


## Running the application 
    npm start

This runs the app at [http://localhost:3000](http://localhost:3000). You can now use our app in your favorite browser!

