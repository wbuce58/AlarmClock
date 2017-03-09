# OpenToolchainAlarmClock
In this lab, you'll create a simple toolchain that will enable to you iteratively deploy an alarm clock application to Bluemix.
You will:
- [Setup a toolchain](README.md#setting-up-your-development-toolchain)
- [Review the automated deploy](README.md#uh-oh)
- [Update the starter code](README.md#lets-fix-it)
- [Interact with the application](README.md#running-code)
- [Add an alarm](README.md#set-an-alarm)
- [Remove an alarm](README.md#disable-an-alarm)

## Getting Started
Before getting started, you'll require a valid ID for Bluemix, GitHub.com and, optionally, IFTTT. Don't worry you can try them all for free!  If you don't have an existing ID, sign up for one by following the steps below:

### IBM Bluemix Account
1. Navigate to https://console.ng.bluemix.net/registration/ and sign up
1. As part of the Bluemix registration process, you will receive an email asking you to confirm your account.  If you do not confirm, you are not registered.  If you do not receive a confirmation email, send a note to [id@bluemix.net](mailto:id@bluemix.net).

### GitHub.com
1. Navigate to https://github.com, review the [terms of service](https://help.github.com/articles/github-terms-of-service/), and, if you agree with the terms, create an account.
Note: You will not be able to complete the lab as described without a GitHub account.

### IFTTT
1. Navigate to https://ifttt.com, review the [terms of service](https://ifttt.com/terms), and, if you agree with the terms, create an account.
Note: You can still continue with the lab, if you do not create an IFTTT account.

#### Configuring IFTTT
IFTTT allows you to create an applet which will complete an action based on a trigger. To configure IFTTT to send a notification, such as an email or text message:
1. Navigate to https://ifttt.com and choose My Applets from the navigation bar.
1. In the My Applets page, click **New Applet**.
1. In the statement `if +this then that`, click **+this**.
1. In the services selection page, enter `maker`, and select the Maker service. Maker can be used to receive a web request which will trigger an action.
1. Select the trigger `Receive a web request`.
1. Choose an event name, note the name down for later use, and click **Create trigger**.
1. The statement now reads `if maker then +that`, click **+that**.
1. In the services selection page, you will select the notification method when the alarm is activated. For example, to receive an email, select the Email service. Alternatively, to receive a text message, choose the SMS service.
1. Depending on the service select, apply the action.
1. Complete the action fields. You can choose to update the notification subject and body, or leave them as is. Click **Create action**.
1. Review the applet and click **Finish**.

#### Finding your IFTTT Maker key
1. Navigate to https://ifttt.com and choose Search from the navigation bar.
1. In the Search page, enter `maker` to filter for the Maker service. Click on the Maker service.
1. In the top right, click **Settings**.
1. Copy and navigate to the URL location.
1. The key is displayed.


## Setting up your development toolchain
To make things a bit easier, you will use the starter code available in this GitHub repository. You'll create a toolchain with a copy of the code, a pipeline to build/deploy the code and even an editor to tinker with the code. Sounds like a lot of work? Not really. With just a few clicks, you'll be all setup.

1. Begin by logging into [Bluemix](https://console.ng.bluemix.net). Your view may differ, if you have existing applications.
1. From the hamburger menu near the top left of the screen click **Services** and then click **DevOps**.

  ![Hamburger Menu](assets/README-cb995.png)

  ![DevOps Services](assets/README-f0736.png)
1. The view will be slightly different depending on if you have any existing toolchains, but in either case click on **Create a toolchain** to continue.
1. Click on the **Simple Cloud Foundry toolchain** template. This template is a great way to get started when developing a simple Cloud Foundry app.

  ![Toolchain Templates](assets/README-3ca22.png)
1. This template will create a toolchain with:
  - GitHub: Code repository and issue tracker.
  - Delivery Pipeline: Continuous build, test and deployment engine.
  - Eclipse Orion Web IDE: Code editor.
  - Bluemix: Deployment target.

  ![Simple Cloud Foundry Template Overview](assets/README-143d9.png)
1. Change the name of the toolchain to something more meaningful, like **AlarmClock**. Note: this name must be unique, so if you get a naming conflict, simply pick a new name.

  ![Toolchain name](assets/README-26115.png)
1. When setting up GitHub you want to leverage the provided starter code.  
  1. Click on the GitHub icon and change the Source repository URL to: https://github.com/melickm/OpenToolchainAlarmClock

    ![](assets/README-84dbe.png)
  - **Note:** If you haven't Authorized with Github.com, click the **Authorize** button and follow the instructions to authorize your Bluemix account to access your GitHub account.

    ![Authorize GitHub](assets/README-da7b2.png)
1. Click **Create**. This is where the magic happens :)
  - The toolchain is created.
  - The starter code is cloned into your GitHub repository.
  - The delivery pipeline is created and triggered.
  - The toolchain is associated with your app.  
  - A trigger is added to the delivery pipeline, so when you push changes to the toolchain's GitHub repo, the delivery pipeline automatically builds and deploys the app.
1. The toolchain overview page will open with a card representation of each of the tools in the toolchain. In the next section, you'll use the tool cards to access the tools.  

  ![](assets/README-dacd6.png)
## Uh oh!
1. From the toolchain overview page, click on the **Delivery Pipeline** card to see how your deployment is going.  The build was started automatically as part of the setup from the template.

  ![](assets/README-7f3f9.png)
1. There are two stages in this Delivery Pipeline.  
  - The first stage will pull the code from the GitHub repository to create a build. This is set to happen automatically on a commit, and you'll see this later in the lab.
  - The second stage will deploy the code to Bluemix to run your app.  But wait!  There was a problem with the deploy.  Notice the red banner indicating the stage failed.

    ![Deploy Failed](assets/README-84779.png)

## Let's fix it
1. Navigate back to the toolchain overview by clicking the back arrow

    ![Toolchain back arrow](assets/README-50e6f.png)
1. Click on the **Eclipse Orion Web IDE** tool card to get to the web editor

    ![Orion tool card](assets/README-1e1bf.png)
1. TODO add in steps for making the fix.
 - [ ] In the navigator select the file to edit
 - [ ] Make the necessary change
 - [ ] Commit the changes
 - [ ] Push the changes
 - [ ] Return to the toolchain

## Running Code!
1. Click on the **Delivery Pipeline** card in the toolchain overview to get back to the pipeline.
2. The commit will have started the build, and the deployment of the app automatically.
3. Once the application is deployed, the Deploy stage will turn green and a direct link to the running application will be available.  Click on it to get to your application.

## Set an alarm
- [ ] Explain how to use the app to set an alarm

## Disable an alarm
- [ ] Explain how to disable the alarm once sent
