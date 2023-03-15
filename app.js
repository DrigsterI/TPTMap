
const express = require('express');
const nunjucks = require('nunjucks');
const https = require('https');
const { json } = require('express');
const fs = require('fs');

const app = express();

app.set('view engine', 'html');
app.set('views', './views');

app.use(express.static('./public'));

const env = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = 3000;

app.get('/', (req, res) => {
  res.redirect('/A/1');
});
app.get('/about', (req, res) => {
  res.render('aboutus');
});

app.get('/:building/:floor', (req, res) => {
  if (!req.params.building.match(/^[a-zA-Z]$/)) {
    return res.redirect("/");
  }

  if (!req.params.floor.match(/^[0-9]+$/)) {
    return res.redirect("/");
  }
  if (fs.existsSync(`public/imgs/maps/${req.params.building}/${req.params.floor}.svg`)) {
    return res.render('index', { mapUrl: `/imgs/maps/${req.params.building}/${req.params.floor}.svg` });
  } else {
    return res.render('index');
  }
});

app.post('/:building/:floor', (req, res) => {
  if (req.body.search) {
    const search = req.body.search.toUpperCase();
    const groupIdsUrl = "https://tahvel.edu.ee";
    const groupByName = {};
    let roomRegex = /^[a-zA-Z](?!000)[0-9]{3}$/;
    if (search.match(roomRegex)) {
      return res.redirect(`/${search[0]}/${search[1]}?room=${search}`);
    }
    else {
      const searchedGroupId = search;
      https.get(groupIdsUrl, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            const responseObject = JSON.parse(data);
            const content = responseObject.content;

            content.forEach((group) => {
              const groupId = group.id;
              const groupNameEt = group.nameEt;
              const groupNameEn = group.nameEn;

              groupByName[groupNameEt] = groupId;
              if (!groupByName[groupNameEn]) {
                groupByName[groupNameEn] = groupId;
              }
            });
            if (groupByName[searchedGroupId]) {
              let date = new Date();
              date.setHours(0, 0, 0, 0);

              let dateToday = date.toISOString();
              date.setDate(date.getDate() + 7);

              let dateInWeek = date.toISOString();

              const timetableUrl = `https://tahvel.edu.ee/hois_back/timetableevents/timetableByGroup/14?from=${dateToday}&studentGroups=${groupByName[searchedGroupId]}&thru=${dateInWeek}`;

              https.get(timetableUrl, (response) => {
                let data = '';

                // A chunk of data has been received.
                response.on('data', (chunk) => {
                  data += chunk;
                });

                // The whole response has been received. Print out the result.
                response.on('end', () => {
                  try {
                    const responseObject = JSON.parse(data);
                    const timetableEvents = responseObject.timetableEvents;

                    const roomsByDay = {};

                    timetableEvents.forEach((event) => {
                      if (event.rooms && event.rooms.length > 0) {
                        const timeStart = event.timeStart;
                        const timeEnd = event.timeEnd;
                        const roomCode = event.rooms[0].roomCode;
                        const date = event.date;

                        if (!roomsByDay[date]) {
                          roomsByDay[date] = {};
                        }

                        if (!roomsByDay[date][timeStart]) {
                          roomsByDay[date][timeStart] = [];
                        }

                        roomsByDay[date][timeStart].push(roomCode);
                      }
                    });

                    Object.keys(roomsByDay).forEach((date) => {
                      const dateObject = roomsByDay[date];
                      const sortedTimes = Object.keys(dateObject).sort();
                      const sortedDateObject = {};

                      sortedTimes.forEach((time) => {
                        sortedDateObject[time] = dateObject[time];
                      });

                      roomsByDay[date] = sortedDateObject;
                    });

                    const sortedDates = Object.keys(roomsByDay).sort();
                    const sortedRoomsByDay = {};

                    sortedDates.forEach((date) => {
                      sortedRoomsByDay[date] = roomsByDay[date];
                    });

                    let dayData = [];
                    if (sortedRoomsByDay[dateToday]) {
                      dayData = sortedRoomsByDay[dateToday];
                    }
                    else {
                      dayData = Object.values(sortedRoomsByDay)[0];
                    }

                    let nextRoom;
                    for (let time in dayData) {
                      let timeParts = time.split(":");
                      let hours = parseInt(timeParts[0], 10);
                      let minutes = parseInt(timeParts[1], 10);

                      let timeIndex = Object.keys(dayData).indexOf(time);
                      if (date.getHours() === hours && Math.abs(date.getMinutes() - minutes) <= 15) {
                        nextRoom = dayData[time][0];
                        return res.redirect(`/${nextRoom[0]}/${nextRoom[1]}?room=${nextRoom}`);
                      }
                      else if (date.getHours() < hours && date.getMinutes() === minutes) {
                        if (timeIndex < Object.keys(dayData).length - 1) {
                          nextRoom = Object.values(dayData)[timeIndex + 1][0];
                          return res.redirect(`/${nextRoom[0]}/${nextRoom[1]}?room=${nextRoom}`);
                        }
                      }
                    }

                    if (nextRoom == null) {
                      return res.redirect("?error=" + "No next rooms");
                    }
                  } catch (error) {
                    console.log("Search error: " + error);
                    return res.redirect("?error=" + "Server error");
                  }
                });
              }).on("error", (err) => {
                return res.redirect("?error=" + err.message);
              });
            }
            else {
              return res.redirect("?error=" + "Group not found");
            }
          } catch (error) {
            console.log("Search error: " + error);
            return res.redirect("?error=" + "Server error");
          }
        });
      }).on("error", (err) => {
        return res.redirect("?error=" + err.message);
      });
    }
  }
  else {
    return res.redirect("?error=" + "No search property");
  }
});

app.get('/about', (req, res) => {
  res.render('aboutus');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
})
