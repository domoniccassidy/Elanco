## Elanco Rebates - Table of contents
1. [Introduction](#introduction)
2. [Task](#task)
3. [Viewing the project](#viewing-the-project)
4. [System design and flow](#system-design-and-flow)
    1. [Project folder structure](#project-structure)
    2. [User interface showcase](#user-interface)
5. [New requirements and requirement changes](#new-requirements-and-requirement-changes)
    1. [User interface showcase](#user-interface-requirement-changes)
6. [Tools and frameworks used](#tools-and-frameworks)
8. [Source code examples](#source-code-examples)


## Introduction
Elanco wants to explore the use of cloud-based cognitive services to complete text analysis on receipts to improve our customer experiences.

We believe this can be achieved by accelerating our rebates process, which today requires our customers to complete multiple forms incorporating details from multiple
receipts/products. 

## Task
Using Azure Cognitive Services, build a web-based application which represents the use of image-to-text to extract and display key details from product images and receipts.
Elanco will provide sample images of test receipts/products and we’d like to see which useful data we can programmatically extract and display in a web interface to validate this approach to streamlining the customer experience.

![Alt Text](https://github.com/hbux/ElancoRebatesProject/blob/main/Documentation/markdown-images/ER_gif.gif)

## Viewing the project


## System Design and Flow
### Project Structure
* **github/workflows:** The action for hosting on Azure.
* **elanco-backend:** Holds the backend modules.
* **elanco-frontend:** Holds the UI and JavaScript for the project.
* **node-modules:** Contains the required code for Node.Js
* **training:** Holds the documents needed to train the Azure Form Recognizer models.

### User Interface

**Form Page:** This is the UI for the rebate form.
<p float="left">
  <img src="https://github.com/hbux/ElancoRebatesProject/blob/main/Documentation/markdown-images/main_desktop.png" />
</p>

---

**Select Rebate Page:** This is the UI for selecting a rebate offer.
<p float="left">
  <img src="https://github.com/hbux/ElancoRebatesProject/blob/main/Documentation/markdown-images/rebates_desktop.png" />
</p>

## New Requirements and Requirement Changes

There have been new requirements added by the client. Essentially, the client wants every field on the rebate form
to be auto-filled. This can be achieved by adding a login/register functionality where a customer account contains 
additional details such as:
* First name and surname
* Email address
* Address
* Multiple pets

The client wants to replace the pet input field to an image of the customer's pet(s). Where the user can select an image of their pet.

---

#### User Interface Requirement Changes 
**Form Page Authenticated:** This is the UI for the rebate form that has been filled when logged in.
<p float="left">
  <img src="https://github.com/hbux/ElancoRebatesProject/blob/main/Documentation/markdown-images/complete_desktop.png" />
</p>

---

**Account Page:** This is the UI for an authenticated user's account page.
<p float="left">
  <img src="https://github.com/hbux/ElancoRebatesProject/blob/main/Documentation/markdown-images/account_desktop.png" />
</p>

## Tools and Frameworks
Technologies that have and will be brought into this application down the line.
* JavaScript
* HTML & CSS
* React
* Unit Testing
* Azure Form Recognizer for invoice analysis
* Azure for hosting
* Git
* [Trello Board](https://trello.com/b/XGlFP9AB/elanco)

## Source Code Examples
**SQL data access for retrieving and saving data.**
<p float="left">
  <img src="https://github.com/hbux/ElancoRebatesProject/blob/main/Documentation/markdown-images/sql_code.png" width="50%" height="50%"/>
</p>

--- 

**Azure Form Recognizer API call.**
<p float="left">
  <img src="https://github.com/hbux/ElancoRebatesProject/blob/main/Documentation/markdown-images/api_code.png" width="50%" height="50%"/>
</p>
