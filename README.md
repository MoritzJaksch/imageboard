# Imageboard

This is a single page application I created to learn vue.js. It allows you to upload, comment and like pictures and organize them by tags you give them during the uploading process.

## Built With

- [vue.js](https://vuejs.org/v2/api/) - the front-end framework used
- [express.js](http://expressjs.com/de/api.html) - the node.js framework used
- [AWS S3](https://docs.aws.amazon.com/s3/index.html#lang/en_us) - storage and hosting for images
- [PostgreSQL](https://www.postgresql.org/docs/9.4/index.html) - for database management

## Project Overview

#### <u>Uploader</u>

When you enter the page, the first thing you see is the title and the uploader interface. You can enter a name for the picture you are about to upload, as well as a short description, your username and a range of tags you would like to give your picture to make it easier to find for other users.



![header image](https://raw.github.com/moritzjaksch/imageboard/master/preview/preview1.gif) 



#### <u>Imageboard</u>

After scrolling down you will see the actual imageboard with all the previously uploaded pictures, their respective likes and a button to load more results. By clicking the heart symbol on the preview pictures, you can like your favourite pictures. The images are displayed in reverse chronological order.



![header image](https://raw.github.com/moritzjaksch/imageboard/master/preview/preview2.png)



#### <u>Image Modal</u>

After clicking on any picture, a modal will pop up and you can see a bigger version of the picture, the  description and what other users said about the picture. You can also leave a comment if you like or get to the next or previous picture by clicking the arrow buttons on the sides. 



![header image](https://raw.github.com/moritzjaksch/imageboard/master/preview/preview3.png)



#### <u>Image Tags</u>

By clicking on one of the descriptive tags below the comment section you can see all the other pictures with the same tags. This makes it easier to find images that are similiar to the one you are looking at. The preview of the current image will be replaced by a scrollable list of pictures that have been marked with the same tag. 



![header image](https://raw.github.com/moritzjaksch/imageboard/master/preview/preview4.png)



## Future Implementations

My ideas for the future of this project are the possibility to add a recipe for the food shown in the picture and to implement a log in, so that not everybody can upload and delete pictures as they like but to build a community of people who are interested in cooking and food photography. 