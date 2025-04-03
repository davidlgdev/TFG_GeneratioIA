# TFG_GeneratioIA
Welcome to the user guide for the GeneratioIA tool, an application designed to automatically generate assessment questions using artificial intelligence and facilitate their integration with Moodle.
## Prerequisites
List everything needed before using the application:
• Access to Moodle with professor permissions (able to configure the tool).
• Necessary tokens:
o Access to an AI model token for its use.
o Access to a Moodle token to return the questions via the web service.
mediante el webservice.
• Have the "ngrok" application or similar installed to expose the local server.
## Application Access
1. Clone the project repository to a known directory.
2. Create a file named .env in the root directory of the project and place the following values:
a. MOODLE_TOKEN_RETQUESTION=your_Moodle_token
b. MISTRA_TOKEN=your_AI_model_token
3. Run ngrok exposing port 3001 "ngrok http 3001".
4. In "site administration"→"Plugins"→"Activity modules"→"External tool" →"Manage tools"
5. Configure a new tool with the following parameters:
![image](https://github.com/user-attachments/assets/6c4fe17a-e94c-483b-a5fc-a71d456410a6)
Substitute the image addresses with those generated by ngrok, while keeping the endpoints they point to.
6. Place the content of the "qbank_plugin" folder in the "mod/local" folder of Moodle to integrate the plugin.
7. For the return, make sure web services can be used in Moodle and add the modified web service to Moodle.
8. Place the tool in the course from the Moodle interface.
## Using the Application
Once everything is configured and ensuring that the application can be accessed, it is described how to generate the questions.
1. Select the type of questions you want to generate (multiple choice, true/false, short answers).
2. Enter the instructions in the text field provided. For example: "Generate 5 multiple choice questions about mathematics."
."
3. Click the Generate questions button.
4. Once generated, the questions appear listed.
5. Now you can:
a. Edit: Modify the text of the questions or answers.
b. Delete: Remove questions that are not relevant.
c. Send to Moodle: Approve the questions you want to send to Moodle.
6. Once the questions are sent, if everything works correctly, they will be automatically saved in the question bank of the corresponding course in Moodle.
## Common Troubleshooting
1. I cannot access the application from Moodle:
a. Make sure you have correctly configured ngrok and the URLs in the LTI tool.
b. Verify that your Moodle user has permissions to configure external tools.
2. The application does not generate questions:
a. Check that the tokens are correctly configured in the .env file.
b. Check the connection to the AI model server.
3. Questions are not sent to Moodle:
a. Verify the Moodle token in the .env file.
b. Make sure the Moodle web service is enabled.
