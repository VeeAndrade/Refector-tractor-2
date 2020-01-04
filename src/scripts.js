import './css/base.scss';
import './css/styles.scss';
import $ from 'jquery'
import UserRepository from './UserRepository';
import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';

let user;
let dailyOz = document.querySelectorAll('.daily-oz');
let dropdownEmail = $('#dropdown-email');
let dropdownFriendsStepsContainer = document.querySelector('#dropdown-friends-steps-container');
let dropdownGoal = $('#dropdown-goal');
let dropdownName = $('#dropdown-name');
let headerName = $('#header-name');
let hydrationCalendarCard = $('#hydration-calendar-card');
let hydrationFriendOuncesToday = $('#hydration-friend-ounces-today');
let hydrationFriendsCard = $('#hydration-friends-card');
let hydrationInfoCard = $('#hydration-info-card');
let hydrationInfoGlassesToday = $('#hydration-info-glasses-today');
let hydrationMainCard = $('#hydration-main-card');
let hydrationUserOuncesToday = $('#hydration-user-ounces-today');
let mainPage = $('main');
let profileButton = $('#profile-button');
let sleepCalendarCard = $('#sleep-calendar-card');
let sleepCalendarHoursAverageWeekly = $('#sleep-calendar-hours-average-weekly');
let sleepCalendarQualityAverageWeekly = $('#sleep-calendar-quality-average-weekly');
let sleepFriendLongestSleeper = $('#sleep-friend-longest-sleeper');
let sleepFriendsCard = $('#sleep-friends-card');
let sleepFriendWorstSleeper = $('#sleep-friend-worst-sleeper');
let sleepInfoCard = $('#sleep-info-card');
let sleepInfoHoursAverageAlltime = $('#sleep-info-hours-average-alltime');
let sleepInfoQualityAverageAlltime = $('#sleep-info-quality-average-alltime');
let sleepInfoQualityToday = $('#sleep-info-quality-today');
let sleepMainCard = $('#sleep-main-card');
let sleepUserHoursToday = $('#sleep-user-hours-today');
let stairsCalendarCard = $('#stairs-calendar-card');
let stairsCalendarFlightsAverageWeekly = $('#stairs-calendar-flights-average-weekly');
let stairsCalendarStairsAverageWeekly = $('#stairs-calendar-stairs-average-weekly');
let stepsMainCard = $('#steps-main-card');
let stepsInfoCard = $('#steps-info-card');
let stepsFriendsCard = $('#steps-friends-card');
let stepsTrendingCard = $('#steps-trending-card');
let stepsCalendarCard = $('#steps-calendar-card');
let stairsFriendFlightsAverageToday = $('#stairs-friend-flights-average-today');
let stairsFriendsCard = $('#stairs-friends-card');
let stairsInfoCard = $('#stairs-info-card');
let stairsInfoFlightsToday = $('#stairs-info-flights-today');
let stairsMainCard = $('#stairs-main-card');
let stairsTrendingButton = $('.stairs-trending-button');
let stairsTrendingCard = $('#stairs-trending-card');
let stairsUserStairsToday = $('#stairs-user-stairs-today');
let stepsCalendarTotalActiveMinutesWeekly = $('#steps-calendar-total-active-minutes-weekly');
let stepsCalendarTotalStepsWeekly = $('#steps-calendar-total-steps-weekly');
let stepsFriendAverageStepGoal = $('#steps-friend-average-step-goal');
let stepsInfoActiveMinutesToday = $('#steps-info-active-minutes-today');
let stepsInfoMilesWalkedToday = $('#steps-info-miles-walked-today');
let stepsFriendActiveMinutesAverageToday = $('#steps-friend-active-minutes-average-today');
let stepsFriendStepsAverageToday = $('#steps-friend-steps-average-today');
let stepsTrendingButton = $('.steps-trending-button');
let stepsUserStepsToday = $('#steps-user-steps-today');
let trendingStepsPhraseContainer = $('.trending-steps-phrase-container');
let trendingStairsPhraseContainer = $('.trending-stairs-phrase-container');
let userInfoDropdown = $('#user-info-dropdown');

function fetchUserData() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/users/userData')
  .then(response => response.json())
  .then(data => data.userData)
  .then(userInfo => userInfo.map(user => user = new User(user)))
  .catch(error => console.log(error))
}

function fetchSleepData() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData')
  .then(response => response.json())
  .then(data => data.sleepData)
  .catch(error => console.log(error))
}

function fetchActivityData() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData')
  .then(response => response.json())
  .then(data => data.activityData)
  .catch(error => console.log(error))
}

function fetchHydrationData() {
  return fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData')
  .then(response => response.json())
  .then(data => data.hydrationData)
  .catch(error => console.log(error))
}


