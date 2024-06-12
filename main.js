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
  console.log("5. Выход");

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
