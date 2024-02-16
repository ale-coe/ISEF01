const localDbName = 'localDb.db';
const { hashSync } = require('bcrypt');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(localDbName);

const users = [
  { username: 'test1@mail.de', password: '123' },
  { username: 'test2@mail.de', password: '123' },
  { username: 'test3@mail.de', password: '123' },
];

const questions = [
  {
    question: 'Wie viele Kontinente gibt es auf der Erde?',
    options: ['5', '6', '7', '8'],
    correct_answer: '7',
  },
  {
    question: 'Wer schrieb Romeo und Julia?',
    options: [
      'Leo Tolstoi',
      'William Shakespeare',
      'Johann Wolfgang von Goethe',
      'Charles Dickens',
    ],
    correct_answer: 'William Shakespeare',
  },
  {
    question: 'Wie heißt das größte Organ des menschlichen Körpers?',
    options: ['Herz', 'Leber', 'Haut', 'Lunge'],
    correct_answer: 'Haut',
  },
  {
    question: 'Was misst die Einheit Hertz?',
    options: ['Geschwindigkeit', 'Helligkeit', 'Frequenz', 'Gewicht'],
    correct_answer: 'Frequenz',
  },
  {
    question: 'In welchem Land liegt die Stadt Timbuktu?',
    options: ['Mali', 'Marokko', 'Ägypten', 'Tschad'],
    correct_answer: 'Mali',
  },
  {
    question: 'Wie viele Elemente gibt es im Periodensystem (Stand 2023)?',
    options: ['102', '118', '120', '98'],
    correct_answer: '118',
  },
  {
    question: 'Wer ist der Hauptdarsteller in Forrest Gump?',
    options: ['Tom Hanks', 'Brad Pitt', 'Johnny Depp', 'Leonardo DiCaprio'],
    correct_answer: 'Tom Hanks',
  },
  {
    question: 'Welcher Planet ist als der rote Planet bekannt?',
    options: ['Mars', 'Jupiter', 'Venus', 'Saturn'],
    correct_answer: 'Mars',
  },
  {
    question: 'In welchem Jahrzehnt endete der Zweite Weltkrieg?',
    options: ['1930er', '1940er', '1950er', '1960er'],
    correct_answer: '1940er',
  },
  {
    question: 'Wie viele Streifen hat die US-Flagge?',
    options: ['13', '50', '11', '14'],
    correct_answer: '13',
  },
  {
    question: 'Was ist die Hauptzutat in traditionellem Sushi?',
    options: ['Reis', 'Fisch', 'Sojasauce', 'Seetang'],
    correct_answer: 'Reis',
  },
  {
    question: 'Welches Land hat die größte Bevölkerung?',
    options: ['USA', 'China', 'Indien', 'Brasilien'],
    correct_answer: 'China',
  },
  {
    question: 'Welches ist das am tiefsten liegende Land der Welt?',
    options: ['Niederlande', 'Maldiven', 'Bangladesch', 'Monaco'],
    correct_answer: 'Maldiven',
  },
  {
    question: 'Welcher Fluss ist der längste der Welt?',
    options: ['Nil', 'Amazonas', 'Jangtsekiang', 'Mississippi'],
    correct_answer: 'Amazonas',
  },
  {
    question: 'Welches Tier wird als König der Tiere bezeichnet?',
    options: ['Löwe', 'Tiger', 'Elefant', 'Adler'],
    correct_answer: 'Löwe',
  },
  {
    question: 'Wie viele Planeten hat unser Sonnensystem?',
    options: ['7', '8', '9', '10'],
    correct_answer: '8',
  },
  {
    question: 'Welches Land gewann die Fußball-Weltmeisterschaft 2014?',
    options: ['Deutschland', 'Brasilien', 'Argentinien', 'Niederlande'],
    correct_answer: 'Deutschland',
  },
  {
    question: 'Was ist die Hauptstadt von Australien?',
    options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
    correct_answer: 'Canberra',
  },
  {
    question: 'Wer erfand die Glühbirne?',
    options: [
      'Thomas Edison',
      'Nikola Tesla',
      'Alexander Graham Bell',
      'Albert Einstein',
    ],
    correct_answer: 'Thomas Edison',
  },
  {
    question: 'Welches Land ist bekannt für seine Pyramiden?',
    options: ['Mexiko', 'Peru', 'Ägypten', 'Sudan'],
    correct_answer: 'Ägypten',
  },
  {
    question: 'Wie viele Bundesstaaten hat die USA?',
    options: ['50', '48', '52', '45'],
    correct_answer: '50',
  },
  {
    question:
      'Welche Farbe hat kein Stern auf der Flagge der Vereinigten Staaten?',
    options: ['Rot', 'Weiß', 'Blau', 'Es gibt keine Sterne'],
    correct_answer: 'Rot',
  },
  {
    question: 'In welchem Jahr fiel die Berliner Mauer?',
    options: ['1987', '1989', '1991', '1993'],
    correct_answer: '1989',
  },
  {
    question: 'Welches Organ filtert das Blut?',
    options: ['Herz', 'Lunge', 'Leber', 'Niere'],
    correct_answer: 'Niere',
  },
  {
    question: 'Wer malte Das letzte Abendmahl?',
    options: ['Leonardo da Vinci', 'Michelangelo', 'Raffael', 'Donatello'],
    correct_answer: 'Leonardo da Vinci',
  },
  {
    question: 'Wie viele Zähne hat ein normaler erwachsener Mensch?',
    options: ['32', '28', '30', '34'],
    correct_answer: '32',
  },
  {
    question: 'Welches Land hat die Form eines Stiefels?',
    options: ['Spanien', 'Italien', 'Frankreich', 'Griechenland'],
    correct_answer: 'Italien',
  },
  {
    question: 'Was ist die chemische Formel für Wasser?',
    options: ['CO2', 'H2O', 'O2', 'NaCl'],
    correct_answer: 'H2O',
  },
  {
    question: 'Wer ist der Autor von Harry Potter?',
    options: [
      'J.K. Rowling',
      'Stephen King',
      'J.R.R. Tolkien',
      'George R.R. Martin',
    ],
    correct_answer: 'J.K. Rowling',
  },
  {
    question: 'Welcher ist der kleinste Planet in unserem Sonnensystem?',
    options: ['Merkur', 'Mars', 'Venus', 'Pluto'],
    correct_answer: 'Merkur',
  },
  {
    question: 'Was ist die schnellste Landtier der Welt?',
    options: ['Gepard', 'Löwe', 'Pferd', 'Strauß'],
    correct_answer: 'Gepard',
  },
  {
    question: 'In welchem Land wurde der Tee erfunden?',
    options: ['Indien', 'China', 'Japan', 'England'],
    correct_answer: 'China',
  },
  {
    question: 'Wie viele Herzkammern hat ein menschliches Herz?',
    options: ['2', '4', '6', '8'],
    correct_answer: '4',
  },
  {
    question: 'Welches Gebäude war bis 1930 das höchste der Welt?',
    options: [
      'Eiffelturm',
      'Chrysler Building',
      'Empire State Building',
      'Burj Khalifa',
    ],
    correct_answer: 'Chrysler Building',
  },
  {
    question: 'Welches Land ist der größte Produzent von Kaffee?',
    options: ['Kolumbien', 'Indonesien', 'Brasilien', 'Äthiopien'],
    correct_answer: 'Brasilien',
  },
  {
    question: 'Wer komponierte die Zauberflöte?',
    options: [
      'Wolfgang Amadeus Mozart',
      'Ludwig van Beethoven',
      'Johann Sebastian Bach',
      'Franz Schubert',
    ],
    correct_answer: 'Wolfgang Amadeus Mozart',
  },
  {
    question: 'Welches ist das größte Land der Welt?',
    options: ['Kanada', 'China', 'USA', 'Russland'],
    correct_answer: 'Russland',
  },
  {
    question: 'Welcher Ozean ist der größte?',
    options: [
      'Atlantischer Ozean',
      'Indischer Ozean',
      'Pazifischer Ozean',
      'Arktischer Ozean',
    ],
    correct_answer: 'Pazifischer Ozean',
  },
  {
    question: 'In welchem Jahr wurde das erste iPhone vorgestellt?',
    options: ['2005', '2007', '2009', '2011'],
    correct_answer: '2007',
  },
  {
    question: 'Wie viele Tasten hat ein klassisches Klavier?',
    options: ['66', '76', '88', '98'],
    correct_answer: '88',
  },
  {
    question: 'Wer ist der griechische Gott des Krieges?',
    options: ['Zeus', 'Ares', 'Hermes', 'Apollo'],
    correct_answer: 'Ares',
  },
  {
    question: 'Welches Element hat das chemische Symbol O?',
    options: ['Gold', 'Sauerstoff', 'Silber', 'Osmium'],
    correct_answer: 'Sauerstoff',
  },
  {
    question: 'Welche Stadt ist als die Stadt der Liebe bekannt?',
    options: ['Rom', 'Paris', 'Venedig', 'Barcelona'],
    correct_answer: 'Paris',
  },
  {
    question: 'Wie viele Streifen sind auf der Flagge Deutschlands?',
    options: ['2', '3', '4', '5'],
    correct_answer: '3',
  },
  {
    question: 'Wer hat die Relativitätstheorie formuliert?',
    options: [
      'Isaac Newton',
      'Albert Einstein',
      'Niels Bohr',
      'Galileo Galilei',
    ],
    correct_answer: 'Albert Einstein',
  },
  {
    question: 'Wie viele Ringe hat das Olympische Symbol?',
    options: ['4', '5', '6', '7'],
    correct_answer: '5',
  },
  {
    question: 'Was ist das härteste natürliche Material auf der Erde?',
    options: ['Gold', 'Diamant', 'Platin', 'Graphit'],
    correct_answer: 'Diamant',
  },
  {
    question: 'Welches Tier gilt als das schnellste im Wasser?',
    options: ['Delfin', 'Hai', 'Sailfish', 'Wal'],
    correct_answer: 'Sailfish',
  },
  {
    question:
      'Welcher US-Präsident ist auf dem Mount Rushmore nicht abgebildet?',
    options: [
      'Thomas Jefferson',
      'Abraham Lincoln',
      'Theodore Roosevelt',
      'Franklin D. Roosevelt',
    ],
    correct_answer: 'Franklin D. Roosevelt',
  },
  {
    question: 'Welche Sprache hat die meisten Muttersprachler weltweit?',
    options: ['Englisch', 'Mandarin', 'Spanisch', 'Hindi'],
    correct_answer: 'Mandarin',
  },
  {
    question: 'Was ist die Hauptstadt von Kanada?',
    options: ['Toronto', 'Montreal', 'Vancouver', 'Ottawa'],
    correct_answer: 'Ottawa',
  },
  {
    question: 'Welcher Fluss fließt durch Paris?',
    options: ['Rhein', 'Themse', 'Seine', 'Donau'],
    correct_answer: 'Seine',
  },
  {
    question: 'Welches Land hat die längste Küstenlinie?',
    options: ['USA', 'Russland', 'Australien', 'Kanada'],
    correct_answer: 'Kanada',
  },
];

