#Masters of the Rift (V1.0) ![Masters of the Rift logo](http://i.imgur.com/LsUYQHM.png "Logo")

##### For a full write-up please visit [this Link](https://docs.google.com/document/d/1OQTJUeE9rWVFVlN1p8xV9mijL09jSobhid-z-MBpcHU).

##### There is an online version of the game [running here](http://dedivps-47985.dedicloud.co.uk/)

## KNOWN BUGS IN V1.0
- Sometimes, very occasionally a game may not load, this is possible due to the server not being able to connect to the API and erroring  out, nevertheless it does not tell the client and you are stuck on 'Waiting for server...' if you are stuck on this screen for more than 10 seconds try refreshing the page and queueing again.
- When in a match, Lane icons for TOP and JUNGLE sometimes do not display, this seems to be a problem with data dragon.

## What is Masters of the Rift?
Masters of the rift is a 1v1 online game based on League of Legends. This project was created as part of Riot Games API Challenge 2016 and aims to show how mastery data can be used as part of a broader, more social experience.

This is not the first time that we have entered the API Challenge as a team, we entered a project back in 2015 that aimed to make generating Item Sets much easier to players. We knew that this year the premise would be complete changing and we weren’t wrong. This year's API challenge has broadened greatly in terms of what type of projects can be made.

For our entry we wanted to focus on the Entertainment Category, We really liked the idea of creating a live and dynamic experience for players, we also saw encouragement towards an entertainment entry that could show a social value to players.

Our entry allows players to play online against each other in a 1v1 battle to see who knows the most about champions, items and players in league of legends.


## TECHNOLOGY STACK
The technology stack we decided to use we found has proved to be excellent for building a realtime online game.
- Backend
  - NodeJS: We used NodeJS as we loved the fact it works so well when working with web sockets
  - Express: We used Express because we heard it was simple to use and very easy to work with when building an application.
  - MongoDB: We had heard that MongoDB is very popular as a database to use with Backend Javascript servers, we have found it is very reliable and easy to configure.
  - Socket.IO: Not only does Socket.IO have some great documentation, it is easy to set up and get going with, it also has some really nice garbage collection features for clearing empty rooms etc.
  - Venti: We used Venti as an event emitter to pass information between different modules on the back-end, its also used-heavily on the front-end
- Frontend
  - ReactJS: ReactJS is fast and flexible and the component structure really suited the way we approached this project, we wanted to emphasise code re-usability to ReactJS was a great choice.
  - Socket.IO
  - HTML5: We wanted to include some really nice and flash features on the website and we needed HTML5 elements to do this.
  - CSS3: The page would just look awful otherwise!
  - jQuery: Because, well… It’s jQuery.
  - Venti
  
## GETTING SET UP
We have provided a full set of instructions on how to set up the server on ubuntu 14 over on our [Write Up](https://docs.google.com/document/d/1OQTJUeE9rWVFVlN1p8xV9mijL09jSobhid-z-MBpcHU).

