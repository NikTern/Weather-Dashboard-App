API INCONSISTENCY CREATES A BUG SOMETIMES:

The API returns a list of 40 items (indexed 0-39), each is the weather of a rounded time increment 3 hours from the current time. 

If the current city time is 10:50am, it will return the weather for a list of 40 items, the first being the time of Midday (12:00pm) at the 0th index.
The second item (index 1) will show the time 3pm, the third item (index 2) will show the time 6pm, etc. 
This means that every 8 list items, the time increments by 24 hours - giving access to 6 days total of data.

Suppose the current city time is 11:30am:

    index 0 shows the time at 12pm on day 1
    index 8 shows the time at 12pm on day 2
    index 16 shows the time at 12pm on day 3
    index 24 shows the time at 12pm on day 4
    index 32 shows the time at 12pm on day 5
    index 39 (item 40) shows the time at 12pm on day 5

This is the normal functioning of the API.

But at some times of the day I have noticed it returns the data like this:

Suppose the current city time is 10:50am:

    index 0 shows the time at 12pm on day 1
    index 8 shows the time at 12pm on day 2
    index 16 shows the time at 12pm on day 3
    index 24 shows the time at 12pm on day 4
    index 32 shows the time at 12pm on day 5
    index 39 (item 40) shows the time at 9pm on day 5

Given this data, it is impossible to access 6 days of data for the current day's weather and then a five-day forecast.
Under these rare conditions, the code written will output 5 cards for the 5-day forecast, but the last two will be the same.