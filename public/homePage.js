const logoutButton = new LogoutButton();

logoutButton.action = () => {
  ApiConnector.logout((response) => {
      if (response.success) {
          location.reload();
      } else {
          console.error('Ошибка при выходе из личного кабинета:', response.error);
      }
  });
}

ApiConnector.current((response) => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  } else {
    console.error('Ошибка получения данных пользователя:', response.error);
  }
});

const ratesBoard = new RatesBoard();

function fetchExchangeRates() {
  ratesBoard.clearTable();

  ApiConnector.getStocks((response) => {
    if (response.success) {
      ratesBoard.fillTable(response.data);
    } else {
      console.error('Ошибка получения курсов валют:', response.error);
    }
  });
}

fetchExchangeRates();

const updateInterval = 60000;
setInterval(fetchExchangeRates, updateInterval);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, 'Баланс успешно пополнен!');
    } else {
      moneyManager.setMessage(false, response.error);
    }
  });
};

moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, 'Конвертация выполнена успешно!');
    } else {
      moneyManager.setMessage(false, response.error);
    }
  });
};

moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, 'Перевод выполнен успешно!');
    } else {
      moneyManager.setMessage(false, response.error);
    }
  });
  
};

const favoritesWidget = new FavoritesWidget();

function fetchInitialFavorites() {
  ApiConnector.getFavorites((response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
    } else {
      console.error('Ошибка получения списка избранного:', response.error);
    }
  });
}

fetchInitialFavorites();

favoritesWidget.addUserCallback = (data) => {
  ApiConnector.addUserToFavorites(data, (response) => {
    if (response.success) {
      fetchInitialFavorites();
      favoritesWidget.setMessage(true, 'Пользователь добавлен в избранное!');
    } else {
      favoritesWidget.setMessage(false, response.error);
    }
  });
};

favoritesWidget.removeUserCallback = (id) => {
  ApiConnector.removeUserFromFavorites(id, (response) => {
    if (response.success) {
      fetchInitialFavorites();
      favoritesWidget.setMessage(true, 'Пользователь удален из избранного!');
    } else {
      favoritesWidget.setMessage(false, response.error);
    }
  });
};