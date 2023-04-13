const express = require('express')
const fetch = require('node-fetch')
const { DateTime } = require('luxon')

const router = express.Router()

router.post('/', async (req, res) => {
  if (req.body.search) {
    const search = req.body.search.toUpperCase();
    const groupIdsUrl = 'https://tahvel.edu.ee/hois_back/timetables/group/14?lang=ET';
    const groupByName = {};
    const roomRegex = /^[a-zA-Z](?!000)[0-9]{3}[a-zA-Z]?$/;
    if (search.match(roomRegex)) {
      return res.redirect(`/${search[0]}/${search[1]}?room=${search}`);
    }

    const searchedGroupId = search;
    let response = await fetch(groupIdsUrl);

    if (response.headers.get("content-type") != "application/json") {
      return res.redirect('?error=' + 'Server error');
    }

    let groupIds = (await response.json()).content;

    if(groupIds.length == 0){
      return res.redirect('?error=' + 'Server error');
    }

    groupIds.forEach((group) => {
      const groupId = group.id;
      const groupNameEt = group.nameEt;
      const groupNameEn = group.nameEn;

      groupByName[groupNameEt] = groupId;
      if (!groupByName[groupNameEn]) {
        groupByName[groupNameEn] = groupId;
      }
    });
    if (groupByName[searchedGroupId]) {
      const date = DateTime.now().setZone('Europe/Tallinn');

      const dateToday = date.startOf('day').toFormat("yyyy-LL-dd'T'HH:mm:ss.SSS'Z'");

      const dateInWeek = date.plus({weeks: 1}).endOf('day').toFormat("yyyy-LL-dd'T'HH:mm:ss.SSS'Z'");

      const timetableUrl = `https://tahvel.edu.ee/hois_back/timetableevents/timetableByGroup/14?from=${dateToday}&studentGroups=${groupByName[searchedGroupId]}&thru=${dateInWeek}`;

      let response = await fetch(timetableUrl)

      if (response.headers.get("content-type") != "application/json") {
        return res.redirect('?error=' + 'Server error');
      }

      let timetableEvents = await response.json();

      const roomsByDay = {};

      if(timetableEvents?.timetableEvents.length == 0){
        return res.redirect('?error=' + 'Server error');
      }

      timetableEvents.timetableEvents.forEach((event) => {
        if (event.rooms && event.rooms.length > 0) {
          const { timeStart } = event;
          const { timeEnd } = event;
          const { roomCode } = event.rooms[0];
          const { date } = event;

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
      } else {
        dayData = Object.values(sortedRoomsByDay)[0];
      }

      let nextRoom;
      for (const time in dayData) {
        const timeParts = time.split(':');
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);

        const timeIndex = Object.keys(dayData).indexOf(time);
        if (date.get("hour") === hours && Math.abs(date.get("minute") - minutes) <= 15) {
          nextRoom = dayData[time][0];
          return res.redirect(`/${nextRoom[0]}/${nextRoom[1]}?room=${nextRoom}`);
        }
        if (date.get("hour") < hours && date.get("minute") === minutes) {
          if (timeIndex < Object.keys(dayData).length - 1) {
            nextRoom = Object.values(dayData)[timeIndex + 1][0];
            return res.redirect(`/${nextRoom[0]}/${nextRoom[1]}?room=${nextRoom}`);
          }
        }
      }

      if (nextRoom == null) {
        return res.redirect('?error=' + 'No next rooms');
      }
    } else {
      return res.redirect('?error=' + 'Group or room not found');
    }
  } else {
    return res.redirect('?error=' + 'No search property');
  }
})

module.exports = router;