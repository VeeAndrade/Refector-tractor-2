class Hydration {
  constructor(data, userRepository) {
    this.userId = data.userID;
    this.date = data.date;
    this.ounces = data.numOunces;
    this.drink(userRepository);
  }
  drink(userRepo) {
    let mainUser = userRepo.users.find(user => user.id === this.userId)
    return mainUser.updateHydration(this.date, this.ounces);
  }
}

export default Hydration;
