# CS-546-Final-Project-Group-10

Hey everyone! We are group 10 and our idea for the final project is to build an online job portal. It is a simple web application wherein companies update if there any job vacancies on the website and the end user, that is the candidate in our case, can look for those vacancies once they register onto our website.

To run the application:
  1) Open CMD inside the folder and run the command- npm i (this will install all the modules we use in the application).
  2) Once the all the modules have been installed, run the command- npm start (this will start the server, and populate the database at the same time.)

*NOTE: While running the seed file we could only populate the database with candidates and companies since we're 4 different collections (users, applications, jobs, feedbacks) and we could not reference the company ID to the application ID because both the createUser() and createJob() were using async & await. So upon running the NPM START command the database will only be populated with 3 candidates and 1 company.


*Login details for candidates that were created using the seed file:

  *Email: shreyshah@gmail.com
   Password: 12345678
  
  *Email: bhavyashah@gmail.com
   Password: 12345678

*Login details for company that was created using the seed file:
  *Email: jpmorgan@gmail.com
   Password: 12345678

*NOTE: When you attempt to change the password you must enter atleast 6 characters or else you will be redirected to the main page and the password will not change.

*NOTE: In windows 11 we faced an unusual error with the database connection so to resolve that we made some in changes in the settings.json file in CONFIG folder. If you face a similar issue, change the "serverUrl" to "localhost:3000" in the settings.json file.
