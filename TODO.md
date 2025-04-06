# Tasks to-do

Here I'll keep track of what I want to do short-term so I don't forget about it.

## Overall plan

- Active Objectives (push ups, running, etc...) are "paused" as of now, they imply a lot of nerdy medical stuff I don't want to waste my time with. CoreLibrary is "paused" as well (nothing official whatsoever, it's just that I'm not going to focus on them for now).
- For now I'll try to get Passive Objectives (almost done!), streaks, and some basic user-data-based personalization added.
- Once the above is done, since `PassiveObjectives = Something Actually Useful (and usable)`, I just MIGHT jump from PreApp to ALPHA stage, and start marketing the app a little.
- After that we'll see, by then I'll likely start suffering again with active objectives
- Diet and wellbeing features can wait, lol.

----

## Fixing stuff

- [ ] fix notifications, they seem broken again for whatever reason
- [ ] fix passive objectives' rendering - they now DO work fine on the backend, but they DO NOT reflect that properly in the UI (not updating when clicking "Achieved!" + showing ALL objectives, even already done ones, in the home page UI)

## Adding cool stuff

### From planned features

- [ ] passive objectives
  - [x] base code
    - [x] types
    - [x] toolkit
    - [x] daily log
  - [ ] make them work
    - [x] create
    - [x] delete
    - [ ] edit
    - [x] mark done
    - [x] fail (untested)
- [ ] using user data to personalize the app
  - [ ] eg. if a person isn't very active and sets a high-intensity objective, show a warning that won't be shown to a more active user telling them to start smaller and increase eventually (for example)
- [ ] an assistant that automatically makes objectives, from a set of templates and doing a bit of math with the user's data

### Other cool ideas

- [ ] daily streaks for doing active objectives
  - [ ] note: don't break streak for days you didn't have objectives for, only break it if there WAS an objective for yesterday that you failed
- [ ] focus training (basically a black page with a countdown. each day you do it 100% it increases it's duration). simple feature but someone could find it useful i guess.