const initDb = async () => {
  await new Promise((res) => {
    db.serialize(async () => {
      try {
        db.run(
          `CREATE TABLE users (id INTEGER PRIMARY KEY, mail TEXT, password TEXT);`,
        );

        db.run(`CREATE TABLE games (id INTEGER PRIMARY KEY, isCoop Integer);`);
        db.run(
          `CREATE TABLE gamesQuestions (id INTEGER PRIMARY KEY, gameId Integer, questionId integer, FOREIGN KEY(questionId) REFERENCES questions(id), FOREIGN KEY(gameId) REFERENCES games(id));`,
        );
        db.run(
          `CREATE TABLE gamesUsers (id INTEGER PRIMARY KEY, gameId Integer, userId integer, correct INTEGER, incorrect INTEGER, FOREIGN KEY(gameId) REFERENCES games(id));`,
        );

        db.run(
          `CREATE TABLE questions (id INTEGER PRIMARY KEY, question TEXT, inEdit INTEGER);`,
        );
        db.run(
          `CREATE TABLE answers (id INTEGER PRIMARY KEY, questionId INTEGER, answer TEXT, isCorrect INTEGER, CONSTRAINT fk_question FOREIGN KEY(questionId) REFERENCES questions(id) ON DELETE CASCADE);`,
        );
        db.run(
          `CREATE TABLE reasonWrongAnswer (id INTEGER PRIMARY KEY, answerId INTEGER, reason TEXT, CONSTRAINT fk_answer FOREIGN KEY(answerId) REFERENCES answers(id) ON DELETE CASCADE);`,
        );

        const mapUsers = users.map(
          ({ password, username }) =>
            `('${username}', '${hashSync(password, 10)}')`,
        );
        db.prepare(`INSERT INTO users (mail, password) VALUES ${mapUsers};`)
          .run()
          .finalize();

        for (const question of questions) {
          const stmtQuestion = db.prepare(
            `INSERT INTO questions (question, inEdit) VALUES ('${question.question}', 0);`,
          );

          const id = await new Promise((res) => {
            stmtQuestion.run(function () {
              stmtQuestion.finalize();
              res(this.lastID);
            });
          });

          for (const answer of question.options) {
            const stmtAnswer = db.prepare(
              `INSERT INTO answers (questionId, answer, isCorrect) VALUES (${id}, '${answer}', ${answer === question.correct_answer ? 1 : 0});`,
            );

            await new Promise((res) => {
              stmtAnswer.run(() => {
                stmtAnswer.finalize();
                res();
              });
            });
          }
        }
      } catch (e) {
        console.log('error', e);
      }
      res();
    });
  });

  db.close();
};

initDb();
