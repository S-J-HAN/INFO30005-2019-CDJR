# INFO30005 - Webproj
## By CDJR Technology

# Drawer

Drawer is a website for cultivating creativity. We provide a place for amateur and professional artists alike to compile, share and discuss their artwork. By doing so, we hope to create a platform that gives all budding creatives, young and old, the confidence and support to try and create new things. We believe that this will have far reaching societal benefits that go beyond the world of art.

## Usage

The easiest way to use drawer is to visit us at:
https://drawer-by-cdjr.herokuapp.com

Alternatively, make a pull request and run ‘node app’. Remember to install the node modules beforehand!

## Features

To use drawer, first sign up at https://drawer-by-cdjr.herokuapp.com/register. You can also view artwork without logging in, but the full experience requires an account.

The explore page is a full gallery of user works. You can click on any of the photos to view it more closely, and if you’re logged in, you can even give it a like! In the near future we’ll also be adding the ability to sort and refine the images that you see here. Visit the explore page at https://drawer-by-cdjr.herokuapp.com/photo.

If you’re logged in, every individual artwork uploaded to our platform is likeable and commendable. This gives you the power to have in depth conversations with other users, allowing you to learn from and give feedback to them! In the future, we’re also planning on adding the ability to share artworks on social media using Facebook and Twitter APIs. You can check out a sample artwork page at https://drawer-by-cdjr.herokuapp.com/photo/5cc47500a6a81060a789d253.

Every user on Drawer gets a profile page, which is open to the public to view. The profile page includes a brief self-description, and more importantly, a timeline of all of the user’s past artworks. This timeline is a core part of the drawer experience - we hope to highlight not only every artist’s best works, but also their journeys of progress and improvement. We hope that doing so will empower novice artists to see that they too can one day be great. Also accessible from the profile page is a secondary gallery of all works liked by a certain user. An example profile page can be found at https://drawer-by-cdjr.herokuapp.com/profile/Jerome.

The upload page allows users to upload new artwork from a local file or an existing web URL. Uploaded files are stored on firebase, and links are stored on MongoDB. Along with the file, users can add a description, title, and even choose the date of the post (since not all artworks are necessarily new - an important function of drawer is to also store old works). In the near future, we’re also planning on including the ability to give a new artwork a tag. You can visit the upload page at https://drawer-by-cdjr.herokuapp.com/photo/new, though you’ll need to be logged in to do so.

## Contributing
If you’re modifying someone else’s code, please push to your own branch first unless the modification was discussed previously.

## License
[MIT](https://choosealicense.com/licenses/mit/)