Promise.all([fetchUserData(), fetchSleepData(), fetchActivityData(), fetchHydrationData()])
.then((value) => {
  const userRepository = new UserRepository();
  userRepository.users = value[0];
  const hydrationData = value[3].map(hydration => new Hydration(hydration, userRepository));
  const randomId = Math.floor(Math.random() * (50 - 1) + 1);
  user = new User(userRepository.getUser(randomId));
  const sleepData = value[1].map(sleep => new Sleep(sleep, userRepository));
  const activityData = value[2].map(activity => new Activity(activity, userRepository));
  user.activityRecord = activityData;
  user.ouncesRecord = hydrationData;
  const todayDate = "2020/01/08";

  mainPage.on('click', showInfo);
  profileButton.on('click', showDropdown);
  stairsTrendingButton.on('click', updateTrendingStairsDays());
  stepsTrendingButton.on('click', updateTrendingStepDays());
  
  user.findFriendsNames(userRepository.users);

  function updateTrendingStairsDays() {
    user.findTrendingStairsDays();
    trendingStairsPhraseContainer.innerHTML = `<p class='trend-line'>${user.trendingStairsDays[0]}</p>`;
  }

  function updateTrendingStepDays() {
    user.findTrendingStepDays();
    trendingStepsPhraseContainer.innerHTML = `<p class='trend-line'>${user.trendingStepDays[0]}</p>`;
  }

  dropdownGoal.text(`DAILY STEP GOAL | ${user.dailyStepGoal}`);

  dropdownEmail.text(`EMAIL | ${user.email}`);

  dropdownName.text(user.name.toUpperCase());

  headerName.text(`${user.getFirstName()}'S `);

  hydrationUserOuncesToday.text(hydrationData.find(hydration => {
    return hydration.userId === user.id && hydration.date === todayDate;
  }).ounces);

  hydrationFriendOuncesToday.text(userRepository.calculateAverageDailyWater(todayDate));

  hydrationInfoGlassesToday.text(hydrationData.find(hydration => {
    return hydration.userId === user.id && hydration.date === todayDate;
  }).ounces / 8);

  sleepCalendarHoursAverageWeekly.text(user.calculateAverageHoursThisWeek(todayDate));

  sleepCalendarQualityAverageWeekly.text(user.calculateAverageQualityThisWeek(todayDate));

  sleepFriendLongestSleeper.text(userRepository.users.find(user => {
    return user.id === userRepository.getLongestSleepers(todayDate, sleepData)
  }).getFirstName());

  sleepFriendWorstSleeper.text(userRepository.users.find(user => {
    return user.id === userRepository.getWorstSleepers(todayDate, sleepData)
  }).getFirstName());

  sleepInfoHoursAverageAlltime.text(user.hoursSleptAverage);

  stepsInfoMilesWalkedToday.text(user.activityRecord.find(activity => {
    return (activity.date === todayDate && activity.userId === user.id)
  }).calculateMiles(userRepository));

  sleepInfoQualityAverageAlltime.text(user.sleepQualityAverage);
  
  sleepInfoQualityToday.text(sleepData.find(sleep => {
    return sleep.userId === user.id && sleep.date === todayDate;
  }).sleepQuality)

  sleepUserHoursToday.text(sleepData.find(sleep => {
    return sleep.userId === user.id && sleep.date === todayDate;
  }).hoursSlept);

  let sortedHydrationDataByDate = user.ouncesRecord.sort((a, b) => {
    if (Object.keys(a)[0] > Object.keys(b)[0]) {
      return -1;
    }
    if (Object.keys(a)[0] < Object.keys(b)[0]) {
      return 1;
    }
    return 0;
  });

  for (var i = 0; i < dailyOz.length; i++) {
    dailyOz[i].innerText = user.addDailyOunces(Object.keys(sortedHydrationDataByDate[i])[0])
  }

  stairsCalendarFlightsAverageWeekly.text(user.calculateAverageFlightsThisWeek(todayDate));

  stairsCalendarStairsAverageWeekly.text((user.calculateAverageFlightsThisWeek(todayDate) * 12).toFixed(0));

  stairsFriendFlightsAverageToday.text((userRepository.calculateAverageStairs(todayDate) / 12).toFixed(1));

  stairsInfoFlightsToday.val(activityData.find(activity => {
    return activity.userId === user.id && activity.date === todayDate;
  }).flightsOfStairs);

  stairsUserStairsToday.text(activityData.find(activity => {
    return activity.userId === user.id && activity.date === todayDate;
  }).flightsOfStairs * 12);

  stairsCalendarFlightsAverageWeekly.text(user.calculateAverageFlightsThisWeek(todayDate));

  stairsCalendarStairsAverageWeekly.text((user.calculateAverageFlightsThisWeek(todayDate) * 12).toFixed(0));

  stairsTrendingButton.on('click', () => {
    user.findTrendingStairsDays();
    trendingStairsPhraseContainer.innerHTML = `<p class='trend-line'>${user.trendingStairsDays[0]}</p>`;
  });

  stepsCalendarTotalActiveMinutesWeekly.text(user.calculateAverageMinutesActiveThisWeek(todayDate));

  stepsCalendarTotalStepsWeekly.text(user.calculateAverageStepsThisWeek(todayDate));

  stepsTrendingButton.on('click', () => {
    user.findTrendingStepDays();
    trendingStepsPhraseContainer.innerHTML = `<p class='trend-line'>${user.trendingStepDays[0]}</p>`;
  });

  stepsFriendActiveMinutesAverageToday.text(userRepository.calculateAverageMinutesActive(todayDate));

  stepsFriendAverageStepGoal.text(`${userRepository.calculateAverageStepGoal()}`);

  stepsFriendStepsAverageToday.text(userRepository.calculateAverageSteps(todayDate));

  stepsInfoActiveMinutesToday.text(activityData.find(activity => {
    return activity.userId === user.id && activity.date === todayDate;
  }).minutesActive);

  stepsUserStepsToday.text(activityData.find(activity => {
    return activity.userId === user.id && activity.date === todayDate;
  }).steps);

  user.findFriendsTotalStepsForWeek(userRepository.users, todayDate);

  user.friendsActivityRecords.forEach(friend => {
    dropdownFriendsStepsContainer.innerHTML += `
  <p class='dropdown-p friends-steps'>${friend.firstName} |  ${friend.totalWeeklySteps}</p>
  `;
  });

  function flipCard(cardToHide, cardToShow) {
    cardToHide.addClass('hide');
    cardToShow.removeClass('hide');
  }

function showInfo() {
  if ($(event.target).hasClass('steps-info-button')) {
    flipCard(stepsMainCard, stepsInfoCard);
  }
  if ($(event.target).hasClass('steps-friends-button')) {
    flipCard(stepsMainCard, stepsFriendsCard);
  }
  if ($(event.target).hasClass('steps-trending-button')) {
    flipCard(stepsMainCard, stepsTrendingCard);
  }
  if ($(event.target).hasClass('steps-calendar-button')) {
    flipCard(stepsMainCard, stepsCalendarCard);
  }
  if ($(event.target).hasClass('hydration-info-button')) {
    flipCard(hydrationMainCard, hydrationInfoCard);
  }
  if ($(event.target).hasClass('hydration-friends-button')) {
    flipCard(hydrationMainCard, hydrationFriendsCard);
  }
  if ($(event.target).hasClass('hydration-calendar-button')) {
    flipCard(hydrationMainCard, hydrationCalendarCard);
  }
  if ($(event.target).hasClass('stairs-info-button')) {
    flipCard(stairsMainCard, stairsInfoCard);
  }
  if ($(event.target).hasClass('stairs-friends-button')) {
    flipCard(stairsMainCard, stairsFriendsCard);
  }
  if ($(event.target).hasClass('stairs-trending-button')) {
    flipCard(stairsMainCard, stairsTrendingCard);
  }
  if ($(event.target).hasClass('stairs-calendar-button')) {
    flipCard(stairsMainCard, stairsCalendarCard);
  }
  if ($(event.target).hasClass('sleep-info-button')) {
    flipCard(sleepMainCard, sleepInfoCard);
  }
  if ($(event.target).hasClass('sleep-friends-button')) {
    flipCard(sleepMainCard, sleepFriendsCard);
  }
  if ($(event.target).hasClass('sleep-calendar-button')) {
    flipCard(sleepMainCard, sleepCalendarCard);
  }
  if ($(event.target).hasClass('steps-go-back-button')) {
    flipCard($(event.target).parent(), stepsMainCard);
  }
  if ($(event.target).hasClass('hydration-go-back-button')) {
    flipCard($(event.target).parent(), hydrationMainCard);
  }
  if ($(event.target).hasClass('stairs-go-back-button')) {
    flipCard($(event.target).parent(), stairsMainCard);
  }
  if ($(event.target).hasClass('sleep-go-back-button')) {
    flipCard($(event.target).parent(), sleepMainCard);
  }
}

})
.catch(error => console.log(error))

// function flipCard(cardToHide, cardToShow) {
//   cardToHide.classList.addClass('hide');
//   cardToShow.removeClass('hide');
// }

function showDropdown() {
  userInfoDropdown.classList.toggle('hide');
}

let friendsStepsParagraphs = document.querySelectorAll('.friends-steps');

friendsStepsParagraphs.forEach(paragraph => {
  if (friendsStepsParagraphs[0] === paragraph) {
    paragraph.classList.add('green-text');
  }
  if (friendsStepsParagraphs[friendsStepsParagraphs.length - 1] === paragraph) {
    paragraph.classList.add('red-text');
  }
  if (paragraph.innerText.includes('YOU')) {
    paragraph.classList.add('yellow-text');
  }
});