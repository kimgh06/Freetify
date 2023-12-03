import mysql2 from 'mysql2';

const Connection = mysql2.createConnection({
  host: process.env.NEXT_PUBLIC_SQL_HOST,
  port: '3306',
  user: process.env.NEXT_PUBLIC_SQL_USR,
  password: process.env.NEXT_PUBLIC_SQL_PWD,
  database: process.env.NEXT_PUBLIC_SQL_DATABASE
})

export const useQuery = async query => {
  Connection.query(query, (err, res, fields) => {
    console.log(res);
  })
}
