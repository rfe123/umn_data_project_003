import pandas as pd

import sqlite3

# connect to db
conn= sqlite3.connect('ufo_db.sqlite')


# read the csv data into a dataframe
df = pd.read_csv('ufo_2019.csv')



# send it to the database (replace 'passenger' with your table name and 'id' with your primary key column)
df.to_sql('ufo', conn, index=False, if_exists='replace', dtype={'id': 'INTEGER PRIMARY KEY'})
conn.close()

