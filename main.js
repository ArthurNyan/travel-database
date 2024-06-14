const mysql = require('mysql');
const readline = require('readline');

// Конфигурация подключения к базе данных
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', // ваш пароль
  database: 'travelDB'
});

// Подключение к базе данных
connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных: ' + err.stack);
    return;
  }
  console.log('Успешное подключение к базе данных');
  mainMenu();
});

// Отображение главного меню
function mainMenu() {
  console.log("\nГлавное меню:");
  console.log("1. Отобразить содержимое таблицы");
  console.log("2. Удалить строку из таблицы");
  console.log("3. Добавить строку в таблицу");
  console.log("4. Обновить строку в таблице");
  console.log("5. Поиск билетов по ФИО");
  console.log("6. Поиск отелей по городу");
  console.log("7. Поиск городов по стране");
  console.log("8. Поиск вылетов по городу");
  console.log("9. Выход");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Выберите действие: ', (choice) => {
    if (choice === "1") {
      showTableMenu(rl);
    } else if (choice === "2") {
      deleteRowMenu(rl);
    } else if (choice === "3") {
      insertRowMenu(rl);
    } else if (choice === "4") {
      updateRowMenu(rl);
    } else if (choice === "5") {
      searchTicketsByPassengerName(rl);
    } else if (choice === "6") {
      searchHotelsByCity(rl);
    } else if (choice === "7") {
      searchCitiesByCountry(rl);
    } else if (choice === "8") {
      searchFlightsByDepartureCity(rl);
    } else if (choice === "9") {
      rl.close();
      connection.end();
    } else {
      console.log("Некорректный выбор");
      rl.close();
      mainMenu();
    }
  });
}

// Отображение меню для выбора таблицы
function showTableMenu(rl) {
  connection.query("SHOW TABLES", (error, tables, fields) => {
    if (error) {
      console.error('Ошибка выполнения запроса: ' + error.stack);
      rl.close();
      connection.end();
      return;
    }
    console.log("Доступные таблицы:");
    tables.forEach(table => console.log(table[Object.keys(table)[0]]));
    rl.question('Выберите таблицу: ', (table_name) => {
      displayTable(table_name, rl);
    });
  });
}

// Отображение содержимого таблицы
function displayTable(table_name, rl) {
  connection.query(`SELECT * FROM ${table_name}`, (error, results, fields) => {
    if (error) {
      console.error('Ошибка выполнения запроса: ' + error.stack);
      rl.close();
      connection.end();
      return;
    }
    console.log(`Содержимое таблицы ${table_name}:`);
    console.table(results);
    rl.close();
    mainMenu();
  });
}

// Удаление строки из таблицы
function deleteRowMenu(rl) {
  connection.query("SHOW TABLES", (error, tables, fields) => {
    if (error) {
      console.error('Ошибка выполнения запроса: ' + error.stack);
      rl.close();
      connection.end();
      return;
    }
    console.log("Доступные таблицы:");
    tables.forEach(table => console.log(table[Object.keys(table)[0]]));
    rl.question('Выберите таблицу: ', (table_name) => {
      rl.question('Введите значение для удаления: ', (column_value) => {
        deleteRow(table_name, column_value, rl);
      });
    });
  });
}

// Удаление строки
function deleteRow(table_name, column_value, rl) {
  connection.query(`SHOW COLUMNS FROM ${table_name}`, (error, columns, fields) => {
    if (error) {
      console.error('Ошибка выполнения запроса: ' + error.stack);
      rl.close();
      connection.end();
      return;
    }
    const column_name = columns[0].Field;
    connection.query(`DELETE FROM ${table_name} WHERE ${column_name} = ?`, [column_value], (error, results, fields) => {
      if (error) {
        console.error('Ошибка выполнения запроса: ' + error.stack);
        rl.close();
        connection.end();
        return;
      }
      console.log('Строка успешно удалена');
      rl.close();
      mainMenu();
    });
  });
}

// Вставка новой строки в таблицу
function insertRowMenu(rl) {
  connection.query("SHOW TABLES", (error, tables, fields) => {
    if (error) {
      console.error('Ошибка выполнения запроса: ' + error.stack);
      rl.close();
      connection.end();
      return;
    }
    console.log("Доступные таблицы:");
    tables.forEach(table => console.log(table[Object.keys(table)[0]]));
    rl.question('Выберите таблицу: ', (table_name) => {
      fillTable(table_name, rl);
    });
  });
}

// Заполнение новой строки
function fillTable(table_name, rl) {
  connection.query(`SHOW COLUMNS FROM ${table_name}`, (error, columns, fields) => {
    if (error) {
      console.error('Ошибка выполнения запроса: ' + error.stack);
      rl.close();
      connection.end();
      return;
    }
    const column_names = columns.map(column => column.Field);
    const values = [];
    function prompt(column_index) {
      if (column_index >= column_names.length) {
        connection.query(`INSERT INTO ${table_name} (${column_names.join(",")}) VALUES (?)`, [values], (error, results, fields) => {
          if (error) {
            console.error('Ошибка выполнения запроса: ' + error.stack);
            rl.close();
            connection.end();
            return;
          }
          console.log('Строка успешно добавлена');
          rl.close();
          mainMenu();
        });
      } else {
        rl.question(`Введите значение для ${column_names[column_index]}: `, (value) => {
          values.push(value);
          prompt(column_index + 1);
        });
      }
    }
    prompt(0);
  });
}

