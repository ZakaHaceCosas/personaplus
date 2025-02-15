# Tasks to-do

Here I'll keep track of what I want to do short-term so I don't forget about it.

## Overall plan

- actual active objectives (push ups, running, etc...) are "paused" as of now, they imply a lot of nerdy medical stuff i don't want to waste my time with. CoreLibrary is "paused" as well (nothing official whatsoever, it's just that i'm not gonna focus on them for now).
- for now i'll try to get passive objectives, streaks, and some basic user-data-based personalization
- once the above is done, passive objectives = something actually useful (and usable, i hope) = ALPHA (possibly)
- after that we'll see, by then i'll likely start suffering again with active objectives
- diet and wellbeing can wait, lol

----

## Fixing stuff

- [x] Add `createdAt` property to active objectives so `FailObjectivesNotDoneYesterday()` doesn't fail an objective you "didn't do yesterday" because it's new.
- [x] Ensure notifications are stopped immediately after finishing today's last objective (probably by moving that to the `results.tsx` page).
- [x] Translating missing stuff:
  - [x] new user data form validation
  - [x] report page
- [x] optimize dev interface by reducing the amount of stuff to load (moving them to separate pages)
- [x] fix the damn BMI percentiles for CL
- [x] fix report page's date handling
  - [x] handling more undone staff than just yesterday

## Adding cool stuff

### From planned features

- [ ] passive objectives
  - [x] base code
    - [x] types
    - [x] toolkit
    - [ ] daily log
  - [ ] make them work
    - [x] create
    - [x] delete
    - [ ] edit
    - [ ] mark done
    - [ ] fail

- [ ] using user data to personalize the app
  - [ ] eg. if a person isn't very active and sets a high-intensity objective, show a warning that won't be shown to a more active user telling them to start smaller and increase eventually (for example)
- [ ] an assistant that automatically makes objectives, from a set of templates and doing a bit of math with the user's data

### Other cool ideas

- [ ] daily streaks for doing active objectives
  - [ ] note: don't break streak for days you didn't have objectives for, only break it if there WAS an objective for yesterday that you failed
- [ ] focus training (basically a black page with a countdown. each day you do it 100% it increases it's duration). simple feature but someone could find it useful i guess.
