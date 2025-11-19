# APP Type
- build a deahhang tracker app with a modern 
- The deadhang tracker app should be a powerful SPA (Single Page Application) without the complexity of external frameworks like React, Vue, or 
Angular. 
- Pure JavaScript SPA. all in one file. data that are saved should be exportable (csv) and importable

# Input Data (in that order)
Date
Time [hh:mm]
Duration [sec]
Location
Grip Type
PRE
Symptoms
Notes

## data validation and data quality checks
Date --> valid date
Time --> to hours and 10 min steps
Duration (sec) --> sec
Location --> categoric (Gym, At Home, Hotel, At Work)
Grip Type --> Passive Hang, Active Hang, One-Arm Assis, Towel Grip, Fingerboard, Mixed Grip
PRE --> 1..10
Symptoms --> Forearm tightness, Elbow soreness, Wrist discomfort, Shoulder strain, Back tension
Notes --> free text


# Requirements
- Enter all Variables as key value pair. left is the name and right to enter. then next row. 
- Include a Timer that i can start and stop.
- When i click on the stop button the value of the dead hang duration (in sec) should be entered in the according input field with current date and time
- Implement a Save button to save the whole day with all data to a internal data structure
- All Buttons should also work when i open the html file on my smartphone!
- Implement a Reset Button that sets all input fields to default value
- Export functionality: csv file for all days possible
- Import functionality: Import same csv File (same schema)
- separate sheet of a dashboard of some average measues and trend over time of Duration of the hang. 
- focus on easy entry of data for the user with all the checks and prefilled data
- add all the input data fields to the main input screen (mainly for smartphone use; important for choosing design) with all input checks, to focus on easy input of the data.

# Design pattern
- SAP (pure javascript)
- persistence of saved records without exporting and without a backend
- exported and imported functionality in CSV file

