import $ from 'jquery'
import './css/base.scss';
import './css/styles.scss';
import UserRepository from './UserRepository';
import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';

let user;
let dailyOz = document.querySelectorAll('.daily-oz');

function showDropdown() {
  $('#user-info-dropdown').toggleClass('hide');
}

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

  $('main').on('click', showInfo);
  $('#profile-button').on('click', showDropdown);
  $('.stairs-trending-button').on('click', updateTrendingStairsDays());
  $('.steps-trending-button').on('click', updateTrendingStepDays());
  
  user.findFriendsNames(userRepository.users);

  function updateTrendingStairsDays() {
    user.findTrendingStairsDays();
    $('.trending-stairs-phrase-container').html(`<p class='trend-line'>${user.trendingStairsDays[0]}</p>`);
  }

  function updateTrendingStepDays() {
    user.findTrendingStepDays();
    $('.trending-steps-phrase-container').html(`<p class='trend-line'>${user.trendingStepDays[0]}</p>`);
  }

  $('#dropdown-goal').text(`DAILY STEP GOAL | ${user.dailyStepGoal}`);

  $('#dropdown-email').text(`EMAIL | ${user.email}`);

  $('#dropdown-name').text(user.name.toUpperCase());

  $('#header-name').text(`${user.getFirstName()}'S `);

  $('#hydration-user-ounces-today').text(hydrationData.find(hydration => {
    return hydration.userId === user.id && hydration.date === todayDate;
  }).ounces);

  $('#hydration-friend-ounces-today').text(userRepository.calculateAverageDailyWater(todayDate));

  $('#hydration-info-glasses-today').text(hydrationData.find(hydration => {
    return hydration.userId === user.id && hydration.date === todayDate;
  }).ounces / 8);

  $('#sleep-calendar-hours-average-weekly').text(user.calculateAverageHoursThisWeek(todayDate));

  $('#sleep-calendar-quality-average-weekly').text(user.calculateAverageQualityThisWeek(todayDate));

  $('#sleep-friend-longest-sleeper').text(userRepository.users.find(user => {
    return user.id === userRepository.getLongestSleepers(todayDate, sleepData)
  }).getFirstName());

  $('#sleep-friend-worst-sleeper').text(userRepository.users.find(user => {
    return user.id === userRepository.getWorstSleepers(todayDate, sleepData)
  }).getFirstName());

  $('#sleep-info-hours-average-alltime').text(user.hoursSleptAverage);

  $('#steps-info-miles-walked-today').text(user.activityRecord.find(activity => {
    return (activity.date === todayDate && activity.userId === user.id)
  }).calculateMiles(userRepository));

 $('#sleep-info-quality-average-alltime').text(user.sleepQualityAverage);
  
  $('#sleep-info-quality-today').text(sleepData.find(sleep => {
    return sleep.userId === user.id && sleep.date === todayDate;
  }).sleepQuality)

  $('#sleep-user-hours-today').text(sleepData.find(sleep => {
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

  $('#stairs-calendar-flights-average-weekly').text(user.calculateAverageFlightsThisWeek(todayDate));

  $('#stairs-calendar-stairs-average-weekly').text((user.calculateAverageFlightsThisWeek(todayDate) * 12).toFixed(0));

  $('#stairs-friend-flights-average-today').text((userRepository.calculateAverageStairs(todayDate) / 12).toFixed(1));

  $('#stairs-info-flights-today').text(activityData.find(activity => {
    return activity.userId === user.id && activity.date === todayDate;
  }).flightsOfStairs);

  $('#stairs-user-stairs-today').text(activityData.find(activity => {
    return activity.userId === user.id && activity.date === todayDate;
  }).flightsOfStairs * 12);

  $('#stairs-calendar-flights-average-weekly').text(user.calculateAverageFlightsThisWeek(todayDate));

  $('#stairs-calendar-stairs-average-weekly').text((user.calculateAverageFlightsThisWeek(todayDate) * 12).toFixed(0));

  $('.stairs-trending-button').on('click', () => {
    user.findTrendingStairsDays();
    $('.trending-stairs-phrase-container').html(`<p class='trend-line'>${user.trendingStairsDays[0]}</p>`);
  });

  $('#steps-calendar-total-active-minutes-weekly').text(user.calculateAverageMinutesActiveThisWeek(todayDate));

  $('#steps-calendar-total-steps-weekly').text(user.calculateAverageStepsThisWeek(todayDate));

  $('.steps-trending-button').on('click', () => {
    user.findTrendingStepDays();
    $('.trending-steps-phrase-container').html(`<p class='trend-line'>${user.trendingStepDays[0]}</p>`);
  });

  $('#steps-friend-active-minutes-average-today').text(userRepository.calculateAverageMinutesActive(todayDate));

  $('#steps-friend-average-step-goal').text(`${userRepository.calculateAverageStepGoal()}`);

  $('#steps-friend-steps-average-today').text(userRepository.calculateAverageSteps(todayDate));

  $('#steps-info-active-minutes-today').text(activityData.find(activity => {
    return activity.userId === user.id && activity.date === todayDate;
  }).minutesActive);

  $('#steps-user-steps-today').text(activityData.find(activity => {
    return activity.userId === user.id && activity.date === todayDate;
  }).steps);

  user.findFriendsTotalStepsForWeek(userRepository.users, todayDate);

  user.friendsActivityRecords.forEach(friend => {
    $('#dropdown-friends-steps-container').html(`
  <p class='dropdown-p friends-steps'>${friend.firstName} |  ${friend.totalWeeklySteps}</p>
  `);
  });

  function flipCard(cardToHide, cardToShow) {
    cardToHide.addClass('hide');
    cardToShow.removeClass('hide');
  }

function showInfo() {
  if ($(event.target).hasClass('steps-info-button')) {
    flipCard($('#steps-main-card'), $('#steps-info-card'));
  }
  if ($(event.target).hasClass('steps-friends-button')) {
    flipCard($('#steps-main-card'), $('#steps-friends-card'));
  }
  if ($(event.target).hasClass('steps-trending-button')) {
    flipCard($('#steps-main-card'), $('#steps-trending-card'));
  }
  if ($(event.target).hasClass('steps-calendar-button')) {
    flipCard($('#steps-main-card'), $('#steps-calendar-card'));
  }
  if ($(event.target).hasClass('hydration-info-button')) {
    flipCard($('#hydration-main-card'), $('#hydration-info-card'));
  }
  if ($(event.target).hasClass('hydration-friends-button')) {
    flipCard($('#hydration-main-card'), $('#hydration-friends-card'));
  }
  if ($(event.target).hasClass('hydration-calendar-button')) {
    flipCard($('#hydration-main-card'), $('#hydration-calendar-card'));
  }
  if ($(event.target).hasClass('stairs-info-button')) {
    flipCard($('#stairs-main-card'), $('#stairs-info-card'));
  }
  if ($(event.target).hasClass('stairs-friends-button')) {
    flipCard($('#stairs-main-card'), $('#stairs-friends-card'));
  }
  if ($(event.target).hasClass('stairs-trending-button')) {
    flipCard($('#stairs-main-card'), $('#stairs-trending-card'));
  }
  if ($(event.target).hasClass('stairs-calendar-button')) {
    flipCard($('#stairs-main-card'), $('#stairs-calendar-card'));
  }
  if ($(event.target).hasClass('sleep-info-button')) {
    flipCard($('#sleep-main-card'), $('#sleep-info-card'));
  }
  if ($(event.target).hasClass('sleep-friends-button')) {
    flipCard($('#sleep-main-card'), $('#sleep-friends-card'));
  }
  if ($(event.target).hasClass('sleep-calendar-button')) {
    flipCard($('#sleep-main-card'), $('#sleep-calendar-card'));
  }
  if ($(event.target).hasClass('steps-go-back-button')) {
    flipCard($(event.target).parent(), $('#steps-main-card'));
  }
  if ($(event.target).hasClass('hydration-go-back-button')) {
    flipCard($(event.target).parent(), $('#hydration-main-card'));
  }
  if ($(event.target).hasClass('stairs-go-back-button')) {
    flipCard($(event.target).parent(), $('#stairs-main-card'));
  }
  if ($(event.target).hasClass('sleep-go-back-button')) {
    flipCard($(event.target).parent(), $('#sleep-main-card'));
  }
}
})
.catch(error => console.log(error))

// let friendsStepsParagraphs = $('.friends-steps');

// friendsStepsParagraphs.forEach(paragraph => {
//   if (friendsStepsParagraphs[0] === paragraph) {
//     paragraph.addClass('green-text');
//   }
//   if (friendsStepsParagraphs[friendsStepsParagraphs.length - 1] === paragraph) {
//     paragraph.addClass('red-text');
//   }
//   if (paragraph.innerText.includes('YOU')) {
//     paragraph.addClass('yellow-text');
//   }