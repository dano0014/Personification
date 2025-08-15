Setup & Running:
Download Node.js (https://nodejs.org/en/download)

In the terminal, cd into the main project folder and run these 3 commands:<br />
npm init -y<br />
npm install express<br />
node server.js 

Then, click the link in the terminal (https://localhost:3000) to run the program in the browser.

Instructions:
To log in, you could either create an account using the "Create Account" button at the bottom of the sign in page or use the example adult and child accounts:<br />
(Adult) Email: jane@example.com, Password: password<br />
(Child) Email: ethan@example.com, Password: childpass1<br />
**Some pages are not visible to adults/children so be mindful which you are using**

If you would like to sign in again, click the Personification logo on any page.

## Frontend Overview ##
----------------------
1. The program opens to index.html, this is the default sign in page for parents and children. This file uses the general styles.css to look correct and its own signin.js to run. If the user has an account they go on to their dashboard (4), if they don't they can create an account at the bottom and go on to the registration page (2). The user can also view the TOS and Privacy Policy (not created yet).

2. The user (which would always be a parent) is directed to register.html to create an account. They input their name, email, password, and then confirm it. They can sign up, but are also given an option to view the TOS and Privacy Policy again. This file uses the general styles.css to look correct and its own register.js to run. This account is saved to the sessionStorage to use for the next steps in registration. Once they sign up, they are directed to the verification page (3).

3. In selfie.html, the user is given the option at the top of uploading a picture of either their birth certificate, Passport, or their ID/Drivers License. After that, they grant the website access to their camera and take a selfie. After taking it, the photo is shown below and they can take it again or confirm and go on to the next page. This page uses the general styles.css as well as its own selfie.css to look correct, and it uses its own selfie.js to function properly. After confirming, the user is sent to their dashboard (4).

4. The adult dashboard runs using dashboard.html. This page is for parents to be able to view their children's accounts and manage their access requests. The parent can add children (6), they can view their child's dashboard (5), and they can manage the trust level of the child (9). At the bottom, the parent can also approve/deny requests children make to access new apps or websites. This page uses styles.css and dashboard.css to look correct, as well as dashboard.js to function.

5. The child dashboard runs using child-dashboard.html. This page is for children to be able to view their Learning Journey. The Learning Journey is made up of playlists of videos for children to watch to educate and onboard them to the internet. Parents can choose which playlists to assign to their children. The children can click the "My Learning Journey" button in order to view these assigned playlists (11). Below that, the child can view the apps their parents have currently given them access to. They can click the "Request New App" button if they want access to a new app, and they will be redirected to the app request page (12). Then they can see their progress on their Learning Journey at a glance, as well as their Trust Level. This page uses just child-dashboard.js to function, but also styles.css, dashboard.css, child-dashboard.css, and apps-websites.css to look correct.

6. The parent can add children by clicking the empty card on their dashboard titled "Add Child", this will direct them to add-child.html. The parent adds the child's first and last name, their age and date of birth. After confirming that, they are directed to a similar looking verification page (7) but this time for the child. This page uses styles.css to look correct and add-child.js to function properly.

7. This page (child-selfie.html) is very similar to 3 (selfie.html), but instead it saves the data to a child object that exists in the children array within each user account. It also has some slight wording changes. This page uses styles.css and selfie.css to look correct, as well as child-selfie.js to function. Once that is completed, the parent is directed to a new page where they can approve and deny common social media apps and games for their child (8).

8. child-apps-websites.html is a page where parents are presented with common apps and websites. If they approve, the buttons disappear and the app name and icon stay. However if they disapprove, the entire card disappears. This page uses styles.css and child-apps-websites to look correct, as well as apps-websites.js to function. After a decision is made on all the apps, the parent can click next and is presented with a Manage Trust page (9).

9. The "Manage" button on each child card, when clicked, directs parents to a page (manage-trust.html) where they are given information on the current trust level of the child, as well as the other options. The parent can choose to change the child's Trust Level or return to their dashboard. This page uses styles.css and manage-trust.js to work. This step then saves the presentChild in sessionStorage to the parent user's children array.

10. When the parent is viewing the child dashboard, and clicks the "My Learning Journey" button, they are directed to a page where they can add new playlists with some example ones shown (parent-learning-view.html). They can filter by the main tags (Safety, Privacy, Citizenship, Wellbeing) and see which Trust Level each one is recommended for. This page uses styles.css and parent-learning.css to look correct, and also parent-learning-view.js to function.

11. When the child is viewing their own dashboard, and clicks the "My Learning Journey" button, they are directed to a page where they can see the playlists their parents have added for them to watch (learning-journey.html). This page uses styles.css and learning.css to look correct, and learning.js to work. 

12. The app request button in the child dashboard is for children to be able to ask their parents for custom access beyond just what the Trust Levels allow for (request-app.html). The child enters the app name, answers a multiple choice question as to why they want to use the app, fill out a safety checklist, and clicks the button to ask their parent to review it. These requests then show up in the parent's dashboard to be approved or denied. This page uses styles.css and request-app.css to look correct, as well as request-app.js to function.

## Data ##
1. apps.json - All the apps that parents are given options to choose from and children can request about.
  Structure:
    name: string,
    icon: png (comes from elements folder)

2. playlists.json - All the playlists that parents can add to their child's Learning Journey.
  Structure:
    id: string,
    title: string,
    creator: string,
    tag: string,
    recommendedTrustLevel: int,
    videos: array of mp4s

3. trust-levels.json - Information on all the Trust Levels
  Structure:
    id: int (1-3),
    name: string,
    title: string,
    description: string

4. users.json - User data
  Structure:
    name: string,
    email: string,
    password: string,
    role: string ("Parent" || "Child"),
    selfie: png (comes from selfies folder),
    identification: {
      birthCertificate: png,
      passport: png,
      idCard: png
    },
    children: [
      {
        id: int,
        name: string,
        email: string,
        password: string,
        role: string ("Child"),
        selfie: png (comes from selfies folder),
        identification: {
          birthCertificate: png
          passport: png
          idCard: png
        },
        trustLevel: int (1-3),
        allowedApps: string[],
        playlistIds: string[]
      }
    ]
