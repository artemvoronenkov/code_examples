# Overview
This repository contains sample code. I took the functional requirement from my latest fintech project as an idea for implementation. The root file is UploadingContainer.tsx. This example implements the functionality of uploading one or multiple files, add information to each file using various controllers. The list of files is presented in the view of a table with the following columns:

1) File name (predefined after files selection).
2) Asset ID (autocomplete with options from server).
3) Quarter (single choice select with generated options on frontend side).
4) Financial Type (multiple choice select with static options).

There are also several additional modes, which can be activated using a checkbox:
 1 - Single Asset ID Mode - In each file Asset ID of the first file is selected, the remaining inputs of the asset ID become blocked;
 2 - Single Quarter Mode - Similar to the Single Asset ID Mode just for the Quarter column;

After entering all the data, all fields are validated and the data is sent to the server.