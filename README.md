# Country, Regional, World GDP & Population Dashboard

The World GDP data visualization project is an interactive web-based application that employs D3.js, a powerful JavaScript library, to create dynamic and engaging visualizations of global economic data. The project focuses on four types of visualizations: a choropleth map, a line graph, a bubble chart, and a scatter plot, each offering unique insights into the global distribution of wealth, historical economic trends, and correlations between various economic factors. Techniques used in the development of this project include d3.geo functions for geospatial data manipulation, CSS for styling, and CSS Flexbox and Grid for responsive and adaptable layouts. Through these visualizations, users can gain a deeper understanding of global economic patterns, identify areas of concern, and inform decisions related to economic development and policy. The project serves as a valuable tool for researchers, policymakers, and analysts interested in exploring and communicating complex economic data in an accessible and engaging manner.

# Insight Gained:
Relationship between GDP per capita, population, and total GDP: The bubble chart reveals a correlation between GDP per capita and population size. Generally, countries with larger populations tend to have lower GDP per capita. However, there are exceptions, such as small, wealthy countries with high GDP per capita and large, economically diverse countries with relatively high GDP per capita. The visualization also highlights outliers that may warrant further investigation.

Correlation between GDP per capita and life expectancy: The scatter plot shows that there is a general trend of countries with higher GDP per capita having higher life expectancies. This suggests that economic prosperity is linked to better healthcare, living conditions, and overall well-being. However, there are notable exceptions, indicating that other factors, such as social policies and cultural norms, can also influence life expectancy.

# How to run the files?
- Download all the files in a single folder (important)
- Open the terminal/PowerShell and navigate to the folder where the above files were downloaded. Make sure the path shows the correct folder in the terminal.
- Run the following command to start the server locally: python -m http.server
Make sure the server is running on port 8000. If it is running on any other port, make a note of the port.
- Open Google Chrome. Type the following in the address bar: http://localhost:8000/
If the server is running on any other port, replace the port number after localhost:
- You should be able to see the files in your browser. Click and open index.html
 
Note: Make sure you have the node modules installed. Contact me for the csv files that contain data.
