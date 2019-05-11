# INFO30005 2019S1 - CDJR Technologies

# Drawer

Drawer is a website for cultivating creativity. We provide a place for beginner and expert artists alike to compile, share and discuss their artwork. By doing so, we hope to create a platform that gives budding creatives both young and old the confidence and support to try and create new things. We believe that this will have far reaching societal benefits that go beyond the world of art.

## Usage

The easiest way to use drawer is to visit us at: [Drawer](https://drawer-by-cdjr.herokuapp.com)

Alternatively, make a pull request and run ‘node app’. Remember to install the node modules beforehand!

## Features

#### Sign up

- To use drawer, first sign up at [Register](https://drawer-by-cdjr.herokuapp.com/register)
- You can also view artwork without logging in, but the full experience requires an account.

#### Explore

- The explore page is a full gallery of user works
- You can click on any of the photos to view it more closely, and if you’re logged in, you can even give it a like!
- You can also search for photos by title, user, medium or even subject matter! Images uploaded to our platform are passed through the Google Cloud Vision API, which allows us to acquire accurate, automated tags for stored images.
- You can also sort images by popularity and upload date
- Visit the explore page at [Explore](https://drawer-by-cdjr.herokuapp.com/photo)

#### View Art

- If you’re logged in, every individual artwork uploaded to our platform is likeable and commentable
- This gives you the power to have in depth conversations with other users, allowing you to learn from and give feedback to them!
- You can check out a sample artwork page at [Show Page](https://drawer-by-cdjr.herokuapp.com/photo/5cc47500a6a81060a789d253)

#### Profile Page

- Every user on Drawer gets a profile page, which is open to the public to view.
- The profile page includes a brief self-description, and more importantly, a timeline of all of the user’s past artworks. This timeline is a core part of the drawer experience - we hope to highlight not only every artist’s best works, but also their journeys of progress and improvement.
- We hope that doing so will empower novice artists to see that they too can one day be great.
- Also accessible from the profile page is a secondary gallery of all works liked by a certain user.
- An example profile page can be found at [Profile](https://drawer-by-cdjr.herokuapp.com/profile/Jerome)

#### Upload Artworks

- The upload page allows users to upload new artwork from a local file or an existing web URL.
- Uploaded files are stored on firebase, and links are stored on MongoDB.
- Along with the file, users can add a description, title, and even choose the date of the post (since not all artworks are necessarily new - an important function of drawer is to also store old works).
- You can visit the upload page at [Upload](https://drawer-by-cdjr.herokuapp.com/photo/new), though you’ll need to be logged in to do so.

## Technologies

We're using:

- html/css and ejs for frontend
- MongoDB, Firebase for backend
- passport.js for authorisation
- moment.js for timestamps
- express
- nodejs
- Heroku for deployment

## What's next?

- Add APIs for sharing on social media
- Improved aesthetics site wide
- Integrate AJAX and thus combine certain webpages (eg. 'edit profile' and 'profile' can be the same page)

## Contributing

If you’re modifying someone else’s code, please push to your own branch first unless the modification was discussed previously on Slack or at a group meeting.

## License

[MIT](https://choosealicense.com/licenses/mit/)
