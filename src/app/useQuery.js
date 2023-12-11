import mysql2 from 'mysql2';

export const useQuery = query =>
  new Promise((resolve, reject) => {
    const Connection = mysql2.createConnection({
      host: process.env.NEXT_PUBLIC_SQL_HOST,
      port: '3306',
      user: process.env.NEXT_PUBLIC_SQL_USR,
      password: process.env.NEXT_PUBLIC_SQL_PWD,
      database: process.env.NEXT_PUBLIC_SQL_DATABASE
    })

    const result = Connection.query(query, (err, res, fields) => {
      resolve({ err, res, fields })
      Connection.end()
    })
  })