// Обновление строки в таблице
function updateRowMenu(rl) {
  connection.query("SHOW TABLES", (error, tables, fields) => {
    if (error) {
      console.error('Ошибка выполнения запроса: ' + error.stack);
      rl.close();
      connection.end();
      return;
    }
    console.log("Доступные таблицы:");
    tables.forEach(table => console.log(table[Object.keys(table)[0]]));
    rl.question('Выберите таблицу: ', (table_name) => {
      connection.query(`SHOW COLUMNS FROM ${table_name}`, (error, columns, fields) => {
        if (error) {
          console.error('Ошибка выполнения запроса: ' + error.stack);
          rl.close();
          connection.end();
          return;
        }
        const column_names = columns.map(column => column.Field);
        rl.question('Введите значение ключевого столбца для обновления: ', (key_value) => {
          const updates = {};
          function promptUpdate(column_index) {
            if (column_index >= column_names.length) {
              const setClause = Object.keys(updates).map(key => `${key} = ?`).join(", ");
              const values = Object.values(updates).concat(key_value);
              connection.query(`UPDATE ${table_name} SET ${setClause} WHERE ${column_names[0]} = ?`, values, (error, results, fields) => {
                if (error) {
                  console.error('Ошибка выполнения запроса: ' + error.stack);
                  rl.close();
                  connection.end();
                  return;
                }
                console.log('Строка успешно обновлена');
                rl.close();
                mainMenu();
              });
            } else {
              rl.question(`Введите новое значение для ${column_names[column_index]} (оставьте пустым для пропуска): `, (value) => {
                if (value) updates[column_names[column_index]] = value;
                promptUpdate(column_index + 1);
              });
            }
          }
          promptUpdate(1);
        });
      });
    });
  });
}

// Поиск билетов по ФИО
function searchTicketsByPassengerName(rl) {
  rl.question('Введите фамилию клиента: ', (surname) => {
    rl.question('Введите имя клиента: ', (firstname) => {
      rl.question('Введите отчество клиента: ', (middlename) => {
        const query = `
          SELECT 
            c.firstname, c.surname, c.middlename, t.*
          FROM 
            Clients c
          JOIN 
            TravelVouchers t ON c.client_id = t.client_id
          WHERE 
            c.firstname = ? AND c.surname = ? AND c.middlename = ?;
        `;
        connection.query(query, [firstname, surname, middlename], (error, results, fields) => {
          if (error) {
            console.error('Ошибка выполнения запроса: ' + error.stack);
            rl.close();
            connection.end();
            return;
          }
          console.log(`Найденные билеты для клиента '${firstname} ${middlename} ${surname}':`);
          console.table(results);
          rl.close();
          mainMenu();
        });
      });
    });
  });
}


// Поиск отелей по городу
function searchHotelsByCity(rl) {
  rl.question('Введите название города для поиска отелей: ', (city_name) => {
    connection.query(`SELECT * FROM Hotels h JOIN Cities c ON h.hotel_city_id = c.city_id WHERE c.city_name = ?`, [city_name], (error, results, fields) => {
      if (error) {
        console.error('Ошибка выполнения запроса: ' + error.stack);
        rl.close();
        connection.end();
        return;
      }
      console.log(`Найденные отели в городе '${city_name}':`);
      console.table(results);
      rl.close();
      mainMenu();
    });
  });
}

// Поиск городов по стране
function searchCitiesByCountry(rl) {
  rl.question('Введите название страны для поиска городов: ', (country_name) => {
    connection.query(`SELECT * FROM Cities c JOIN Countries co ON c.country_id = co.country_id WHERE co.country_name = ?`, [country_name], (error, results, fields) => {
      if (error) {
        console.error('Ошибка выполнения запроса: ' + error.stack);
        rl.close();
        connection.end();
        return;
      }
      console.log(`Найденные города в стране '${country_name}':`);
      console.table(results);
      rl.close();
      mainMenu();
    });
  });
}

// Поиск вылетов по городу
function searchFlightsByDepartureCity(rl) {
  rl.question('Введите название города для поиска вылетов: ', (city_name) => {
    connection.query(`SELECT * FROM Flights f JOIN Cities c ON f.arrival_city_id = c.city_id WHERE c.city_name = ?`, [city_name], (error, results, fields) => {
      if (error) {
        console.error('Ошибка выполнения запроса: ' + error.stack);
        rl.close();
        connection.end();
        return;
      }
      console.log(`Найденные вылеты из города '${city_name}':`);
      console.table(results);
      rl.close();
      mainMenu();
    });
  });
}
