cd ..

REM set MONGOLAB_URI=mongodb://heroku_app10154408:jplikbbbd18odjtt96j3edek0k@ds045757.mongolab.com:45757/heroku_app10154408
set MONGOLAB_URI=mongodb://localhost/yt-elec-2013
set PORT=80
set ADMIN_PASSWORD=admin
set CLOUDINARY_URL=cloudinary://369171911744957:OfBLFSLXKj7jdWtmKlo2CH7I60o@hkf5hrwto

node --debug app
pause