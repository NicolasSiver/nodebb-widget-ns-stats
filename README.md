# NodeBB Widget: Stats

Overall stats about life on the forum. Some metrics are number of posts, users, topics. Also several additional user related features like - currently online users and who have visited today.

![Version](https://img.shields.io/npm/v/nodebb-widget-ns-stats.svg)
![Dependencies](https://david-dm.org/NicolasSiver/nodebb-widget-ns-stats.svg)
![bitHound Score](https://www.bithound.io/github/NicolasSiver/nodebb-widget-ns-stats/badges/score.svg)
![Code Climate](https://img.shields.io/codeclimate/github/NicolasSiver/nodebb-widget-ns-stats.svg)
![Travis](https://travis-ci.org/NicolasSiver/nodebb-widget-ns-stats.svg?branch=master)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
 

- [Look](#look)
- [Implementation](#implementation)
- [TODO](#todo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Look

![Widget Preview](screenshot.png)

## Implementation

- Users are sorted by `username` in online list
- Users are sorted by time of appearance in today list
- Online list response is cached for 60 seconds
- Online list is limited to 128 records
- Online status is true, if user was around for last 15 minutes
- General stats are cached for 1 day

## TODO

- Add real-time updates
- Use group colors for user list
- Show newest member and relative time when he/she joined