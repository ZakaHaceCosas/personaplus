# Tasks to-do

Here I'll keep track of what I want to do short-term so I don't forget about it.

## Fixing stuff

- [x] Add `createdAt` property to active objectives so `FailObjectivesNotDoneYesterday()` doesn't fail an objective you "didn't do yesterday" because it's new.
- [x] Ensure notifications are stopped immediately after finishing today's last objective (probably by moving that to the `results.tsx` page).
- [ ] Translating missing stuff:
  - [ ] new user data form validation
  - [ ] report page
- [x] optimize dev interface by reducing the amount of stuff to load (moving them to separate pages)
- [ ] fix the damn BMI percentiles for CL

## Adding cool stuff

### From planned features

- [ ] passive objectives
- [ ] using user data to personalize the app
  - [ ] eg. if a person isn't very active and sets a high-intensity objective, show a warning that won't be shown to a more active user telling them to start smaller and increase eventually (for example)
- [ ] an assistant that automatically makes objectives, from a set of templates and doing a bit of math with the user's data

### Other cool ideas

- [ ] daily streaks for doing active objectives
  - [ ] note: don't break streak for days you didn't have objectives for, only break it if there WAS an objective for yesterday that you failed
- [ ] focus training (basically a black page with a countdown. each day you do it 100% it increases it's duration). simple feature but someone could find it useful i guess.
